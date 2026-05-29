import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "customization",
  title: "高いカスタマイズ性",
  description:
    "バブルの大きさも、文字の太さも、表示する語の数も——使う人の見え方は一人ひとり違う。マスターサイズ倍率・バブル倍率・文字サイズ・最大表示数・自動切替をスライダーで自在に調整できるようにし、localStorage と IndexedDB を使い分けて永続化した設計を解説する。",
  intro:
    "展示ブースには初見の人が次々訪れる。視力も画面の見方も様々だ。だからこそ「<strong>触ってすぐ自分仕様にできる</strong>」ことを重視した。設定は操作を止めず、その場で結果が反映される。",
  tags: ["設定", "永続化", "UI"],
  sections: [
    {
      id: "controls",
      heading: "調整できる項目",
      blocks: [
        {
          type: "image",
          image: { src: "/mainsetting.png", alt: "設定モーダル", caption: "主要な設定はスライダーで即時反映" },
        },
        {
          type: "text",
          content:
            "<p>バブルウィンドウの見え方は <code>TermMapWindowSettings</code> としてまとめて管理される。各項目には実用的な範囲が設けてあり、スライダーを動かすと描画へ即座に反映される。</p>",
        },
        {
          type: "specs",
          items: [
            { term: "masterSizeScale", value: "全体倍率 — <code>0.7 〜 1.6</code>" },
            { term: "bubbleSizeScale", value: "バブル倍率 — <code>0.5 〜 2.0</code>" },
            { term: "textFontSizePx", value: "文字サイズ — <code>8 〜 20px</code>" },
            { term: "maxVisibleTerms", value: "最大表示数 — <code>5 〜 30</code>" },
            { term: "autoSwitchEnabled", value: "説明の自動切替 — on / off" },
            { term: "autoSwitchIntervalSec", value: "切替間隔 — <code>1 〜 10秒</code>" },
          ],
        },
      ],
    },
    {
      id: "frame-aware",
      heading: "枠サイズに追従する倍率",
      blocks: [
        {
          type: "text",
          content:
            "<p>カスタマイズは物理エンジンと連動している。<code>maxVisibleTerms</code> はバブル寿命管理のハード上限そのものであり、増やせば多くの語が同時に浮く。倍率を上げて枠を縮めればバブルがはみ出しそうになるが、<strong>枠サイズに応じて倍率が自動調整</strong>されるため破綻しない。</p>",
        },
        {
          type: "image",
          image: { src: "/setting-in-window.png", alt: "ウィンドウ内の設定", caption: "ウィンドウごとに個別設定できる" },
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "設定は「全体の見やすさ」と「個々のウィンドウの都合」の二層で持つ。マスター倍率で全体の印象を、ウィンドウ個別設定で局所を詰められる。",
        },
      ],
    },
    {
      id: "persistence",
      heading: "localStorage と IndexedDB の使い分け",
      blocks: [
        {
          type: "text",
          content:
            "<p>永続化先は、データの性質で使い分けている。<strong>小さく頻繁に読む設定</strong>は localStorage、<strong>大きく構造的なデータ</strong>は IndexedDB（<code>idb</code> ライブラリ経由）に置く。ログイン不要で試せることを最優先したため、すべてブラウザ内に閉じる。</p>",
        },
        {
          type: "table",
          caption: "永続化レイヤの使い分け",
          head: ["保存先", "用途", "例"],
          rows: [
            ["localStorage", "軽量な設定値", "ウィンドウ設定・文字起こしモード・レイアウト"],
            ["IndexedDB", "大きく構造的なデータ", "発表ごとの全文・会話/テーマベクトル・語義・ピン留め語"],
          ],
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "永続化キーの例",
            code: `// localStorage：設定はキー1つに JSON で保存
'talkscope:term-map-window-settings'

// IndexedDB：'lexiflow-db'（version 2）
//   presentations … 発表ごとの全文・ベクトル
//   history       … 発表 × 単語の対応・ピン状態
//   words         … 単語・説明・ベクトル・理解済みフラグ
//   pinnedTerms   … ピン中ビュー用の Term`,
          },
        },
        {
          type: "callout",
          variant: "info",
          content:
            "履歴やピン留めを IndexedDB に持たせることで、ブラウザを閉じても過去の発表を再訪できる。重い 300 次元ベクトルも、構造化ストアなら扱いやすい。",
        },
      ],
    },
  ],
};

export default page;
