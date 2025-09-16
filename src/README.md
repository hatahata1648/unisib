# 制服フォトフレームアプリ

スマートフォン向けの制服フォトフレーム撮影アプリです。制服の画像をオーバーレイで表示して、実際に制服を着ているような写真を撮影・保存できます。

## 🌟 主な機能

- **リアルタイムカメラ撮影**: 実際のカメラを使用してライブプレビューで撮影
- **制服オーバーレイ**: 中学・高校の各種制服（冬服・ジャンスカ・夏服・ワンピース）をリアルタイムで合成
- **ステッカー機能**: 学校エンブレムやロゴを自由に配置・編集
- **直感的な操作**: ピンチジェスチャーによる拡大縮小・回転・移動
- **ギャラリー機能**: 撮影した写真の閲覧・共有・削除
- **PWA対応**: ウェブアプリとしてホーム画面に追加可能

## 🚀 セットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/uniform-photo-frame-app.git
cd uniform-photo-frame-app

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてアプリにアクセスできます。

### ビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

### プレビュー

```bash
npm run preview
```

## 🎯 使い方

1. **カメラの許可**: アプリを開くとカメラアクセスの許可を求められます
2. **制服選択**: 上部のタブで中学・高校を選択し、下部から制服を選択
3. **制服調整**: 制服をドラッグで移動、ピンチで拡大縮小・回転
4. **ステッカー追加**: シャッターボタン左のアイコンからステッカーを追加
5. **撮影**: 白い丸ボタンをタップして撮影
6. **ギャラリー**: 撮影した写真は右上のギャラリーボタンから確認

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **スタイリング**: Tailwind CSS v4
- **アニメーション**: Motion (Framer Motion)
- **アイコン**: Lucide React
- **通知**: Sonner
- **ビルドツール**: Vite
- **PWA**: Vite PWA Plugin

## 📱 対応ブラウザ

- Chrome (Android/iOS)
- Safari (iOS)
- Edge (Android)
- Firefox (Android)

※ カメラ機能は HTTPS 環境でのみ動作します

## 🔧 開発

### プロジェクト構成

```
src/
├── components/          # Reactコンポーネント
│   ├── ui/             # shadcn/ui コンポーネント
│   ├── CameraView.tsx  # モックカメラビュー
│   ├── RealCameraView.tsx # リアルカメラビュー
│   ├── UniformOverlay.tsx # 制服オーバーレイ
│   ├── StickerOverlay.tsx # ステッカーオーバーレイ
│   └── ...
├── App.tsx             # メインアプリケーション
├── main.tsx           # エントリーポイント
└── index.css          # グローバルスタイル
```

### 新しい制服の追加

1. 制服画像を `public/uniforms/` に配置
2. `UniformSelector.tsx` の `uniforms` 配列に新しいアイテムを追加

### 新しいステッカーの追加

1. ステッカー画像を `public/stickers/` に配置
2. `StickerSelector.tsx` の `defaultStickers` 配列に新しいアイテムを追加

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/your-username/uniform-photo-frame-app/issues) を作成してください。

---

**注意**: このアプリは教育目的で作成されており、実際の学校制服の著作権については各学校の規定に従ってください。