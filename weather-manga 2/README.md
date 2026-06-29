# 天気漫画(Weather Manga)

天気と気温によって表示される漫画が変わる、お天気アプリ代替サイトです。
天気データは気象庁(JMA)の防災情報APIを利用しています。

## ファイル構成

```
weather-manga/
├── index.html
├── style.css
├── script.js
├── data/
│   └── scenarios.json   # 天気×気温帯ごとのシナリオ一覧(画像パス含む)
└── images/
    ├── placeholder.png       # 仮画像
    ├── warm_cloudy_01.jpg    # 23℃・曇り「23_cloudy」
    └── warm_cloudy_02.jpg    # 24℃・曇り「24_cloudy」
```

## GitHub Pagesでの公開手順

1. GitHubで新しいリポジトリを作成
2. このフォルダの中身(`index.html`、`style.css`、`script.js`、`data`フォルダ、`images`フォルダ)を**フォルダごとドラッグ&ドロップ**でアップロード
   - 「Add file」→「Upload files」の画面に、PC上の`data`フォルダと`images`フォルダをそのままドロップすると、構造を保ったまま追加されます
3. 「Commit changes」で保存
4. **Settings → Pages** を開く
5. 「Source」を `Deploy from a branch`、ブランチを `main`、フォルダを `/ (root)` に設定して **Save**
6. 数分後、`https://(あなたのユーザー名).github.io/(リポジトリ名)/` でアクセス可能になります

## 漫画を追加する方法

1. 描いた漫画の画像を `images/` フォルダに入れる
2. `data/scenarios.json` の対応する項目の `"image"` を、その画像パスに書き換える

```json
{ "id": "comf_sunny_01", "title": "窓を全開にして風を通す", "image": "images/comf_sunny_01.jpg" }
```

## 今後の改善候補

- **現在気温の精度向上**:現状は予報APIの最高気温を温度帯判定に使っています。アメダスAPI(`https://www.jma.go.jp/bosai/amedas/data/latest_time_data.json`)との連携で、よりリアルタイムな気温が反映できます。
- **地域リストの拡充**:全地域コードは `https://www.jma.go.jp/bosai/common/const/area.json` で確認できます。

## 注意事項

気象庁APIのJSON構造は地域や時間帯で細部が異なることがあります。実際に動かして、`script.js`内の`extractTemperature`・`extractWeather`関数の挙動を確認してください。ブラウザの開発者ツール(F12→Console)でエラー詳細が見られます。
