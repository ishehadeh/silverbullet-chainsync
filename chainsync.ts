import { PageModifiedEvent } from "$sb/app_event.ts";
import { editor, markdown, space } from "$sb/silverbullet-syscall/mod.ts";
import {  ParseTree, findNodeOfType, traverseTree, nodeAtPos, traverseTreeAsync} from "$sb/lib/tree.ts";
import { Range, rangesOverlap } from "$sb/lib/change.ts";
import { resolvePath } from "$sb/lib/resolve.ts";
import { events, mq } from "$sb/plugos-syscall/mod.ts";

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
export async function onPageModified(ev: PageModifiedEvent): Promise<void> {
    const pageName = await editor.getCurrentPage();
    const doc = await editor.getText();
    const pageTree = await markdown.parseMarkdown(doc);
    for (const change of ev.changes) {
        const taskAtPos = findNodeTypeInRange(pageTree, "Task", change.oldRange);
        if (taskAtPos) {
            console.log("found task ", taskAtPos)
            traverseTreeAsync(taskAtPos, async (node) => {
                console.log(node)
                if (node.type === "WikiLink") {
                    console.log("found wiki link ", node)
                    const wikiLinkAlias = findNodeOfType(node, "WikiLinkAlias");
                    console.log("alias text  ", wikiLinkAlias?.children![0].text! )
                    if (wikiLinkAlias?.children![0].text! === "🔗") {
                        const wikiLinkPage = findNodeOfType(node, "WikiLinkPage")!;
                        console.log("found chain link page = ", wikiLinkPage);
                        try {
                            const [targetPageName, targetLoc] = resolvePath(pageName, wikiLinkPage.children![0].text!).split("@");
                            console.log(`chain link to "${targetPageName}@${targetLoc}" from "${pageName}"`);
                            if (targetPageName == pageName) {
                                console.log("same page, skipping")
                                return true;
                            }
                            const targetDoc = await space.readPage(targetPageName);
                            const targetParseTree = await markdown.parseMarkdown(targetDoc);
                            const targetNode = nodeAtPos(targetParseTree, Number.parseInt(targetLoc, 10));
                            if (targetNode) {
                                const srcTaskText = doc.slice(taskAtPos.from, taskAtPos.to);
                                const newTargetDoc = targetDoc.slice(0, targetNode.from) + srcTaskText + targetDoc.slice(taskAtPos.from);
                                await space.writePage(targetPageName, newTargetDoc);
                            }
                        } catch(e) {
                            console.log(e);
                        }
                    }

                    return true;
                }

                return false;
            })
            console.log(taskAtPos)
        }
    }
}