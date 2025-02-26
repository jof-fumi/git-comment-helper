#!/bin/bash

set -e

INSTALL_DIR="$(pwd)"
BIN_DIR="$HOME/.local/bin"
SCRIPT_NAME="commit-helper.ts"
ALIAS_NAME="chel"

echo "🚀 コミットヘルパーをセットアップ中..."

# 必要なディレクトリ作成
mkdir -p "$BIN_DIR"

# シンボリックリンクを作成（すでにある場合は上書き）
echo "#!/bin/bash" > "$BIN_DIR/commit-helper"
echo "npx tsx $INSTALL_DIR/$SCRIPT_NAME" '"$@"' >> "$BIN_DIR/commit-helper"
chmod +x "$BIN_DIR/commit-helper"

echo "#!/bin/bash" > "$BIN_DIR/$ALIAS_NAME"
echo "npx tsx $INSTALL_DIR/$SCRIPT_NAME" '"$@"' >> "$BIN_DIR/$ALIAS_NAME"
chmod +x "$BIN_DIR/$ALIAS_NAME"

# PATH に ~/.local/bin を追加（なければ）
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.zshrc"
fi

# シェルの種類を判定して source 実行
if [[ "$SHELL" == */bash ]]; then
  source "$HOME/.bashrc"
elif [[ "$SHELL" == */zsh ]]; then
  source "$HOME/.zshrc"
fi

echo "✅ セットアップ完了！"
echo "🔹 コマンド 'commit-helper' または 'chel' が使えるようになりました。"
echo "🔹 使い方: commit-helper または chel"
