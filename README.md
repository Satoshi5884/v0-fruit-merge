# スイカゲーム

Next.jsで作成したスイカゲーム（フルーツマージパズル）です。

## GitHub Pagesへのデプロイ方法

### 1. リポジトリの設定

next.config.mjsの`basePath`を設定してください：

\`\`\`js
basePath: '/your-repo-name',
\`\`\`

例：リポジトリ名が`suika-game`の場合
\`\`\`js
basePath: '/suika-game',
\`\`\`

ルートドメイン（username.github.io）で公開する場合は、basePathの設定は不要です。

### 2. ビルド

\`\`\`bash
npm run build
\`\`\`

ビルドが完了すると、`out`ディレクトリに静的ファイルが生成されます。

### 3. GitHub Pagesの設定

1. GitHubリポジトリの「Settings」→「Pages」に移動
2. Source: 「GitHub Actions」を選択
3. 以下のワークフローファイルを作成

`.github/workflows/deploy.yml`を作成：

\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
\`\`\`

### 4. デプロイ

mainブランチにプッシュすると、自動的にGitHub Pagesにデプロイされます。

## ローカル開発

\`\`\`bash
# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 を開く
\`\`\`

## ゲームの遊び方

1. 画面上部から落下する次のフルーツを確認
2. クリック（タップ）してフルーツを落とす
3. 同じフルーツ同士が接触すると、より大きなフルーツにマージされる
4. 最終目標はスイカを作ること
5. フルーツが上限ラインを超えるとゲームオーバー
