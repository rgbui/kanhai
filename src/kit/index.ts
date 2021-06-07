import { Point } from "../common/point";
import { Page } from "../page";
import { Events } from "../util/events";
import { Bar } from "./handle";
import { TextInput } from "./input";
import { Anchor } from "./selection/anchor";
import { SelectionExplorer } from "./selection/explorer";
import { Selector } from "./selector";
import { KitView } from "./view";
export class Kit extends Events {
    page: Page;
    constructor(page: Page) {
        super();
        this.page = page;
        this.selector = new Selector(this);
        this.explorer = new SelectionExplorer(this);
        this.textInput = new TextInput(this);
        this.bar = new Bar(this);
    }
    textInput: TextInput;
    selector: Selector;
    explorer: SelectionExplorer;
    bar: Bar;
    private isDown: boolean = false;
    private isMove: boolean = false;
    private downEvent: MouseEvent;
    private downAnchor: Anchor;
    view: KitView;
    acceptMousedown(event: MouseEvent) {
        var target = event.target as HTMLElement;
        var block = this.page.getEleBlock(target);
        this.downEvent = event;
        this.isDown = true;
        if (block && !block.isLayout) {
            var anchor = block.visibleAnchor(Point.from(this.downEvent));
            if (anchor) {
                this.downAnchor = anchor;
                this.explorer.onFocusAnchor(this.downAnchor);
            }
        }
    }
    acceptMousemove(event: MouseEvent) {
        var ele = event.target as HTMLElement;
        if (this.isDown == true) {
            var downPoint = Point.from(this.downEvent);
            if (downPoint.remoteBy(Point.from(event), 5)) {
                this.isMove = true;
                if (!this.downAnchor)
                    this.selector.setStart(downPoint)
            }
            if (this.isMove == true) {
                if (!this.downAnchor) {
                    this.selector.setMove(Point.from(event));
                }
                else {
                    var block = this.page.getEleBlock(ele);
                    if (block && !block.isLayout) {
                        var anchor = block.visibleAnchor(downPoint);
                        if (anchor) {
                            this.explorer.onShiftFocusAnchor(anchor);
                        }
                    }
                }
            }
        }
        /**
         * 注意这个是鼠标移动，鼠标不一定是在当前的内容页上按下mosuedown的
         */
        var hoverBlock;
        if (this.page.el.contains(ele)) {
            var block = this.page.searchBlockByMouse(event);
            if (block && !block.isLayout) hoverBlock = block;
        }
        this.bar.onHoverBlock(hoverBlock, event);
    }
    acceptMouseup(event: MouseEvent) {
        if (this.isDown) {
            if (this.isMove) {
                if (!this.downAnchor)
                    this.selector.close();
                this.isMove = false;
            }
            this.isDown = false;
        }
    }
}