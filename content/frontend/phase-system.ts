import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "phase-system",
  title: "フェーズシステム（発表中 / 発表後）",
  description:
    "同じアプリで「発表を聴く」フェーズと「内容を振り返る」フェーズを独立したシーンとして実装。遷移ボタンのUX、アクセントカラーの自動補色切替、レイアウト引き継ぎの設計を解説する。",
  tags: ["フェーズ設計", "UX", "ADR", "アクセントカラー"],
  sections: [
    {
      id: "motivation",
      heading: "なぜ2つのフェーズが必要か",
      blocks: [
        {
          type: "images",
          images: [
            {
              src: "/app-bubble.png",
              alt: "発表中フェーズ",
              caption: "発表中：音声認識とバブルがリアルタイムで動作",
            },
            {
              src: "/app-ranking.png",
              alt: "発表後フェーズ（ランキング）",
              caption: "発表後：重要語ランキングで振り返り",
            },
          ],
          layout: "row",
        },
        {
          type: "text",
          content: `<p>最初の TalkScope は「発表を聴いている最中」だけを想定していた。しかし実際の使用シーンを考えると、発表が終わった後に「どの単語が重要だったか」を振り返りたいというニーズがある。</p>
<p>タブやモーダルで切り替えるアプローチも検討したが、それではレイアウトが共有されてしまい、フェーズごとに最適な画面配置ができない。そこで <strong>フェーズを独立したシーンとして実装</strong> した。</p>`,
        },
      ],
    },
    {
      id: "design",
      heading: "フェーズの設計",
      blocks: [
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// domain/interfaces/IPhase.ts
interface IPhase {
  id: "during" | "after";
  name: string;
  defaultLayout: LayoutNode;  // フェーズごとに異なるデフォルトレイアウト
  onEnter?: () => void;
  onExit?: () => void;
}

// stores/phaseStore.ts
const usePhaseStore = create<PhaseStore>((set) => ({
  phase: "during",
  setPhase: (phase) => set({ phase }),
}));

// presentation/App.tsx
// App は「現在のフェーズに応じたシーンを描画するだけ」
const phase = usePhaseStore(s => s.phase);
return phase === "during" ? <DuringScene /> : <AfterScene />;`,
          },
        },
        {
          type: "text",
          content: `<p>発表後フェーズでは <strong>ランキングウィンドウ</strong> が前面に表示される。重要語を出現頻度順にランク付けして一覧表示し、各単語をクリックすると説明パネルに遷移できる。</p>`,
        },
      ],
    },
    {
      id: "button-ux",
      heading: "遷移ボタンのUX設計",
      blocks: [
        {
          type: "text",
          content: `<p>発表中⇔発表後の切り替えボタンは <strong>同一 DOM ボタン</strong> で実装されている。「削除して別のボタンに差し替え」ではなく、色・文言・アイコン・ハンドラだけが変わる。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// PresentationAppHeader.tsx
<button
  style={{ width: "12.5rem" }}  // 幅を固定してフェーズ切替でレイアウトがズレないように
  className={phase === "during"
    ? "bg-rose-600 hover:bg-rose-700 text-white"      // 発表終了ボタン（ローズ）
    : "bg-emerald-600 hover:bg-emerald-700 text-white" // もどるボタン（エメラルド）
  }
  onClick={phase === "during" ? handleEndPresentation : handleBackToDuring}
>
  {phase === "during" ? "発表終了" : "もどる"}
</button>`,
          },
        },
        {
          type: "callout",
          variant: "info",
          content:
            "ボタン幅を固定する理由：「発表終了」と「もどる」で文字数が異なるため、可変幅だとフェーズ切替のたびに右側のボタン列全体がズレる。ユーザーがクリックしようとしたボタンが動いてしまう不快な体験を防ぐ。",
        },
      ],
    },
    {
      id: "accent-color",
      heading: "発表後のアクセントカラー自動補色切替",
      blocks: [
        {
          type: "text",
          content: `<p>発表中と発表後を視覚的に明確に区別するため、<strong>発表後フェーズではアクセントカラーを自動的に補色に近いカラーへ切り替える</strong>。</p>
<p>ユーザーの設定値（例: blue）は変更しない。表示時だけ <code>getOppositeThemeColor()</code> でパレット上の反対側のキー（例: orange）にマッピングする。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// presentation/utils/oppositeThemeColor.ts
const oppositeMap: Record<ThemeColor, ThemeColor> = {
  blue:    "orange",
  indigo:  "rose",
  purple:  "emerald",
  rose:    "indigo",
  emerald: "purple",
  orange:  "blue",
};

export function getOppositeThemeColor(color: ThemeColor): ThemeColor {
  return oppositeMap[color];
}

// 使用側
const displayColor = phase === "after"
  ? getOppositeThemeColor(settings.themeColor)
  : settings.themeColor;`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "設定値（themeColor）は不変。マッピングは純粋関数で表示時にのみ適用される。設定モーダルを開いても選択済みの色はユーザーが設定した値のまま表示される。",
        },
      ],
    },
  ],
};

export default page;
