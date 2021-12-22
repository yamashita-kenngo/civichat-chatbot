# Civichat Chatbot

## これは何
[Civichat](https://civichat.jp/)のChatbot部分の機能をもったリポジトリです。以下の2つを内包しています。

- Twitter bot
- LINE Bot

これらは過去には2つのリポジトリが分かれていました。([Civichat/Civichat_Kumamoto](https://github.com/Civichat/Civichat_Kumamoto) と [Civichat/civichat-kumamoto-for-twitter](https://github.com/Civichat/civichat-kumamoto-for-twitter) )

しかし、両リポジトリ間での重複がとても大きかったので、[Typescriptへの移行](https://scrapbox.io/Civichat/議論:技術選定の話)に伴って、実装を統合しています。

## ブランチルール

- 原則 **Git-flow** に従います。
  - [A successful Git branching model » nvie.com](https://nvie.com/posts/a-successful-git-branching-model/)
  - [日本語訳 A successful Git branching model - Qiita](https://qiita.com/homhom44/items/9f13c646fa2619ae63d0])

- ただし、`release`ブランチは原則使わない方向で考えています（@yuseiito）
  - これは、すでに元記事が公開されてから10年以上経過しているGit-flowは継続的デリバリーを前提としておらず（発案者もそれ言及しています）、今となってはただ複雑にしている道具になっているからです
  - リリースは、`develop`から`main`へのマージと`main`上でのtagによって表現できます。

- 新機能の開発を進めるときは、`develop`から新しいブランチ`feature/#[issue_number]-some-descriptive-name`を生やしてください。
  - **ケバブケース**にしてください
    - 参照: [agis/git-style-guide: A Git Style Guide](https://github.com/agis/git-style-guide)
   - 検索しにくいのでできるだけissueを生やすと良いです。
     - issueを生やさない場合は`feature/some-descriptive-name`な感じの名前になります。
       - とても短い、小規模な変更等に限って使うのがいいです

- 開発が終わったら、`develop`に対してPull Requestしてください。
  - Pull Requestは、**エンジニア1人以上のコードレビュー**を受けてmergeできます。

## 技術スタック

- TypeScript
- AWS Elastic Beanstalk
- PostgreSQL

### 必要なもの
 - LINE Developer Account
 - AWS Account

## 環境構築

### ローカル

- env
`.env.sample`を参考に作成する

- LINEBot
ngrokを使い、ローカルでLINEBotを作成します

```
npm install
```

```
npm run deploy:dev
```

別タブ

```
node dist/index.js
```

別タブ

```
ngrok http 5000
```

- データベース

```
docker-compose up
```

- ngrokを実行して表示されたURLに`/line`をパスに追加してLINE Developer Consoleで登録してください。
  - この際にWebhookも有効にしてください。

## AWS環境構築

基本的に、Elastic Beanstalkを利用します。
[この記事](https://hacknote.jp/archives/57416/)を参考に、CI/CDの構築をしておくと便利です。

Beanstalkで新しい環境を作成します
1. ウェブサーバー環境
2. プラットフォーム`Node.js 14 running on 64bit Amazon Linux 2/5.4.9`を利用してください。
3. 一旦CI/CDの設定をせずに`コードのアップロード`を行ってください。
4. BeanstalkのDBの環境に合わせて.envの編集をしてください。