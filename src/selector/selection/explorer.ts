import { Selector } from "..";
import { Events } from "../../util/events";
import { Anchor } from "./anchor";
import { BlockSelection } from "./selection";

export class SelectionExplorer extends Events {
    selections: BlockSelection[] = [];
    selector: Selector;
    constructor(selector: Selector) {
        super();
        this.selector = selector;
    }
    get page() {
        return this.selector.page;
    }
    activeAnchor: Anchor;
    setActiveAnchor(anchor: Anchor) {
        this.activeAnchor = anchor;
        if (anchor.isText) {
            this.selector.view.textInput.onStartInput(anchor);
        }
        this.page.emit('focusAnchor', this.activeAnchor);
        if (anchor != this.activeAnchor) {
            this.page.emit('changeAnchor', this.activeAnchor);
        }
    }
    get hasSelectionRange() {
        if (this.selections.length > 0) {
            return this.selections.exists(g => g.hasRange)
        }
        return false;
    }
    get isOnlyOneAnchor() {
        if (this.selections.length == 1) {
            return this.selections.trueForAll(g => g.isOnlyAnchor)
        }
        return false;
    }
    createSelection() {
        var sel = new BlockSelection(this);
        return sel;
    }
    replaceSelection(anchor: Anchor) {
        if (this.selections.length > 0) {
            this.selections.each((sel, i) => {
                if (i > 0) sel.dispose();
            });
            var sel = this.selections.first();
            if (sel.end) sel.end.dispose();
            if (sel.start) { anchor.acceptView(sel.start); sel.start = anchor; }
            this.selections = [sel];
        }
        else {
            var sel = this.createSelection();
            sel.start = anchor;
            this.selections = [sel];
        }
    }
    joinSelection(anchor: Anchor) {
        if (this.selections.length > 0) {
            var sel = this.selections.find(g => g.start == this.activeAnchor || g.end == this.activeAnchor);
            if (sel) {
                if (sel.end) { anchor.acceptView(sel.end); sel.end = anchor }
                else sel.end = anchor;
            }
        }
    }
    renderSelection() {
        this.selections.each(sel => {
            sel.visible();
        });
    }
    createAnchor() {
        return new Anchor(this);
    }
}