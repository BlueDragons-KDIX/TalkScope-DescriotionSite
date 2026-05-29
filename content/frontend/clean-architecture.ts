import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "clean-architecture",
  title: "クリーンアーキテクチャの採用",
  description:
    "ハッカソンで一週間で作った神クラスを、実用に耐える設計へ段階的に再構築した。なぜクリーンアーキテクチャを選び、どう Zustand と組み合わせたか。",
  tags: ["アーキテクチャ", "Zustand", "DI", "設計"],
  sections: [
    {
      id: "problem",
      heading: "課題：神クラスと化した App.tsx",
      blocks: [
        {
          type: "image",
          image: {
            src: "/app-base.png",
            alt: "TalkScope ベース画面",
            caption: "4つのウィンドウが並ぶ TalkScope のメイン画面",
          },
        },
        {
          type: "text",
          content: `<p>ハッカソン期間中に一気に書いた最初の <code>App.tsx</code> は、音声認識・用語抽出・バブル管理・履歴・レイアウト——すべての状態とロジックを1ファイルに詰め込んだ <strong>神クラス</strong> だった。</p>
<p>機能追加のたびに state の依存関係が増え、「どこを変えるとどこが壊れるか分からない」状態になりつつあった。テストも書けない。これはまずい。</p>`,
        },
        {
          type: "list",
          items: [
            "音声認識の状態と用語抽出ロジックが密結合 → どちらかを変えると両方が壊れる",
            "props のバケツリレーが深くなり、コンポーネントが巨大化",
            "ロジックが React に縛られているためユニットテストが書けない",
          ],
        },
      ],
    },
    {
      id: "solution",
      heading: "解決：4層クリーンアーキテクチャ",
      blocks: [
        {
          type: "text",
          content: `<p>依存の向きを常に内側（domain）方向に強制する 4 層構造を採用した。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "ディレクトリ構造",
            code: `src/
├── domain/         ← 外部依存ゼロ。純粋な型・インターフェース
│   ├── entities/   Term, Layout, Phase ...
│   └── interfaces/ IImportanceStrategy, IWindowDefinition ...
├── application/    ← domain のみに依存。ユースケース
│   ├── bubble/     BubbleImportanceUseCase
│   ├── layout/     LayoutUseCase
│   └── phase/      PhaseUseCase
├── infrastructure/ ← 外部APIやストレージの具体実装
│   ├── speech/     WebSpeechTranscriptionService
│   ├── storage/    LocalStorageRepository
│   └── importance/ FrequencyStrategy, VectorSimilarityStrategy
├── stores/         ← Zustand（phaseStore, termStore, transcriptStore ...）
└── presentation/   ← React UI（App, phases, windows）`,
          },
        },
        {
          type: "callout",
          variant: "info",
          content:
            "依存の向きは常に内側（domain）方向。infrastructure・presentation が domain に依存し、逆は禁止。この制約がリファクタの道標になった。",
        },
      ],
    },
    {
      id: "zustand",
      heading: "Zustand によるストア分割",
      blocks: [
        {
          type: "text",
          content: `<p>状態管理には <strong>Zustand</strong> を採用し、ドメインごとにストアを分割した。Context だと状態が増えるにつれ不要な再描画が増える。Redux Toolkit はこの規模にはオーバースペックだ。Zustand はそのちょうど中間にある。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// stores/ — ドメインごとに1ファイル
phaseStore.ts      // 現在のフェーズ（発表中 / 発表後）
transcriptStore.ts // 文字起こしテキスト（句読点ごとのチャンク列）
bubbleStore.ts     // バブルの状態・ライフサイクル管理
layoutStore.ts     // レイアウトツリー・ウィンドウ設定の永続化
termStore.ts       // 用語・ピン留め・検索履歴・クリックウェイト`,
          },
        },
        {
          type: "text",
          content: `<p>各コンポーネントは <code>useTermStore(s => s.activeTerms)</code> のように必要なスライスだけを購読し、無関係な変更では再レンダリングしない。App.tsx はフェーズを切り替えるだけの薄いシェルになった。</p>`,
        },
      ],
    },
    {
      id: "strategy",
      heading: "Strategy パターンで重要度アルゴリズムをDI",
      blocks: [
        {
          type: "text",
          content: `<p>バブルの表示サイズを決める重要度スコアは「今後いろいろなアルゴリズムで試したい」という要求があった。そこで <strong>Strategy パターン（DI）</strong> を domain 層に定義した。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// domain/interfaces/IImportanceStrategy.ts
export interface IImportanceStrategy {
  calculate(term: Term, context: ImportanceContext): number;
}

// infrastructure/importance/FrequencyStrategy.ts
export class FrequencyStrategy implements IImportanceStrategy {
  calculate(term: Term, context: ImportanceContext): number {
    return term.frequency / context.maxFrequency;
  }
}

// BubbleCloud はインターフェース経由のみ — アルゴリズムが変わっても変更不要
const score = strategy.calculate(term, context);`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "アルゴリズムの差し替えが BubbleCloud に影響しない。新しい重要度アルゴリズムを追加する際はインターフェースを実装するだけ。この設計のおかげで後にサーバーサイドスコアリングへの切り替えがスムーズに行えた。",
        },
      ],
    },
    {
      id: "result",
      heading: "結果と効果",
      blocks: [
        {
          type: "list",
          items: [
            "<strong>テスタビリティ向上</strong>：domain / application は React 非依存でユニットテスト可能に",
            "<strong>機能追加が速くなった</strong>：新ウィンドウ追加は Registry に登録するだけ（LayoutEngine への変更不要）",
            "<strong>音声認識の独立</strong>：<code>WebSpeechTranscriptionService</code> は infrastructure に閉じ、将来 Whisper API への切り替えも容易",
            "<strong>App.tsx が薄くなった</strong>：フェーズの切り替えのみを担当するシェルへ変化",
          ],
        },
      ],
    },
  ],
};

export default page;
