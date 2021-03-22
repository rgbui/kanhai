import { Component } from "react";
import React from 'react';
import ReactDOM from 'react-dom';
import { Page } from "./index";
import { PageLayoutView } from "./layout/render";
import { SelectorView } from "../selector/render/render";

export class PageView extends Component<{ page: Page }> {
    constructor(props) {
        super(props);
        this.page.viewRender = this;
    }
    get page() {
        return this.props.page;
    }
    render() {
        var pageStyle: Record<string, any> = {
            lineHeight: this.page.config.lineHeight+'px',
            letterSpacing: this.page.config.letterSpaceing+'px',
            fontSize: this.page.config.fontSize+'px'
        }
        return <div className='kanhai-page-view' style={pageStyle} tabIndex={1} onKeyDown={this.page.onKeydown.bind(this.page)}>
            <PageLayoutView pageLayout={this.page.pageLayout}>
                <SelectorView selector={this.page.selector}></SelectorView>
                <div className='kanhai-page-views'
                    onMouseOver={e => this.page.onMouseover(e.nativeEvent)}
                    onMouseDown={e => this.page.onMousedown(e.nativeEvent)}
                    onMouseOut={e => this.page.onMouseout(e.nativeEvent)}
                >
                    {this.page.views.map(x => <x.viewComponent key={x.id} block={x} />)}
                </div>
            </PageLayoutView>
        </div>
    }
}