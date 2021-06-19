
import { BlockView } from "../../../src/block/view";
import { url, view } from "../../../src/block/factory/observable";
import { TextSpan } from "../../general/textspan";
import React from 'react';
import { ChildsArea, TextArea } from "../../../src/block/partial/appear";
@url('/list/text')
export class ListText extends TextSpan {
    partName = 'text';
    get isRow() {
        return true;
    }
}
@view('/list/text')
export class ListTextView extends BlockView<ListText>{
    render() {
        var style: Record<string, any> = {

        };
        if (this.block.childs.length > 0)
            return <span className='sy-block-list-text-span' style={style}  ref={e => this.block.childsEl = e}><ChildsArea childs={this.block.childs} /></span>
        else
            return <span className='sy-block-list-text-span' style={style}><TextArea html={this.block.htmlContent}></TextArea></span>
    }
}