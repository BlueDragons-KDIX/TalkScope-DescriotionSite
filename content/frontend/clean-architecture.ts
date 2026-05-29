import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "clean-architecture",
  title: "クリーンアーキテクチャの採用",
  description:
    "音声認識・物理演算・レイアウト・スコアリングが App.tsx に同居して肥大化していた。これを domain / application / infrastructure / presentation の4層へ段階的に分離し、スコアリング戦略を差し替え可能にした設計判断を解説する。",
  intro:
    "TalkScope のフロントエンドは、最初から綺麗だったわけではない。音声認識・物理演算・レイアウト・スコア計算が <code>App.tsx</code> に同居し、機能追加のたびに副作用が読めなくなっていった。そこで <strong>依存の向き</strong>を一方向に整え、UI を末端に追いやるリファクタリングを行った。",
  tags: ["アーキテクチャ", "DDD", "Zustand", "Strategy パターン"],
  sections: [
    {
      id: "problem",
      heading: "出発点：肥大化した App.tsx",
      blocks: [
        {
          type: "lead",
          content:
            "プロトタイプ期は速度がすべてだった。だが「重要語の出し方を試したい」「レイアウトを保存したい」と要求が増えるたび、一つのコンポーネントに状態とロジックが積み上がっていった。",
        },
        {
          type: "text",
          content:
            "<p>典型的な「神コンポーネント」の症状が出ていた。音声の状態、抽出語のリスト、バブルの座標、レイアウトツリー、設定値——これらが同じファイルの <code>useState</code> 群として絡み合い、ある機能を直すと別の機能が壊れる。テストを書こうにも、UI を描画しないとロジックに触れられない。</p>",
        },
        {
          type: "callout",
          variant: "note",
          title: "リファクタリングの目的",
          content:
            "「動くものを綺麗にする」ことではなく、「NLP の精度や UI を、互いを壊さずに差し替えられる」状態を作ること。展示までに何度も試行錯誤する前提だった。",
        },
      ],
    },
    {
      id: "layers",
      heading: "4層への分離",
      blocks: [
        {
          type: "text",
          content:
            "<p>クリーンアーキテクチャに倣い、<strong>内側ほど純粋・外側ほど具体</strong>になるよう4層に整理した。依存は常に外から内へ向き、内側は外側を知らない。</p>",
        },
        {
          type: "tree",
          caption: "Frontend/src の主要ディレクトリ構成",
          lines: [
            "src/",
            "├─ domain/              … 純粋なビジネスロジック（フレームワーク非依存）",
            "│   ├─ entities/        Term / Bubble / Layout / Minutes",
            "│   └─ interfaces/      IImportanceStrategy, IPhase,",
            "│                       ITranscriptionService, IScoreUpdateStrategy",
            "├─ application/         … ユースケース（処理の流れ）",
            "│   ├─ bubble/          BubbleImportanceUseCase",
            "│   ├─ layout/          LayoutUseCase",
            "│   ├─ phase/           PhaseUseCase",
            "│   └─ transcription/   TranscriptionUseCase",
            "├─ infrastructure/      … 外部連携・具体実装",
            "│   ├─ importance/      FrequencyStrategy, VectorSimilarityStrategy",
            "│   ├─ speech/          WebSpeech / LocalStt TranscriptionService",
            "│   ├─ sse/             referDictScoreStream",
            "│   └─ storage/         LayoutRepository (localStorage/IndexedDB)",
            "├─ presentation/        … React UI",
            "│   ├─ layout/          LayoutEngine",
            "│   ├─ phases/          DuringPresentation / AfterPresentation",
            "│   ├─ windows/         BubbleCloudWindow, TermDetailWindow …",
            "│   └─ hooks/           useBubbleLifecycle, useTranscription …",
            "└─ stores/              … Zustand ストア群（状態の置き場）",
          ],
        },
        {
          type: "cards",
          columns: 2,
          items: [
            { title: "domain", tag: "中核", body: "<code>Term</code> や <code>Bubble</code> といったエンティティと、振る舞いを定義するインターフェース。React も fetch も知らない。" },
            { title: "application", tag: "ユースケース", body: "「文字起こしを開始する」「重要度を再計算する」などの操作。domain のインターフェース越しに処理を組み立てる。" },
            { title: "infrastructure", tag: "外界", body: "Web Speech API、SSE、localStorage といった具体的な外界との接続。インターフェースの実装を提供する。" },
            { title: "presentation", tag: "描画", body: "React コンポーネントとフック。状態は Zustand ストアから受け取り、描画に専念する。" },
          ],
        },
      ],
    },
    {
      id: "strategy",
      heading: "Strategy パターンで「差し替え可能」にする",
      blocks: [
        {
          type: "text",
          content:
            "<p>重要度の決め方は、開発中に何度も変わった。最初は<strong>出現頻度</strong>だけ、次に<strong>ベクトル類似度</strong>を導入——。これを <code>if</code> 分岐で書くと application 層が実装に汚染される。そこで domain にインターフェースを置き、実装を infrastructure に逃がした。</p>",
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "domain/interfaces/IImportanceStrategy.ts（概念）",
            code: `// 重要度の計算方法を抽象化する
export interface IImportanceStrategy {
  // 用語群を受け取り、スコア付きで返す
  score(terms: Term[], context: ScoringContext): ScoredTerm[];
}

// infrastructure 側の実装（差し替え可能）
//   FrequencyStrategy        … 出現頻度ベース
//   VectorSimilarityStrategy … テーマベクトルとの類似度ベース`,
          },
        },
        {
          type: "decision",
          context:
            "重要度スコアの算出方法は試行錯誤の対象で、頻繁に切り替えたい。だが計算ロジックを UseCase に直接書くと、変更のたびに広い範囲へ影響が出る。",
          choice:
            "<code>IImportanceStrategy</code> を domain に定義し、<code>FrequencyStrategy</code> / <code>VectorSimilarityStrategy</code> を infrastructure の差し替え可能な実装として用意した。",
          because: [
            "application 層は「スコアを計算する」という意図だけを知り、how を知らずに済む",
            "新しい指標を試すときは実装クラスを追加するだけでよく、既存コードを壊さない",
            "純粋関数として切り出せるため、UI を描画せずに単体テストできる",
          ],
        },
      ],
    },
    {
      id: "stores",
      heading: "Zustand による状態の分割",
      blocks: [
        {
          type: "text",
          content:
            "<p>状態管理には <strong>Zustand 5</strong> を採用した。Redux のようなボイラープレートなしに、機能ごとに小さなストアへ分割できる。<code>bubbleStore</code>、<code>phaseStore</code>、<code>layoutStore</code>、<code>termMapWindowSettingsStore</code> など、関心ごとに 15 以上のストアへ切り分けている。</p>",
        },
        {
          type: "cards",
          items: [
            { title: "バケツリレーが消える", body: "深いコンポーネントからも、必要な状態へ直接セレクタでアクセスできる。" },
            { title: "再描画を最小化", body: "ストアが小さいぶん購読の粒度を絞れ、不要な再レンダリングを避けられる。" },
            { title: "React の外からも触れる", body: "物理ループや SSE ブリッジからも <code>store.getState()</code> で読み書きできる。" },
          ],
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "毎フレーム動く物理演算は、あえて React state を経由しない。Zustand は「いつ React に再描画させ、いつ素の JS として扱うか」を選べる点が、このアプリと相性が良かった。",
        },
      ],
    },
    {
      id: "result",
      heading: "得られたもの",
      blocks: [
        {
          type: "stats",
          items: [
            { value: "4", label: "レイヤ", sub: "domain / app / infra / presentation" },
            { value: "15+", label: "Zustand ストア", sub: "関心ごとに分割" },
            { value: "2", label: "Strategy 実装", sub: "頻度 / ベクトル類似度" },
            { value: "1方向", label: "依存の向き", sub: "外 → 内のみ" },
          ],
        },
        {
          type: "text",
          content:
            "<p>分離の最大の見返りは「<strong>怖がらずに実験できる</strong>」ことだった。スコアリングを差し替えても UI は無傷、レイアウトを作り直しても解析は無関係。展示直前まで細部を詰められたのは、この境界線のおかげだ。</p>",
        },
      ],
    },
  ],
};

export default page;
