import React from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../component/icon";
import { SelectorView } from "./render";
export type SelectorMenuItemType = {
    name?: string,
    type?: 'devide' | 'text' | 'option',
    text?: string,
    icon?: string,
    label?: string,
    childs?: SelectorMenuItemType[]
}

export class SelectorMenu extends React.Component<{ selectorView: SelectorView }>{
    private node: HTMLElement;
    constructor(props) {
        super(props);
        this.node = document.body.appendChild(document.createElement('div'));
    }
    get selector() {
        return this.props.selectorView;
    }
    open(event: MouseEvent) {
        this.x = event.x;
        this.y = event.y;
        this.visible = true;
    }
    mousedown(item: SelectorMenuItemType, event: MouseEvent) {

    }
    private visible: boolean = false;
    private x: number;
    private y: number;
    private items: SelectorMenuItemType[] = [];
    renderItem(item: SelectorMenuItemType) {
        return <div className='sy-selector-menu-item-box'>
            <div className='sy-selector-menu-item'>
                {(item.type == 'option' || !item.type) && <a className='sy-selector-menu-item-option' onMouseDown={e => this.mousedown(item, e.nativeEvent)}>
                    <Icon icon={item.icon}></Icon><span>{item.text}</span>
                    {item.label && <label>{item.label}</label>}
                    {item.childs && item.childs.length > 0 && <Icon icon='arrow-right:sy'></Icon>}
                </a>}
                {item.type == 'devide' && <a className='sy-selector-menu-item-devide'></a>}
                {item.type == 'text' && <a className='sy-selector-menu-item-text'>{item.text}</a>}
            </div>
            {item.childs && item.childs.length > 0 && <div className='sy-selector-menu-childs'>
                {item.childs.map(it => this.renderItem(it))}
            </div>}
        </div>
    }
    render() {
        var style: Record<string, any> = {};
        style.top = this.y;
        style.left = this.x;
        return createPortal(
            <div>
                {this.visible == true && <div className='sy-selector-menu'>
                    <div className='sy-selector-menu-cove'></div>
                    <div className='sy-selector-menu-box' style={style}>
                        {this.items.map(g => this.renderItem(g))}
                    </div>
                </div>}
            </div>,
            this.node);
    }
    componentWillUnmount() {
        this.node.remove();
    }
}