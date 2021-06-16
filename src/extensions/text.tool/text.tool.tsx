import React from "react";
import { createPortal } from "react-dom";
import { Point } from "../../common/point";
import { Icon } from "../../component/icon";
import Equation from "../../assert/svg/equation.svg";
import Mention from "../../assert/svg/mention.svg";
import { Dragger } from "../../common/dragger";
import { TextCommand } from "./text.command";
import { SyExtensionsComponent } from "../sy.component";
import { BlockCssName, FillCss } from "../../block/pattern/css";

export type TextToolStyle = {
    link: string,
    blockUrl: string,
    bold: number,
    italic: boolean,
    textDecoration: string,
    code: boolean,
    equation: boolean,
    color: string,
    fill: FillCss
}
export class TextTool extends SyExtensionsComponent {
    private node: HTMLElement;
    private textStyle: TextToolStyle = {

    } as any;
    constructor(props) {
        super(props);
        this.node = document.body.appendChild(document.createElement('div'));
    }
    open(event: MouseEvent) {
        this.point = Point.from(event);
        this.visible = true;
        this.textStyle = this.emit('getTextStyle');
        this.forceUpdate();
    }
    close() {
        if (this.visible == true) {
            this.visible = false;
            this.forceUpdate();
        }
    }
    get isVisible() {
        return this.visible;
    }
    private visible: boolean = false;
    private point: Point = new Point(0, 0);
    render() {
        var style: Record<string, any> = {};
        style.top = this.point.y;
        style.left = this.point.x;
        return createPortal(
            <div >
                {this.visible == true && <div className='sy-tool-text-menu' style={style}>
                    <div className='sy-tool-text-menu-item sy-tool-text-menu-devide' onMouseDown={e => this.onOpenBlockSelector()}><span>Text</span><Icon icon='arrow-down:sy'></Icon></div>
                    <div className='sy-tool-text-menu-item sy-tool-text-menu-devide' onMouseDown={e => this.onOpenLink()}><Icon icon='link:sy'></Icon><Icon icon='arrow-down:sy'></Icon></div>
                    <div className='sy-tool-text-menu-item sy-tool-text-menu-devide' onMouseDown={e => this.onOpenComment()}><Icon icon='comment:sy'></Icon></div>
                    <div className='sy-tool-text-menu-item' onMouseDown={e => this.onExcute(TextCommand.bold)}><Icon icon='bold:sy'></Icon></div>
                    <div className='sy-tool-text-menu-item' onMouseDown={e => this.onExcute(TextCommand.italic)}><Icon icon='italic:sy'></Icon></div>
                    <div className='sy-tool-text-menu-item' onMouseDown={e => this.onExcute(TextCommand.underline)}><Icon icon='underline:sy'></Icon></div>
                    <div className='sy-tool-text-menu-item' onMouseDown={e => this.onExcute(TextCommand.deleteLine)}><Icon icon='delete-line:sy'></Icon></div>
                    <div className='sy-tool-text-menu-item' onMouseDown={e => this.onExcute(TextCommand.code)}><Icon icon='code:sy'></Icon></div>
                    <div className='sy-tool-text-menu-item' onMouseDown={e => this.onExcute(TextCommand.equation)}><Icon icon={Equation}></Icon></div>
                    <div className='sy-tool-text-menu-item' onMouseDown={e => this.onOpenFontColor()}><span>A</span><Icon icon='arrow-down:sy'></Icon></div>
                    <div className='sy-tool-text-menu-item'><Icon icon={Mention}></Icon></div>
                </div>}
            </div>,
            this.node);
    }
    private dragger: Dragger;
    componentDidMount() {
        this.dragger = new Dragger(this.node);
        this.dragger.bind();
    }
    componentWillUnmount() {
        if (this.dragger) this.dragger.off()
        this.node.remove();
    }
    get isDown() {
        return this.dragger.isDown;
    }
    onExcute(command: TextCommand) {
        var font: Record<string, any> = {};
        switch (command) {
            case TextCommand.bold:
                font.fontWeight = 'bold';
                break;
            case TextCommand.cancelBold:
                font.fontWeight = 'normail';
                break;
            case TextCommand.italic:
                font.fontStyle = 'italic';
                break;
            case TextCommand.cancelItalic:
                font.fontStyle = 'normail';
                break;
            case TextCommand.deleteLine:
                font.textDecoration = 'line-through';
                break;
            case TextCommand.underline:
                font.textDecoration = 'underline';
                break;
            case TextCommand.cancelLine:
                font.textDecoration = 'none';
                break;
        }
        this.emit('setStyle', { [BlockCssName.font]: font } as any);
        this.close();
    }
    onOpenFontColor() {

    }
    onOpenLink() {

    }
    onOpenComment() {

    }
    onOpenBlockSelector() {

    }
}
export interface TextTool {
    on(name: 'setStyle', fn: (styles: Record<BlockCssName, Record<string, any>>) => void);
    emit(name: 'setStyle', styles: Record<BlockCssName, Record<string, any>>);
    on(name: 'error', fn: (error: Error) => void);
    emit(name: 'error', error: Error);
    emit(name: 'getTextStyle'): TextToolStyle;
    on(name: 'getTextStyle', fn: () => TextToolStyle)
}