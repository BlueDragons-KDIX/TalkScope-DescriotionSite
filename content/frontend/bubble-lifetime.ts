import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "bubble-lifetime",
  title: "バブルライフタイム管理 v3.0",
  description:
    "バブルが増えすぎると視認性とパフォーマンスが落ちる。v1→v2→v3 と3回書き直した末に辿り着いた「個数ベース上限＋ゾンビ防止」設計の全記録。",
  tags: ["状態管理", "UX", "アルゴリズム"],
  sections: [
    {
      id: "problem",
      heading: "問題：バブルが増えすぎる",
      blocks: [
        {
          type: "image",
          image: {
            src: "/app-bubble.png",
            alt: "バブルが浮かんでいる状態",
            caption: "会話が長くなるにつれバブルが増えていく",
          },
        },
        {
          type: "text",
          content: `<p>音声認識が進むにつれ、次々と新しい重要語が抽出されてバブルが増えていく。20個を超えると物理エンジンの負荷が上がり、視覚的にも「どれが重要か分からない」状態になる。</p>
<p>「古いバブルを消す」という単純な方針も、ピン留めしたバブルまで消えてしまったり、一度消えたバブルが同じ単語の再出現で復活（ゾンビ化）したりという問題があった。</p>`,
        },
      ],
    },
    {
      id: "v1",
      heading: "v1.0：30秒タイマー",
      blocks: [
        {
          type: "text",
          content: `<p>最初のアプローチはシンプルな30秒タイマー。バブルが生成されてから30秒後に削除する。</p>`,
        },
        {
          type: "callout",
          variant: "warning",
          content:
            "問題：重要なバブルも時間経過で消えてしまう。ユーザーがピン留めし忘れた大事な用語が静かに消えていく体験は良くない。",
        },
      ],
    },
    {
      id: "v2",
      heading: "v2.0：時間減衰スコアによる優先削除",
      blocks: [
        {
          type: "text",
          content: `<p>スコアベースの管理へ刷新。各バブルに「時間減衰スコア」を持たせ、スコアが低いものから優先的に削除する。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// v2: 時間減衰スコア
score(term) = clickCount * Math.exp(-elapsedMinutes / 5)

// ソフト上限 12個 / ハード上限 20個
// スコア最下位から順に削除
// 新出バブルは20秒間削除対象外（猶予期間）
// 文字起こしに再登場したらタイムスタンプリセット（延命）`,
          },
        },
        {
          type: "callout",
          variant: "warning",
          content:
            "問題：スコア計算が複雑になりすぎた。チューニングパラメータが増え、「何を変えると挙動がどう変わるか」の予測が難しくなった。",
        },
      ],
    },
    {
      id: "v3",
      heading: "v3.0：個数ベース上限管理（現行）",
      blocks: [
        {
          type: "text",
          content: `<p>複雑さを捨てて、シンプルで強力な個数管理に切り替えた。ルールは3つだけ。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "ルール定義",
            code: `// バブル数 ≤ 20  → 削除なし。そのまま残し続ける
// バブル数 21〜30 → 最古のバブルから「寿命カウントダウン」開始
//                   未ピン留め: 5秒後に削除
//                   ピン留め済み: 10秒後に削除
// バブル数 > 30   → 即座に最古から強制削除、常に最大30個を維持`,
          },
        },
        {
          type: "list",
          items: [
            "ルールが直感的で「いつ消えるか」が予測しやすい",
            "ピン留めバブルは猶予時間が2倍あるため、重要な用語を保護できる",
            "スコアパラメータのチューニングが不要",
          ],
        },
      ],
    },
    {
      id: "zombie",
      heading: "ゾンビ防止：historicalTermIdsRef",
      blocks: [
        {
          type: "text",
          content: `<p>寿命で削除されたバブルが、同じ単語が文字起こしに再登場したことで復活してしまう「ゾンビ問題」があった。</p>
<p>解決策は <code>historicalTermIdsRef</code>。一度でも画面に出現したことがある用語の ID を記憶し続ける ref だ。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// App.tsx
// リセットされるまで、過去に存在したバブルIDを覚え続ける
const historicalTermIdsRef = useRef<Set<string>>(new Set());

// 新しいバブルを追加しようとする時
function addBubble(term: Term) {
  // 過去に存在したIDなら追加しない（ゾンビ防止）
  if (historicalTermIdsRef.current.has(term.id)) return;

  historicalTermIdsRef.current.add(term.id);
  // ... バブルを追加
}

// テキストエリアリセット時のみ履歴もクリア
function handleReset() {
  historicalTermIdsRef.current.clear();
  // ...
}`,
          },
        },
        {
          type: "callout",
          variant: "info",
          content:
            "ref を使う理由：この履歴は React の再レンダリングトリガーにする必要がない。state にすると不要な再描画が発生する。純粋に「副作用のないメモ帳」として ref が最適。",
        },
      ],
    },
    {
      id: "pin",
      heading: "ピン留め機能（★）",
      blocks: [
        {
          type: "text",
          content: `<p>バブル右上の星ボタン（ホバー時に表示）か、詳細パネルの「ピン」ボタンでトグルできる。ピン済みバブルは黄色グロー付きの ★ で強調表示され、削除の猶予時間が2倍になる。</p>
<p>ピン解除した瞬間からカウントダウンが始まる。「気になったらとりあえずピン」→「後で解除して自然に消す」というフローが想定されている。</p>`,
        },
      ],
    },
  ],
};

export default page;
