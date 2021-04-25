import React from 'react';
import { dom } from '../../common/dom';
import { Point } from '../../common/point';
import { TextEle } from '../../common/text.ele';
import { Anchor } from '../anchor';
import { SelectorView } from './render';
export class TextInput extends React.Component<{ selectorView: SelectorView }> {
    constructor(props) {
        super(props);
    }
    get selectorView() {
        return this.props.selectorView;
    }
    get selector() {
        return this.selectorView.selector;
    }
    get blockSelector() {
        return this.selector.page.blockSelector;
    }
    textarea: HTMLTextAreaElement;
    onPaster(event: ClipboardEvent) {
        if (event.clipboardData.files && event.clipboardData.files.length > 0) {
            /**
             * 复制文件
             */
        }
        else {

        }
    }
    private isKeydown: boolean = false;
    onKeydown(event: KeyboardEvent) {
        this.isKeydown = false;
        if (this.blockSelector.isVisible) {
            if (this.blockSelector.interceptKey(event) == true) {
                return;
            }
        }
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'ArrowRight':
                event.preventDefault();
                if (this.selector.hasSelectionRange) {
                    return this.selector.onCancelSelection();
                }
                else if (this.selector.isOnlyOneAnchor) {
                    return this.selector.onKeyArrow(event.key);
                }
                break;
            case 'Enter':
                if (this.selector.hasSelectionRange) {

                }
                else if (this.selector.isOnlyOneAnchor) {
                    if (this.selector.activeAnchor.isText) {
                        if (this.selector.activeAnchor.isEnd) {
                            //换行接着创建一个新的block
                            return this.selector.onCreateBlockByEnter();
                        }
                    }
                }
                break;
            case 'Delete':
            case 'Backspace':
                if (this.selector.hasSelectionRange) {
                    //删除选区
                    return this.selector.onKeyDelete()
                }
                else if (this.selector.isOnlyOneAnchor) {
                    if (this.selector.activeAnchor.isText) {
                        if (!this.textarea.value)
                            return this.onInputDeleteText();
                    }
                    else return this.selector.onKeyDelete()
                }
                break;
        }
        this.isKeydown = true;
    }
    onKeyup(event: KeyboardEvent) {
        if (this.isKeydown == true) {
            var value = this.textarea.value;
            var anchor = this.selector.activeAnchor;
            if (anchor && anchor.isActive && value.length > 0) {
                if (!this.inputTextNode) {
                    this.inputTextNode = document.createElement('span');
                    anchor.view.parentNode.insertBefore(this.inputTextNode, anchor.view);
                }
                this.inputTextNode.innerHTML = TextEle.getTextHtml(value);
                anchor.at = this.inputTextAt + value.length;
                anchor.view.style.display = 'inline';
                if (value.endsWith('@')) {
                    //说明用户有输入@符的意图，那么这里弹出一个下拉框供用户选择
                }
                else if (value.endsWith('/') || value.endsWith('、')) {
                    //说明用户有插入某个元素的意图 
                    var bound = anchor.view.getBoundingClientRect();
                    var point = new Point(bound.left, bound.top + bound.height);
                    this.blockSelector.open(point);
                    this.blockSelector.select = async (blockData: Record<string, any>) => {
                        anchor.block.onInputText(this.inputTextAt,
                            value.replace(/(\/、)[^/、]*$/, ""),
                            true,
                            async () => {
                                this.selector.page.onRememberUpdate();
                                var newBlock = await anchor.block.visibleDownCreateBlock(blockData.url);
                                newBlock.mounted(() => {
                                    var contentBlock = newBlock.find(g => !g.isLayout);
                                    if (contentBlock) {
                                        var newAnchor = contentBlock.visibleHeadAnchor;
                                        this.selector.replaceSelection(newAnchor);
                                        this.selector.setActiveAnchor(newAnchor);
                                        this.selector.renderSelection();
                                    }
                                });
                                this.selector.page.onExcuteUpdate();
                            }
                        )

                    }
                }
                else if (this.blockSelector.isVisible == true) {
                    this.blockSelector.onInputFilter(value);
                }
                else {
                    anchor.block.onInputText(this.inputTextAt, value);
                }
                this.followAnchor(anchor);
                if (value) anchor.removeEmpty();
            }
        }
    }
    private deleteInputText = '';
    async onInputDeleteText() {
        var anchor = this.selector.activeAnchor;
        if (anchor.isText) {
            if (anchor.at == 0) {
                //说明当前的block已经删完了，此时光标应该向前移,移到上面一行
                this.selector.onKeyArrow('ArrowLeft');
                console.log(this.selector.activeAnchor,'sa');
                var block = anchor.block;
                if (block.isEmpty && !block.isPart) {
                    this.selector.page.onObserveUpdate(async () => {
                        await block.onDelete();
                    });
                }
                this.onStartInput(this.selector.activeAnchor);
                this.followAnchor(this.selector.activeAnchor);
                return;
            }
            else if (anchor.at > 0) {
                var dm = dom(anchor.view);
                var textNode = dm.prevFind(g => {
                    if (g instanceof Text || g instanceof HTMLBRElement) return true;
                    else return false;
                });
                if (textNode) {
                    if (textNode instanceof Text) {
                        var value = textNode.textContent;
                        this.deleteInputText = value.slice(value.length - 1) + this.deleteInputText;
                        textNode.textContent = value.slice(0, value.length - 1);
                        anchor.at -= 1;
                        if (textNode.textContent.length == 0) {
                            textNode.remove();
                        }
                    }
                    else if (textNode instanceof HTMLBRElement) {
                        this.deleteInputText = '\n' + this.deleteInputText;
                        anchor.at -= 1;
                        textNode.remove()
                    }
                    if (anchor.at == 0) {
                        var block = anchor.block;
                        var prevAnchor = anchor.block.visiblePrevAnchor;
                        if (prevAnchor && prevAnchor.isText) {
                            var ob = anchor.textEl.getBoundingClientRect();
                            var nb = prevAnchor.textEl.getBoundingClientRect();
                            if (Math.abs(nb.left + nb.width - ob.left) < 10) {
                                this.selector.replaceSelection(prevAnchor);
                                this.selector.setActiveAnchor(prevAnchor);
                                this.selector.renderSelection();

                                await block.onInputDeleteText(this.inputTextAt, this.deleteInputText, true, async () => {
                                    if (block.isEmpty && !block.isPart) {
                                        await this.selector.page.onObserveUpdate(async () => {
                                            var pa = block.parent;
                                            await block.delete();
                                            await pa.deleteLayout();
                                        });
                                    }
                                });
                                this.onStartInput(this.selector.activeAnchor);
                                this.followAnchor(this.selector.activeAnchor);
                                return;
                            }
                        }
                    }
                    await anchor.block.onInputDeleteText(this.inputTextAt, this.deleteInputText, anchor.at == 0 ? true : false);
                    if (anchor.at == 0 && block.isEmpty) {
                        anchor.setEmpty();
                    }
                    this.followAnchor(anchor);
                }
                else throw new Error('not found text');
            }
        }
    }
    onFocus() {
        if (document.activeElement !== this.textarea) {
            this.textarea.focus();
        }
    }
    private inputTextNode: HTMLElement;
    private inputTextAt: number;
    onStartInput(anchor: Anchor) {
        this.textarea.value = '';
        delete this.inputTextNode;
        this.deleteInputText = '';
        if (anchor.isText) {
            this.inputTextAt = anchor.at;
            anchor.block.onInputStart();
        }
    }
    render() {
        return <div className='sy-selector-textinput'><textarea
            ref={e => this.textarea = e}
            onPaste={e => this.onPaster(e.nativeEvent)}
            onKeyDown={e => this.onKeydown(e.nativeEvent)}
            onKeyUp={e => this.onKeyup(e.nativeEvent)}
        ></textarea></div>
    }
    followAnchor(anchor: Anchor) {
        var bound = anchor.bound;
        var point = this.selector.relativePageOffset(Point.from(bound));
        this.textarea.style.top = point.y + 'px';
        this.textarea.style.left = point.x + 'px';
        this.textarea.style.height = bound.height + 'px';
    }
    onBlockSelectorBlock(block: Record<string, any>) {

    }
}