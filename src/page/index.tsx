
import React from 'react';
import ReactDOM from 'react-dom';
import { Events } from "../util/events";
import { util } from "../util/util";
import { BlockFactory } from "../block/factory/block.factory";
import { View } from "../block/base/common/view";
import { PageConfig } from '../config';
import { Selector } from '../selector';
import { PageLayout } from "./layout/index";
import { PageEvent } from "./event";
import { PageView } from './view';
import { User } from '../types/user';
import { HistorySnapshoot } from '../history/snapshoot';
import { Block } from '../block/base';
import { OperatorDirective } from '../history/declare';
export class Page extends Events {
    el: HTMLElement;
    id: string;
    date: number;
    private user: User;
    get creater() {
        if (!this.user) throw 'the user is not null';
        return this.user;
    }
    snapshoot: HistorySnapshoot;
    constructor(el: HTMLElement, options?: Record<string, any>) {
        super();
        this.el = el;
        if (typeof options == 'object') Object.assign(this, util.clone(options));
        if (typeof this.id == 'undefined') this.id = util.guid();
        if (typeof this.date == 'undefined') this.date = new Date().getTime();
        this.init();
    }
    private async init() {
        this.config = new PageConfig();
        this.selector = new Selector(this);
        this.snapshoot = new HistorySnapshoot(this);
        this.snapshoot.on('history', (action) => {
            this.emit('history', action);
            this.emit('change');
        });
        await this.emit('init');
    }
    config: PageConfig;
    async loadPageConfig(config: Partial<PageConfig>) {
        for (var n in config) {
            this[n] = config[n];
        }
    }
    async load(data: Record<string, any>) {
        await this.emit('loading');
        for (var n in data) {
            if (n == 'views') continue;
            else if (n == 'pageLayout') {
                this.pageLayout = new PageLayout(this, data[n]);
            }
            this[n] = data[n];
        }
        if (Array.isArray(data.views)) {
            for (var i = 0; i < data.views.length; i++) {
                var dv = data.views[i];
                var dc = await BlockFactory.createBlock(dv.url, this, dv, null);
                this.views.push(dc as View);
            }
        }
        if (typeof this.pageLayout == 'undefined') this.pageLayout = new PageLayout(this);
        await this.emit('loaded');
    }
    async get() {
        var json: Record<string, any> = {
            id: this.id,
            date: this.date
        };
        json.pageLayout = this.pageLayout.get();
        json.views = await this.views.asyncMap(async x => {
            return await x.get()
        })
        return json;
    }
    pageLayout: PageLayout;
    views: View[] = [];
    selector: Selector;
    viewRender: PageView;
    keys: string[] = [];
    isFocus: boolean = false;
    onError(error: Error) {
        this.emit('error', error);
    }
    render() {
        ReactDOM.render(<PageView page={this}></PageView>, this.el.appendChild(document.createElement('div')));
    }
    /**
     * 创建一个block
     * @param url 
     * @param data 
     * @param parent 
     * @param at 
     */
    async createBlock(url: string, data: Record<string, any>, parent: Block, at?: number, childKey?: string) {
        var block = await BlockFactory.createBlock(url, this, data, parent);
        if (typeof childKey == 'undefined') childKey = 'childs';
        var bs = parent.blocks[childKey];
        if (!Array.isArray(bs)) parent.blocks[childKey] = bs = [];
        if (typeof at == 'undefined') at = bs.length;
        bs.insertAt(at, block);
        this.snapshoot.record(OperatorDirective.create, {
            parentId: parent.id,childKey, at, preBlockId: block.prev ? block.prev.id : undefined, data: block.get()
        })
        return block;
    }
}
export interface Page extends PageEvent { }
util.inherit(Page, PageEvent)