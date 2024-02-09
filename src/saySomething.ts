export default class SaySomething {
    message: string;

    //初期化
    constructor(message: string) {
        this.message = message
    }

    //引数の要素のタグに文字列を追加するメソッド。
    public sayText(elem: HTMLElement | null) {
        if(elem) {
            elem.innerText = this.message
        }
    }
}