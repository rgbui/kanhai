import { ContentAreaComposition } from "../base/composition/content";
import React from 'react';
import { BaseComponent } from "../base/component";

export class ViewComponent extends BaseComponent<View> {
    render() {
        if (this.block && Array.isArray(this.block.childs))
            return <div className='block-view' >{this.block.childs.map(x =>
                <x.viewComponent key={x.id} block={x}></x.viewComponent>
            )}</div>
        else return <div className='block-view' ></div>
    }
}
/**
 * 在一个页面上，从视觉上有多个视图块，
 * 如每个页面都有一个初始的内容视图，不可拖动
 *  但页面可以会有弹层等一些其它的视图
 */
export class View extends ContentAreaComposition {
    /**
     * 是否为内容视图
     */
    isRockView: boolean = true;
}

