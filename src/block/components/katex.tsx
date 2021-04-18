import { BaseComponent } from "../base/component";
import { Content } from "../base/common/content";
import katex from 'katex';
import React from 'react';
import { prop, url, view } from "../factory/observable";
import "../../../node_modules/katex/dist/katex.min.css";
import { SolidArea } from "../base/appear";
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
            <SolidArea content={<span dangerouslySetInnerHTML={{__html:this.block.htmlContent}}></span>}></SolidArea>
        </div>
    }
}