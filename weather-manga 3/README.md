# 天気漫画(Weather Manga)

天気と気温によって表示される漫画が変わる、お天気アプリ代替サイトです。
天気データは気象庁(JMA)の防災情報APIを利用しています。

## シナリオの管理方式

**「気温_天気」をキーにして1対1で漫画を対応させます。**

- 気温:℃の整数(例:`23`)
- 天気:`sunny`(晴れ)/ `cloudy`(曇り)/ `rainy`(雨)の3種類

例:23度・曇りの漫画 → ファイル名 `images/23_cloudy.jpg` → `data/scenarios.json` のキー `"23_cloudy"`

## ファイル構成

```
weather-manga/
├── index.html
├── style.css
├── script.js
├── data/
│   └── scenarios.json   # 「気温_天気」をキーにしたシナリオ一覧
└── images/
    ├── placeholder.png   # 該当データがない時の仮画像
    ├── 23_cloudy.jpg
    └── 24_cloudy.jpg
```

## 漫画を追加する手順

### 1. 画像ファイルを用意する
ファイル名を `気温_天気.jpg` にする(例:`25_sunny.jpg`)

### 2. GitHubの `images` フォルダにアップロード
「Add file」→「Upload files」→ ドラッグ&ドロップ → 「Commit changes」

### 3. `data/scenarios.json` に追記する
鉛筆アイコン(Edit this file)を開き、追加したい内容をカンマ区切りで追記します。

```json
{
  "23_cloudy": { "title": "23_cloudy", "image": "images/23_cloudy.jpg" },
  "24_cloudy": { "title": "24_cloudy", "image": "images/24_cloudy.jpg" },
  "25_sunny": { "title": "25_sunny", "image": "images/25_sunny.jpg" }
}
```

最後の項目以外は行末に `,` が必要です。「Preview changes」タブで構造が崩れていないか確認すると安心です。

### 4. 保存して反映を確認
「Commit changes」後、数十秒〜数分でサイトに反映されます。

## 該当する画像がまだない場合

該当する「気温_天気」のデータが `scenarios.json` にない場合、自動的にプレースホルダー画像(`images/placeholder.png`)が表示され、「○○ のお話はまだ準備中です」という表示になります。

## 今後の改善候補

- **現在気温の精度向上**:現状は予報APIの最高気温を使っています。よりリアルタイムな気温が必要な場合は、アメダスAPI(`https://www.jma.go.jp/bosai/amedas/data/latest_time_data.json`)との連携を検討してください。
- **地域リストの拡充**:全地域コードは `https://www.jma.go.jp/bosai/common/const/area.json` で確認できます。

## 注意事項

気象庁APIのJSON構造は地域や時間帯で細部が異なることがあります。ブラウザの開発者ツール(F12→Console)でエラー詳細を確認できます。
