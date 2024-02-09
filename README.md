# TypeScript×Webpack 環境構築
## 概要
プログラミングチュートリアル チャンネルさんの[【Typescript入門】本当の初心者からTypescript×Webpackの開発環境構築までをハンズオン形式で学ぼう！](https://www.youtube.com/watch?v=ECc1EXnx7VQ)での手順やポイントをまとめておく。

## 環境構築と実行手順

### step1: package.jsonの作成
- 関連TypeScriptのインストールを管理するためのpackage.jsonを作成し、この中でTypeScriptのライブラリやWebpackを管理していく。
```bash
$ npm init -y
Wrote to {PATH}/package.json:

{
  "name": "typescript",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### Step2: TypeScriptの導入
```bash
$ npm i --save-dev typescript
```
- 補足
    - オプションの`--save-dev`は`-D`と同じ意味を持ち、開発（Development）環境で立ち上げることを指す。
    - つまり、グローバルではなく、 ローカル環境（今回のプロジェクト）だけで使えるTypeScriptを構築。
    - node_modulesフォルダが生成され、`tsc`コマンドが使えるようになる。（JavaScriptにコンパイルする際など...）
- 以下で動作確認を行う
```bash
$ npx tsc -v                 
Version 5.3.3
```

### Step3: Webpackを導入
- Webpackはざっくり言うと、複数あるファイルを一つにまとめるモジュールバンドラ
```bash
$ npm i -D webpack webpack-cli webpack-dev-server ts-loader
```
- 正常にインストールできていたら、`package.json`に以下のようなものが追記される。
```bash
  "devDependencies": {
    "ts-loader": "^9.5.1",
    "typescript": "^5.3.3",
    "webpack": "^5.90.1",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1"
  }
```
- ここで`devDependencies`とは`-D`オプションによる開発環境のみにインストールしていることを指す。

### Step4: Webpackのカスタマイズ
- ここでは、Webpackを使用して、**どの複数のファイルをまとめるか**、**まとめたファイルの名前**、**出力先**などの詳細なカスタマイズを行う。
- Webpackをカスタマイズするファイル`webpack.config.js`を作成
```bash
$ touch webpack.config.js
```
- ファイルに以下をペーストする。
```bash
module.exports = {
    entry: {
        bundle: "./src/index.ts",
    },
    output: {
        path: `${__dirname}/dist`,
        filename: "bundle.js",
    },
    mode: "development",
    resolve: {
        extensions: [".ts", ".js"],
    },
    devServer: {
        static: {
            directory: `${__dirname}/dist`,
        },
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
        ]
    },
};
```
- `entry:`エントリーポイントの作成（何をコンパイル、バンドルするか） =>今回は`./src/index.ts`を一つにバンドルする。（JavaでいうMainメソッド的な部分があるクラスをバンドルするイメージかも？？）
- `output:`バンドルしたファイルの出力先を設定`filename:`でファイル名を指定できる。 =>今回は`${__dirname}/dist`を出力先にし、`bundle.js`を作成。
- `mode:` **development**モードと**production**モードの２つがある。
    - **development**モードは、基本的に開発中に使用され、ソースマップという機能が利用可能である。
    - **production**モードは、ファイルが圧縮され、本番環境などで使用される。
- `resolve:`　`extensions: [".ts", ".js"]`とすることで、`src`で作業している時のクラスをインポートする際など拡張子を自動で認識してくれる機能。
- `devServer:`
    ```bash
    devServer: {
        static: {
            directory: `${__dirname}/dist`,
        },
        open: true,
    },
    ```
    とすることで、ローカルサーバを立ち上げるときにどこの静的なディレクトリを参照するかを指定。`open: true`で自動的にサーバーが立ち上がる。
- `module:`ファイルに対するルールの設定（**大切**）
    ```bash
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            },
        ],
    },
    ```
    とすることで、拡張子が`.ts`のファイルをコンパイルすることを指定し、`loader: ts-loader`で**ts-loader**を用いてコンパイルすると指定できる。

***このファイル`webpack.config.json`は、プロジェクト毎に使用するので、コピー＆ペーストで適宜カスタマイズすることを推奨する。***

### Step5: TypeScriptに関する設定
- 以下のコマンドを実行し、`tsconfig.json`を作成。
```bash
$ npx tsc --init    
```
以下は`tsconfig.json`で最初から有効になっているコード。
```bash
{
    "compilerOptions": {
        "target": "es2016",      
        "module": "commonjs",  
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
    }
}
```
- 他にも様々な設定があるが、適宜コメントアウトを外して用いる。
    - `target:`コンパイルした後のJavaScriptのバージョンを指定できる（`es2016`は2016年のJavaScriptバージョン）

これで、WebpackとTypeScriptのコンフィグ設定が完了する。

### Step6: TypeScriptの記述
- TypeScriptではクラスを使えるので、クラスを使用する例を紹介する。
- `src`直下に`index.ts`と`saySomething.ts`を作成し、以下をコピペする。

`index.ts`
```bash
import SaySomething from './saySomething';

const root: HTMLElement | null = document.getElementById("root");

const saySomething = new SaySomething("Hello TypeScript")
saySomething.sayText(root)
```
`saySomething.ts`
```bash
export default class SaySomething {
    message: string;

    //初期化
    constructor(message: string) {
        this.message = message
    }

    public sayText(elem: HTMLElement | null) {
        if(elem) {
            elem.innerText = this.message
        }
    }
}
```

- また、結果を出力する`dist/index.html`を作成し、以下をコピペ
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id ="root"></div>
    <script src="bundle.js"></script>
</body>
</html>
```
- これらコードは、`index.html`の`root`の`div`タグに要素（文字列）を追加するプログラム。

### Step7: ローカルサーバーの立ち上げ & 実行
- `package.json`内の`scripts`ブロックを以下に変更する。
```bash
  "scripts": {
    "start": "webpack serve",
    "build": "webpack"
    },
```
- `start`コマンドでローカルサーバーが立ち上がる。
- `build`コマンドでwebpackを用いてバンドルし、JavaScriptにコンパイルされ得る。
- 以下を実行すると、出力結果をローカルサーバー上で見れる。
```bash
$ npm run build
$ npm start   
```

## References
- 参考動画:
    - [【Typescript入門】本当の初心者からTypescript×Webpackの開発環境構築までをハンズオン形式で学ぼう！](https://www.youtube.com/watch?v=ECc1EXnx7VQ)
- 手助けとなるサイト:
    - [いちばんやさしい webpack 入門](https://zenn.dev/sprout2000/articles/9d026d3d9e0e8f)
    - [【npmとnpxの違い】便利なnpxについて理解する](https://www.geeklibrary.jp/counter-attack/npx/)