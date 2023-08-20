import { PageModifiedEvent } from "$sb/app_event.ts";
import { editor, markdown, space } from "$sb/silverbullet-syscall/mod.ts";
import {  ParseTree, findNodeOfType, replaceNodesMatching, renderToText} from "$sb/lib/tree.ts";
import { Range, rangesOverlap } from "$sb/lib/change.ts";
import { resolvePath } from "$sb/lib/resolve.ts";

export function findNodeTypeInRange(tree: ParseTree, type: string, range: Range): ParseTree | null {
    if (tree.from === undefined || tree.to === undefined) {
        console.warn("findNodeTypeInRange: Node does not have a defined range  ", tree);
        return null;
    }

    if (rangesOverlap(range, tree as Range)) {
        if (tree.type === type) {
            return tree;
        }
        if (tree.children) {
            for (const child of tree.children) {
                const result = findNodeTypeInRange(child, type, range);
                if (result) {
                    return result;
                }
            }
        }
    }

    return null
}

export type ChainSyncLinkInfo = {
    page: string;
    pos: number;
}

export async function onPageModified(ev: PageModifiedEvent): Promise<void> {
    const pageName = await editor.getCurrentPage();
    const doc = await editor.getText();
    const pageTree = await markdown.parseMarkdown(doc);
    for await(const change of ev.changes) {
        const taskAtPos = findNodeTypeInRange(pageTree, "Task", change.oldRange);
        if (taskAtPos) {
            console.log("found task ", taskAtPos)
            let link: ChainSyncLinkInfo | undefined;

            // look for any chain icon wiki links in the tree, remove them and copy out their info.
            replaceNodesMatching(taskAtPos, (node) => {
                if (node.type === "WikiLink") {
                    console.log("found wiki link ", node)
                    const wikiLinkAlias = findNodeOfType(node, "WikiLinkAlias");
                    if (wikiLinkAlias?.children![0].text! === "🔗") {
                        const wikiLinkPage = findNodeOfType(node, "WikiLinkPage")!;
                        console.log("found chain link page = ", wikiLinkPage);
                        try {
                            const [targetPageName, targetLoc] = resolvePath(pageName, wikiLinkPage.children![0].text!).split("@");
                            
                            link = { page: targetPageName, pos: Number.parseInt(targetLoc, 10)}
                            return null;
                        } catch(e) {
                            console.log(e);
                        }
                    }
                }

                return node;
            });

            if (link) {
                console.log(`chain link to "${link.page}@${link.pos}" from "${pageName}"`);

                if (link.page == pageName) {
                    console.log("same page, skipping")
                    continue
                }
                const targetDoc = await space.readPage(link.page);
                const targetParseTree = await markdown.parseMarkdown(targetDoc);
                const targetNode = findNodeTypeInRange(targetParseTree, "Task", {from: link.pos, to: link.pos + 1});
                if (targetNode) {
                    const srcTaskText = renderToText(taskAtPos);
                    const destTaskText = targetDoc.slice(targetNode.from, targetNode.to);
                    if (srcTaskText !== destTaskText) {
                        console.log(`src and dest do not match: "${srcTaskText}" !== "${destTaskText}"`)
                        const newTargetDoc = targetDoc.slice(0, targetNode.from) + srcTaskText + targetDoc.slice(targetNode.to);
                        await space.writePage(link.page, newTargetDoc);
                    }
                }
            }
            console.log(taskAtPos)
        }
    }
}