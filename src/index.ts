import SaySomething from './saySomething';

//rootの要素を取得する。
const root: HTMLElement | null = document.getElementById("root");

const saySomething = new SaySomething("Hello TypeScript")
saySomething.sayText(root)