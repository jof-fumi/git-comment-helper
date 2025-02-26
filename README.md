# 🚀 Git Commit Helper

`chel` (Commit Helper) は、macOSで利用できる、対話式で Git のコミットメッセージを作成する CLI ツールです。

以下のフォーマットでコミットログを作成します。

```
[{案件名}] {チケット番号} | {修正内容}
```

## 📦 インストール手順

1. **リポジトリをクローン**

   ```sh
   git clone https://github.com/your-username/git-commit-helper.git
   cd git-commit-helper
   ```

2. **依存パッケージをインストール**

   ```sh
   npm install
   ```

3. **セットアップ（シンボリックリンクを作成）**

   ```sh
   bash setup.sh
   ```

4. **コミットヘルパーの使用**
   ```sh
   chel
   ```
   または
   ```sh
   commit-helper
   ```
