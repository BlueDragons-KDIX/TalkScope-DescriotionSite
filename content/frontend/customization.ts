import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "customization",
  title: "高いカスタマイズ性",
  description:
    "ダークモード、アクセントカラー6種、文字サイズ、IT単語フィルターのしきい値、ウィンドウ個別設定。すべてをユーザーが制御できるUI設計と実装を解説する。",
  tags: ["設定", "UX", "アクセシビリティ"],
  sections: [
    {
      id: "overview",
      heading: "カスタマイズの全体像",
      blocks: [
        {
          type: "images",
          images: [
            {
              src: "/mainsetting.png",
              alt: "設定モーダル",
              caption: "グローバル設定：表示・文字サイズ・IT単語フィルター",
            },
            {
              src: "/setting-in-window.png",
              alt: "ウィンドウ個別設定",
              caption: "ウィンドウ個別設定：フォントサイズの細かい調整",
            },
          ],
          layout: "row",
        },
        {
          type: "text",
          content: `<p>TalkScope は「ログイン不要で使えること」と並んで「自分に合わせてカスタマイズできること」を重視した設計になっている。設定は2段階ある。</p>`,
        },
        {
          type: "list",
          items: [
            "<strong>グローバル設定</strong>（設定モーダル）：ダークモード・アクセントカラー・文字サイズ・IT単語フィルター",
            "<strong>ウィンドウ個別設定</strong>（各ウィンドウのギアアイコン）：そのウィンドウ専用のフォントサイズ調整",
          ],
        },
      ],
    },
    {
      id: "darkmode",
      heading: "ダークモード / ライトモード",
      blocks: [
        {
          type: "images",
          images: [
            {
              src: "/app-base.png",
              alt: "ライトモード",
              caption: "ライトモード（デフォルト）",
            },
            {
              src: "/app-fullcustom.png",
              alt: "ダークモード",
              caption: "ダークモード",
            },
          ],
          layout: "row",
        },
        {
          type: "text",
          content: `<p>設定モーダルのトグルでライト⇔ダークを切り替えられる。デフォルトはライトモード。Tailwind の <code>darkMode: 'class'</code> を使い、<code>document.documentElement.classList.toggle('dark', isDark)</code> で即座に適用される。</p>`,
        },
      ],
    },
    {
      id: "accent",
      heading: "アクセントカラー6種",
      blocks: [
        {
          type: "text",
          content: `<p>Blue / Indigo / Purple / Rose / Emerald / Orange の6色から選択できる。選択したカラーはバブルのボーダー・ハイライト・ウィンドウ枠・分割線などアプリ全体のアクセントに反映される。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// LayoutEngine.tsx — アクセントカラーとRGBのマッピング
const ACCENT_RGB: Record<ThemeColor, string> = {
  blue:    "59,130,246",
  indigo:  "99,102,241",
  purple:  "168,85,247",
  rose:    "244,63,94",
  emerald: "16,185,129",
  orange:  "249,115,22",
};

// CSS変数に注入してウィンドウ枠・分割線に適用
style={{ "--accent-rgb": ACCENT_RGB[themeColor] } as CSSProperties}`,
          },
        },
      ],
    },
    {
      id: "font-size",
      heading: "文字サイズ調整",
      blocks: [
        {
          type: "text",
          content: `<p>グローバルな文字サイズスライダーは「各ウィンドウ内の重要語・説明文のみ」を拡大縮小する。ウィンドウタイトルや設定画面の文字サイズは変わらない。</p>
<p>さらに、ウィンドウごとの設定でマスター・通常文字・重要単語の3種類を個別に調整できる。</p>`,
        },
        {
          type: "callout",
          variant: "info",
          content:
            "「文字が大きいと見やすいが、全体的に大きくしたくない」というニーズに応えるため、グローバルとローカルの2段階にした。例えば文字起こしウィンドウだけ大きくして、バブルは小さいままにする使い方ができる。",
        },
      ],
    },
    {
      id: "it-filter",
      heading: "IT単語フィルター（関連度しきい値）",
      blocks: [
        {
          type: "text",
          content: `<p>設定モーダルの「関連度しきい値」スライダーは、どのくらい IT トピックに近い単語だけをバブルとして表示するかを調整できる。</p>`,
        },
        {
          type: "list",
          items: [
            "<strong>左端（広く表示）</strong>：IT関連語に限らず、会話全体の重要語を広く拾う",
            "<strong>右端（IT関連のみ）</strong>：技術用語・IT専門語だけを厳選して表示",
          ],
        },
        {
          type: "text",
          content: `<p>「一般的なビジネス会議には広め、エンジニアの技術ディスカッションにはIT寄りに絞る」といった使い分けを想定している。</p>`,
        },
      ],
    },
  ],
};

export default page;
