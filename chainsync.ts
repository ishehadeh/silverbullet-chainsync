import { PageModifiedEvent } from "$sb/app_event.ts";
import { editor, markdown } from "$sb/silverbullet-syscall/mod.ts";
import {  ParseTree} from "$sb/lib/tree.ts";
import { Range, rangesOverlap } from "$sb/lib/change.ts";

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
    const doc = await editor.getText();
    const pageTree = await markdown.parseMarkdown(doc);
    for(const change of ev.changes) {
        const taskAtPos = findNodeTypeInRange(pageTree, "Task", change.oldRange);
        if (taskAtPos) {
            console.log(taskAtPos)
        }
    }
}