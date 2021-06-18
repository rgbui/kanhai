import { BaseComponent } from "../../src/block/component";
import katex from 'katex';
import React from 'react';
import { prop, url, view } from "../../src/block/factory/observable";
import "../../../node_modules/katex/dist/katex.min.css";
import { SolidArea } from "../../src/block/base/appear";
import { Content } from "../../src/block/layout/content";
@url('/katex')
export class Katex extends Content {
    @prop()
    formula: string = '';
    get htmlContent() {
        let html = katex.renderToString(this.formula, {
            throwOnError: false
        });
        return html;
    }
  
}
@view('/katex')
export class KatexView extends BaseComponent<Katex>{
    render() {
        return <div className='sy-block-katex' style={this.block.visibleStyle}>
            <SolidArea content={<span dangerouslySetInnerHTML={{ __html: this.block.htmlContent }}></span>}></SolidArea>
        </div>
    }
}