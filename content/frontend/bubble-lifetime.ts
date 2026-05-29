import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "bubble-lifetime",
  title: "バブルライフタイム管理 v3.0",
  description:
    "会話が続けばバブルは無限に増える。増えすぎれば視認性が落ち、消し方を誤れば重要な語まで消える。ソフト上限・デスロウ（5秒の猶予）・ハード上限の三段階で寿命を管理し、ピン留めを死守する個数ベース方式に辿り着くまでの設計を公開する。",
  intro:
    "「どのバブルを、いつ消すか」は見た目以上に難しい。時間で消すと活発な会話で一瞬で消え、放置すれば画面が埋まる。v3.0 では<strong>時間ではなく個数</strong>を主軸に据え、猶予期間を挟むことで「消えそう」を予感させる挙動にした。",
  tags: ["状態管理", "UX", "アルゴリズム"],
  sections: [
    {
      id: "history",
      heading: "v1 → v3 の試行錯誤",
      blocks: [
        {
          type: "lead",
          content:
            "寿命管理は3世代を経ている。失敗から学んだ要点を、まず時系列で振り返る。",
        },
        {
          type: "table",
          caption: "ライフタイム管理の世代比較",
          head: ["世代", "方式", "問題点"],
          rows: [
            ["v1", "一定時間で消滅", "活発な会話だと重要語が一瞬で消える"],
            ["v2", "時間 + 重要度の重み付け", "閾値調整が難しく、画面が埋まる場面が残る"],
            ["v3", "<strong>個数ベース上限 + 猶予</strong>", "視認性と安定性を両立（現行）"],
          ],
        },
      ],
    },
    {
      id: "three-stage",
      heading: "三段階の寿命モデル",
      blocks: [
        {
          type: "text",
          content:
            "<p>現行モデルは、表示中バブル数を 2 つの閾値で区切る。ハード上限はユーザー設定の最大表示数（<code>maxVisibleTerms</code>）、ソフト上限はそれと 20 の小さい方だ。</p>",
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "stores/bubbleStore.ts",
            code: `export const LEGACY_SOFT_LIMIT = 20
export const SOFT_LIFESPAN_MS = 5000 // デスロウの猶予 = 5秒

export function computeSoftLimit(hardLimit: number): number {
  return Math.min(LEGACY_SOFT_LIMIT, hardLimit)
}`,
          },
        },
        {
          type: "steps",
          items: [
            { title: "ソフト上限以下", body: "表示数が <code>softLimit</code> 以下なら、バブルは自動削除されず残り続ける。" },
            { title: "デスロウ（死刑囚房）", body: "ソフト上限を超えると、古い非ピン留めバブルを「デスロウ」に登録。<strong>5秒の猶予</strong>が与えられ、その間に再び重要度が上がれば生き残れる。" },
            { title: "ハード上限超過", body: "<code>hardLimit</code> を超えたら猶予なしで即時削除。古い非ピン留めから上限に収まるまで間引く。" },
          ],
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "猶予期間（デスロウ）が UX の肝。いきなり消すのではなく「消えゆく猶予」を挟むことで、ユーザーは反応する余地を得る。削除時は 1.2 秒かけてフェードアウトさせ、視線を驚かせない。",
        },
      ],
    },
    {
      id: "invariant",
      heading: "ピン留めは絶対に消さない",
      blocks: [
        {
          type: "text",
          content:
            "<p>このアルゴリズムを貫く不変条件が一つある。<strong>ピン留めされたバブルは、いかなる段階でも削除対象にしない</strong>。間引きの候補は常に「非ピン留めのうち古いもの」から選ばれる。タイムスタンプは <code>Date.now()</code> で記録され、古さの判定に使われる。</p>",
        },
        {
          type: "list",
          items: [
            "削除候補は「非ピン留め × 古い順」でソートして抽出する",
            "デスロウの経過判定は <code>now − 登録時刻 ≥ SOFT_LIFESPAN_MS</code>",
            "ライフサイクルの監視は約1秒間隔のフックで回り、表示数を常に上限内へ保つ",
          ],
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "presentation/hooks/useBubbleLifecycle.ts（要約）",
            code: `const hardLimit = settings.maxVisibleTerms
const softLimit = computeSoftLimit(hardLimit)

// 1. ハード上限を超えたら即時間引き（非ピン留め・古い順）
if (sorted.length > hardLimit) { /* overflow を削除 */ }

// 2. ソフト上限超過分をデスロウへ登録
// 3. デスロウ滞在が DEATH_ROW_MS を超えたら削除
if (now - deathRow[termId] >= DEATH_ROW_MS) { /* remove */ }`,
          },
        },
      ],
    },
    {
      id: "result",
      heading: "結果：埋もれない画面",
      blocks: [
        {
          type: "stats",
          items: [
            { value: "20", label: "ソフト上限", sub: "min(20, 設定値)" },
            { value: "5s", label: "デスロウ猶予", sub: "SOFT_LIFESPAN_MS" },
            { value: "1.2s", label: "フェード時間", sub: "視線への配慮" },
            { value: "∞", label: "ピン留め寿命", sub: "削除対象外" },
          ],
        },
        {
          type: "text",
          content:
            "<p>「時間で消す」直感的な方式を捨て、個数を軸に猶予を挟む。たったこれだけの変更で、会話の速さに依存せず常に見やすい数のバブルが保たれるようになった。重要だと判断してピン留めした語は、最後まで画面に残る。</p>",
        },
      ],
    },
  ],
};

export default page;
