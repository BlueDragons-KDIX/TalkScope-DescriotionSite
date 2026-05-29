import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "layout-engine",
  title: "動的レイアウトエンジン",
  description:
    "VSCode や Unity エディタのようなパネル自由配置を実現する自前のレイアウトエンジン。バイナリツリーで画面分割を表現し、D&D・リサイズ・プリセット・ウィンドウ追加削除をすべて同一の抽象で扱う。",
  tags: ["レイアウト", "バイナリツリー", "DnD", "UX"],
  sections: [
    {
      id: "overview",
      heading: "なぜ自前実装したか",
      blocks: [
        {
          type: "images",
          images: [
            {
              src: "/app-base.png",
              alt: "デフォルトレイアウト",
              caption: "デフォルト：4分割レイアウト",
            },
            {
              src: "/app-fullcustom.png",
              alt: "フルカスタムレイアウト",
              caption: "フルカスタム：バブル大・ランキング追加",
            },
          ],
          layout: "row",
        },
        {
          type: "text",
          content: `<p>TalkScope のウィンドウシステムは「文字起こし・バブル・説明・履歴・ランキング」という異なる性質のパネルを、ユーザーが自由に並べ替えられる設計だ。</p>
<p>既製の分割ライブラリは「決まった構造を前提にしたもの」が多く、今回の「任意の場所にドロップして分割する」要件には合わなかった。そのため <strong>バイナリツリーベースのレイアウトエンジンをゼロから実装</strong> した。</p>`,
        },
      ],
    },
    {
      id: "binary-tree",
      heading: "バイナリツリーによるレイアウト表現",
      blocks: [
        {
          type: "text",
          content: `<p>画面の分割状態は <strong>バイナリツリー</strong> で表現される。葉ノードがウィンドウ、中間ノードが縦または横方向の分割を表す。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// layout/types.ts
export type PanelId =
  | "transcription" | "bubbleCloud" | "detail"
  | "history"       | "ranking";

export type SplitNode = {
  type: "split";
  direction: "horizontal" | "vertical";
  ratio: number;       // 0〜1。分割線の位置
  first: LayoutNode;
  second: LayoutNode;
};

export type LeafNode = {
  type: "leaf";
  panelId: PanelId;
};

export type LayoutNode = SplitNode | LeafNode;

// 例：左右2分割。左にバブル、右に分割されたノード
const layout: LayoutNode = {
  type: "split",
  direction: "horizontal",
  ratio: 0.5,
  first: { type: "leaf", panelId: "bubbleCloud" },
  second: {
    type: "split",
    direction: "vertical",
    ratio: 0.6,
    first: { type: "leaf", panelId: "transcription" },
    second: { type: "leaf", panelId: "detail" },
  },
};`,
          },
        },
        {
          type: "text",
          content: `<p>この表現の強みは<strong>再帰的に描画できること</strong>だ。<code>LayoutEngine</code> は <code>LayoutNode</code> を受け取り、<code>SplitNode</code> なら2子を並べて再帰、<code>LeafNode</code> なら対応するパネルコンポーネントを描画する。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript（簡略）",
            code: `// LayoutEngine.tsx — 再帰レンダリング
function LayoutEngine({ node }: { node: LayoutNode }) {
  if (node.type === "leaf") {
    return <PanelRenderer panelId={node.panelId} />;
  }
  return (
    <SplitContainer direction={node.direction} ratio={node.ratio}>
      <LayoutEngine node={node.first} />
      <LayoutEngine node={node.second} />
    </SplitContainer>
  );
}`,
          },
        },
      ],
    },
    {
      id: "dnd",
      heading: "ドラッグ＆ドロップで再配置",
      blocks: [
        {
          type: "text",
          content: `<p>パネルヘッダーをドラッグすると「上下左右」のドロップゾーンが出現し、ドロップした位置にツリーが更新される。</p>
<p>ツリーの更新は <code>layoutUtils.ts</code> の純粋関数として実装されており、「ノードAをノードBの右に移動」のような操作を不変に（イミュータブルに）処理できる。React 側は新しいツリーを受け取って再レンダリングするだけだ。</p>`,
        },
      ],
    },
    {
      id: "presets",
      heading: "5種類のプリセットレイアウト",
      blocks: [
        {
          type: "images",
          images: [
            {
              src: "/app-ranking.png",
              alt: "ランキングを表示したレイアウト",
              caption: "ランキングウィンドウを追加したカスタムレイアウト",
            },
          ],
        },
        {
          type: "list",
          items: [
            "<strong>デフォルト</strong>：文字起こし左・バブル中央・説明＋履歴右",
            "<strong>左右</strong>：文字起こし左半分・バブル右半分（シンプル）",
            "<strong>2×2</strong>：4パネルを均等に配置",
            "<strong>横4列</strong>：横並び",
            "<strong>縦4列</strong>：縦積み",
          ],
        },
        {
          type: "text",
          content: `<p>発表後フェーズではレイアウト変更ボタンは <strong>表示したまま disabled</strong> にする設計にした。削除してしまうとボタン数が変わり右側のUI全体がズレるためだ。こういった細かい UIの安定性への配慮も設計に織り込んでいる。</p>`,
        },
      ],
    },
    {
      id: "window-registry",
      heading: "ウィンドウレジストリによる拡張性",
      blocks: [
        {
          type: "text",
          content: `<p>従来は <code>PanelId</code> の switch 文でウィンドウを描画していた。これは種類追加のたびに <code>LayoutEngine</code> を変更する必要があり、開放閉鎖原則に違反する。</p>
<p>そこで <code>IWindowDefinition</code> インターフェースと <strong>ウィンドウレジストリ</strong> を導入した。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// domain/interfaces/IWindowDefinition.ts
interface IWindowDefinition {
  id: string;
  label: string;
  component: React.ComponentType;
}

// presentation/windows/registry.ts
// 新種別の追加はここに登録するだけ。LayoutEngine は変更不要。
export const windowRegistry: Record<string, IWindowDefinition> = {
  transcription: { id: "transcription", label: "文字起こし", component: TranscriptionWindow },
  bubbleCloud:   { id: "bubbleCloud",   label: "バブル",     component: BubbleWindow },
  detail:        { id: "detail",        label: "説明",       component: DetailWindow },
  history:       { id: "history",       label: "履歴",       component: HistoryWindow },
  ranking:       { id: "ranking",       label: "ランキング", component: RankingWindow },
};`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "新しいウィンドウを追加するのに必要な変更は registry.ts への1エントリ追加だけ。LayoutEngine も LayoutUseCase も触らなくていい。",
        },
      ],
    },
  ],
};

export default page;
