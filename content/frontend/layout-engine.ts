import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "layout-engine",
  title: "動的レイアウトエンジン",
  description:
    "文字起こし・バブル・説明・履歴の各ウィンドウを、VSCode や Unity のように自由配置・リサイズできる。レイアウトを Split / Leaf のバイナリツリーで表現し、ドラッグでの分割・比率変更・ドロップゾーン・フェーズ別永続化を実装した仕組みを解説する。",
  intro:
    "発表のスタイルも画面サイズも人それぞれ。ならばレイアウトを固定せず、<strong>ユーザーが組み立てられる</strong>ようにしよう。その土台が、画面分割を再帰的な木構造で表すレイアウトエンジンだ。",
  tags: ["レイアウト", "バイナリツリー", "Drag & Drop"],
  sections: [
    {
      id: "model",
      heading: "レイアウトをバイナリツリーで表す",
      blocks: [
        {
          type: "lead",
          content:
            "任意の分割レイアウトは「分割（Split）」と「中身（Leaf）」の二種類のノードで木として表現できる。これは多くのタイリング型エディタが採るモデルだ。",
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "domain/entities/Layout.ts",
            code: `export interface LeafNode {
  type: 'leaf'
  id: string
  windowId: string   // どのウィンドウを表示するか
}

export interface SplitNode {
  type: 'split'
  id: string
  direction: 'h' | 'v' // h = 左右分割, v = 上下分割
  ratio: number        // 最初の子(a)が占める割合 0〜1
  a: LayoutNode
  b: LayoutNode
}

export type LayoutNode = LeafNode | SplitNode`,
          },
        },
        {
          type: "list",
          items: [
            "<code>Leaf</code> は実際に描画するウィンドウ（<code>windowId</code>）を指す葉ノード",
            "<code>Split</code> は領域を <code>direction</code> 方向に <code>ratio</code> で2分し、子 <code>a</code> / <code>b</code> を再帰的に持つ",
            "どんなに複雑な配置も、Split を入れ子にすれば表現できる",
          ],
        },
        {
          type: "image",
          image: { src: "/app-fullcustom.png", alt: "フルカスタムレイアウト", caption: "複数ウィンドウを自在に配置した状態" },
        },
      ],
    },
    {
      id: "resize",
      heading: "ドラッグでの比率変更",
      blocks: [
        {
          type: "text",
          content:
            "<p>分割の境界（ディバイダ）をドラッグすると、その Split ノードの <code>ratio</code> だけを更新する。ポインタの移動量をコンテナサイズで割って差分を求め、行き過ぎないよう範囲内に収める。木の他の部分には一切触れない。</p>",
        },
        {
          type: "steps",
          items: [
            { title: "ドラッグ開始", body: "<code>onMouseDown</code> で開始位置と現在の <code>ratio</code> を記録する。" },
            { title: "移動量を比率に変換", body: "<code>delta = (現在位置 − 開始位置) / コンテナサイズ</code> を計算する。" },
            { title: "ratio を更新", body: "<code>newRatio = startRatio + delta</code> を min/max でクランプし、対象 Split の <code>ratio</code> のみ書き換える。" },
            { title: "再描画", body: "更新後の木から各ペインの幅・高さを算出して React が再描画する。" },
          ],
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "更新対象は「ドラッグした Split の ratio」だけ。木の構造を不変に保ち、必要な一点のみ差し替えることで、巨大なレイアウトでも安定して動く。",
        },
      ],
    },
    {
      id: "dnd",
      heading: "ドロップゾーンによる再配置",
      blocks: [
        {
          type: "text",
          content:
            "<p>ウィンドウのヘッダをドラッグすると、ドロップ先の候補として 4 方向のオーバーレイ（左・右・上・下）が現れる。どこに落とすかで、新しい Split をどちら向きに・どちら側へ挿入するかが決まる。</p>",
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "domain/entities/Layout.ts",
            code: `export type DropZone = 'left' | 'right' | 'top' | 'bottom'

// left/right → direction 'h' の Split を新規作成
// top/bottom → direction 'v' の Split を新規作成
// ドロップ側に応じて a / b のどちらへ既存ノードを置くかが決まる`,
          },
        },
        {
          type: "list",
          items: [
            "左右へのドロップは <code>direction: 'h'</code> の Split を生成",
            "上下へのドロップは <code>direction: 'v'</code> の Split を生成",
            "不要になったウィンドウは Leaf を木から外し、残った兄弟ノードで親 Split を置き換える（折りたたみ）",
          ],
        },
      ],
    },
    {
      id: "persist",
      heading: "フェーズ別のレイアウト永続化",
      blocks: [
        {
          type: "text",
          content:
            "<p>「発表中」と「発表後」では最適な配置が異なる。そこでレイアウトは <strong>フェーズ ID をキーに</strong>保存・復元する。<code>LayoutRepository</code> が localStorage への入出力を担い、フェーズ遷移時に対応するレイアウトをロードする。</p>",
        },
        {
          type: "specs",
          items: [
            { term: "保存先", value: "localStorage（<code>LayoutRepository</code> 経由）" },
            { term: "キー", value: "フェーズ ID 単位" },
            { term: "ロード契機", value: "フェーズ遷移時に対応レイアウトを復元" },
            { term: "初期値", value: "用途別のプリセットテンプレートを用意" },
          ],
        },
        {
          type: "callout",
          variant: "info",
          content:
            "「発表中はバブルを大きく」「発表後はランキングと履歴を中心に」といったプリセットを起点に、ユーザーが自分好みへ調整したものがフェーズごとに記憶される。",
        },
      ],
    },
  ],
};

export default page;
