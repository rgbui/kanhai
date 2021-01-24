import { Component } from "react";
import { Selector } from ".";
import React from 'react';
import ReactDOM from 'react-dom';

export class SelectorView extends Component<{ selector: Selector }>{
    constructor(props) {
        super(props);
        this.props.selector.view = this;
    }
    get selector() {
        return this.props.selector;
    }
    textarea: HTMLTextAreaElement;
    /***
     * 选择器渲染
     * kanhai-selector-cursor 光标
     * textarea 模拟的输入框
     * kanhai-selector-selections 选区，可以有多块选区
     * kanhai-selector-box 一个矩形选择框，呈现一个矩形用于选择一定范围内的block
     * kanhai-selector-rects 实体内容的block选择，如图像，可以有多个,可能还需要考虑旋转
     * kanhai-selector-operators 选中后弹出的操作按钮，如notion上面的拖动按钮或向上向下插入光标
     * 
     */
    render() {
        var self = this;
        function blur(event: React.FocusEvent<HTMLTextAreaElement>) {
            var relatedTarget = event.nativeEvent.relatedTarget;
            if (relatedTarget && !self.selector.page.el.contains(relatedTarget as HTMLDivElement))
                self.selector.page.onBlur(event.nativeEvent);
        }
        return <div className='kanhai-selector'>
            <div className='kanhai-selector-cursor'></div>
            <div className='kanhai-selector-selections'></div>
            <div className='kanhai-selector-box'></div>
            <div className='kanhai-selector-rects'></div>
            <div className='kanhai-selector-operators'></div>
            <textarea ref={e => this.textarea = e} onBlur={blur} onKeyDown={this.selector.onKeydown.bind(this.selector)}></textarea>
        </div>

    }
}