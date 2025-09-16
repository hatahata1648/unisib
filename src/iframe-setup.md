# iframe埋め込み時のカメラアクセス設定

## 問題の概要
Figma Make等のプラットフォームでiframe埋め込み時にカメラAPIがブロックされる問題への対処法です。

## 解決方法

### 1. iframe タグでの許可設定
iframe埋め込み時は、以下の`allow`属性を追加してください：

```html
<iframe 
  src="https://your-app-url.com"
  allow="camera; microphone; fullscreen"
  width="100%" 
  height="100%">
</iframe>
```

### 2. HTTPヘッダーでの許可設定
サーバー側で以下のヘッダーを設定してください：

```
Permissions-Policy: camera=*, microphone=*, fullscreen=*
Feature-Policy: camera '*'; microphone '*'; fullscreen '*'
```

### 3. HTTPSの使用
カメラAPIはHTTPSでのみ動作します：
- 本番環境では必ずHTTPS接続を使用
- 開発環境ではlocalhostは例外的にHTTPでも動作

### 4. ユーザー操作の要求
カメラアクセスはユーザーの明示的な操作後に開始する必要があります：
- ボタンクリック等のイベントハンドラー内で実行
- ページ読み込み時の自動実行は不可

## Figma Makeでの対応

### アプリ側の対応 ✅
- iframe環境の自動検出
- 詳細なエラーメッセージ表示
- 新しいタブで開くオプション
- フォールバック機能

### プラットフォーム側で必要な設定
Figma Make側で以下の設定が必要です：

1. **iframe allow属性の追加**
   ```html
   <iframe allow="camera; microphone; fullscreen" ...>
   ```

2. **HTTPヘッダーの設定**
   ```
   Permissions-Policy: camera=*, microphone=*
   ```

3. **HTTPS接続の確保**

## トラブルシューティング

### カメラが起動しない場合
1. ブラウザのコンソールでエラーを確認
2. iframe環境か確認（アプリ内で表示される）
3. HTTPSか確認
4. 新しいタブで開いて動作するか確認

### エラータイプ別対処法

| エラー | 原因 | 対処法 |
|--------|------|--------|
| NotAllowedError | 権限拒否 | iframe allow属性、またはブラウザ設定確認 |
| NotFoundError | カメラなし | 他のデバイスで試行 |
| NotReadableError | カメラ使用中 | 他のアプリを終了 |
| OverconstrainedError | 設定不適合 | より基本的な設定で再試行 |

## 推奨環境

### ブラウザ
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### デバイス
- カメラ付きデバイス
- HTTPS対応環境
- 十分なメモリ容量

## 備考
本アプリは iframe 環境での制限を可能な限り回避できるよう設計されていますが、最終的にはプラットフォーム側での適切な権限設定が必要です。