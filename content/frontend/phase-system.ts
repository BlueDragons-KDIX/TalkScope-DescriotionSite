import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "phase-system",
  title: "フェーズシステム（発表中 / 発表後）",
  description:
    "「会話を聴く」時間と「振り返る」時間は、求められる UI が根本的に違う。両者を during / after の独立したフェーズとして実装し、IPhase インターフェース・フェーズ別レイアウト・ピン中バブルのアーカイブ表示への切り替えで、一つのアプリに二つの体験を同居させた設計を解説する。",
  intro:
    "発表を聴いている最中は、流れるバブルにリアルタイムで反応したい。終わったあとは、何が重要だったかを腰を据えて振り返りたい。この<strong>モードの違い</strong>を場当たりの分岐ではなく、フェーズという第一級の概念として扱った。",
  tags: ["フェーズ設計", "UX", "状態遷移"],
  sections: [
    {
      id: "two-phases",
      heading: "2つのフェーズ",
      blocks: [
        {
          type: "lead",
          content:
            "TalkScope は内部に during（発表中）と after（発表後）の 2 フェーズを持ち、いまどちらにいるかで画面の構成要素も振る舞いも切り替わる。",
        },
        {
          type: "table",
          caption: "フェーズごとの振る舞いの違い",
          head: ["観点", "during（発表中）", "after（発表後）"],
          rows: [
            ["録音", "アクティブ。逐次文字起こし", "停止。アーカイブ表示"],
            ["バブル", "リアルタイムに生成・消滅", "ピン留め語を中心に静的表示"],
            ["主役の画面", "バブル中心のレイアウト", "ランキング・履歴・要約"],
            ["操作", "瞬間的な反応（ホバー/クリック）", "じっくり再アクセス"],
          ],
        },
        {
          type: "images",
          images: [
            { src: "/app-bubble.png", alt: "発表中フェーズ", caption: "発表中：バブルが流れる" },
            { src: "/app-ranking.png", alt: "発表後フェーズ", caption: "発表後：重要語ランキング" },
          ],
          layout: "row",
        },
      ],
    },
    {
      id: "iphase",
      heading: "IPhase ── フェーズを抽象化する",
      blocks: [
        {
          type: "text",
          content:
            "<p>フェーズは domain の <code>IPhase</code> インターフェースで抽象化され、<code>DuringPresentation</code> / <code>AfterPresentation</code> がそれぞれシーンとして実装する。現在のフェーズは <code>phaseStore</code> が <code>currentPhaseId</code> として保持し、<code>transitionTo()</code> で遷移する。</p>",
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "stores/phaseStore.ts（要約）",
            code: `const usePhaseStore = create<PhaseState>((set) => ({
  currentPhaseId: 'during',
  transitionTo: (phaseId: string) => set({ currentPhaseId: phaseId }),
}))`,
          },
        },
        {
          type: "decision",
          context:
            "発表中と発表後で UI が大きく異なる。これを一枚の画面の <code>if</code> 分岐で書くと、両モードの関心が絡み合い、片方の変更が他方を壊す。",
          choice:
            "フェーズを <code>IPhase</code> として抽象化し、<code>DuringPresentation</code> / <code>AfterPresentation</code> を独立したシーンとして実装。フェーズ遷移を明示的な状態遷移として扱う。",
          because: [
            "各フェーズのコンポーネントが自分の関心だけを持ち、互いに干渉しない",
            "新しいフェーズ（例：準備中・休憩）を足すときも、既存フェーズに手を入れずに済む",
            "「いまどのモードか」がストアの一点に集約され、デバッグしやすい",
          ],
        },
      ],
    },
    {
      id: "handoff",
      heading: "フェーズ間の引き継ぎ",
      blocks: [
        {
          type: "text",
          content:
            "<p>フェーズが切り替わっても、ユーザーの文脈は途切れさせたくない。レイアウトはフェーズ ID をキーに保存されており（レイアウトエンジン参照）、遷移時に対応するレイアウトがロードされる。ピン留めした重要語は <code>after</code> フェーズのランキング・履歴へ自然に引き継がれる。</p>",
        },
        {
          type: "cards",
          items: [
            { title: "レイアウトの復元", body: "レイアウトはフェーズごとに永続化され、遷移時に <code>loadLayout(phaseId)</code> で復元される。" },
            { title: "ピン留めの引き継ぎ", body: "ピン留め語（<code>pinnedTermIds</code>）はフェーズをまたいで保持され、振り返りの起点になる。" },
            { title: "ピン中フィルタ", body: "発表後はバブルのカテゴリに「ピン中」が現れ、保存した語だけを俯瞰できる。" },
          ],
        },
        {
          type: "callout",
          variant: "info",
          content:
            "「聴く」から「振り返る」への移行が、データの作り直しではなく視点の切り替えとして起きる。同じ会話データを、二つのフェーズが別の角度から見せている。",
        },
      ],
    },
  ],
};

export default page;
