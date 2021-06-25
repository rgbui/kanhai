
import { BlockView } from "../../src/block/view";
import { BlockComposition } from "../../src/block/layout/composition/block";
import React from 'react';
import { BlockAppear, BlockDisplay } from "../../src/block/partial/enum";
import { url, view } from "../../src/block/factory/observable";
import { TextArea } from "../../src/block/partial/appear";
/***
 * 文字型的block，
 * 注意该文字block里面含有子文字或其它的如图像block等
 */
@url('/text')
export class TextContent extends BlockComposition {
    display = BlockDisplay.inline;
    appear = BlockAppear.text;
    get isTextContent(){
        return true;
    }
}
@view('/text')
export class TextContentView extends BlockView<TextContent>{
    render() {
        return <span className='sy-block-text-content'  style={this.block.visibleStyle} >
            <TextArea html={this.block.htmlContent}></TextArea>
        </span>
    }
}

