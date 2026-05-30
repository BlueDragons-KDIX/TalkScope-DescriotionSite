import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "scoring-algorithm",
  title: "用語スコアリングアルゴリズム",
  description:
    "バブルの大きさを決める「重要度スコア」は、出現回数の素点に、テーマ類似とレア度（IDF）のバフを足して作る。現行 API では IDF とテーマ類似を独立した加点として返し、テーマ EMA は既定オフの機能として用意している。",
  intro:
    "「どの語を大きく表示するか」は、このアプリの体験そのものを左右する。多く出た語が常に重要とは限らないし、珍しすぎる語ばかり目立っても困る。そこで素点＋バフという<strong>加算合成</strong>で、複数の観点を1つのスコアにまとめている。",
  tags: ["IDF", "EMA", "コサイン類似度"],
  sections: [
    {
      id: "shape",
      heading: "スコアの形 ── 素点 + バフ",
      blocks: [
        {
          type: "lead",
          content:
            "最終スコアは「素点（base）」に複数の「バフ（buffs）」を足し、下限 0 でクリップした値。デバフの枠も用意されているが、現行の用語スコアでは加点のみを使う。",
        },
        {
          type: "code",
          code: {
            lang: "Python",
            title: "compose_additive_score（score_building_blocks.py）",
            code: `raw   = base + buff_total - debuff_total
final = max(floor, raw)   # floor = 0.0

# 用語スコアでの内訳
base               # 出現回数からの素点
buffs.theme_linear # テーマ類似バフ
buffs.idf_scaled   # レア度（IDF）バフ`,
          },
        },
        {
          type: "callout",
          variant: "info",
          content:
            "結果は内訳付きの dict（base / buffs / final）で返る。なぜそのサイズになったかを後から説明できるよう、合成の途中経過を捨てずに保持している。",
        },
      ],
    },
    {
      id: "base",
      heading: "素点 ── 中庸が最大になる放物線",
      blocks: [
        {
          type: "text",
          content:
            "<p>素点は出現回数から作るが、<strong>「多いほど高い」ではない</strong>。<code>count_axis_weight</code> は回数を <code>0〜1</code> に正規化してから <code>4x(1-x)</code> を掛ける。これは中点で最大 <code>1.0</code>、両端で <code>0</code> になる放物線で、出すぎる語（フィラー的な頻出語）と1回きりの語の両方を抑える。</p>",
        },
        {
          type: "code",
          code: {
            lang: "Python",
            title: "count_axis_weight(count, cap=100)",
            code: `x = min(count, cap) / cap   # cap = 100
weight = 4 * x * (1 - x)    # 中点 x=0.5（count=50）で最大 1.0

# count=1   → 0.0396
# count=50  → 1.0
# count=100 → 0.0`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "この素点は occurrence_count が送られたときだけ使う。省略された場合は base=0 になり、IDF やテーマ類似などのバフだけで final を作る。",
        },
      ],
    },
    {
      id: "buffs",
      heading: "2つのバフ ── テーマ類似とレア度",
      blocks: [
        {
          type: "text",
          content:
            "<p>素点に2種類のバフを足す。<strong>テーマ類似</strong>は「今の会話の話題」と語の意味の近さ、<strong>IDF</strong>は「その語の珍しさ」だ。どちらも重みは小さめに置き、素点を主役に保ちつつ味付けする。</p>",
        },
        {
          type: "table",
          caption: "バフの計算式と重み",
          head: ["バフ", "式", "重み"],
          rows: [
            ["theme_linear", "w · (cos(term, theme) + 1) / 2", "0.5"],
            ["idf_scaled", "w · IDF(lemma)", "0.08"],
          ],
        },
        {
          type: "text",
          content:
            "<p>コサイン類似度は <code>[-1, 1]</code> の値域を持つため、<code>(sim + 1) / 2</code> で <code>[0, 1]</code> に線形変換してから重みを掛ける。マイナス方向の類似（話題と無関係）でバフが負にならないようにするためだ。IDF は語彙ごとに事前計算したテーブルを引き、未知語は<strong>平均 IDF</strong>にフォールバックする。</p>",
        },
        {
          type: "callout",
          variant: "note",
          content:
            "テーマ類似バフは既定では無効（THEME_EMA_ENABLED = False）。テーマ EMA を有効化したセッションでのみ theme_linear が加算され、それ以外は theme_vector_used が null になる。",
        },
      ],
    },
    {
      id: "theme-ema",
      heading: "テーマベクトル ── 会話の流れを EMA で追う",
      blocks: [
        {
          type: "text",
          content:
            "<p>「今の話題」は固定ではなく、会話が進むほど移ろう。そこでチャンク（発話の小単位）ごとに文ベクトルを取り、<strong>指数移動平均（EMA）</strong>で1本のテーマベクトルへ滑らかに混ぜ込む。新しい発話を <code>α</code> の割合で取り込み、毎回 L2 正規化して向きだけを保つ。</p>",
        },
        {
          type: "code",
          code: {
            lang: "Python",
            title: "ema_theme_step（α = 0.10）",
            code: `blended = (1 - alpha) * theme + alpha * v_t
theme'  = l2_normalize(blended)

# alpha = THEME_EMA_ALPHA_DEFAULT = 0.10
# 初回（theme が空）は v_t を正規化して返す`,
          },
        },
        {
          type: "cards",
          items: [
            { title: "相槌スキップ", body: "「はい」「なるほど」など定型の相槌や、内容語が 2 語未満の短文はテーマ更新をスキップする。" },
            { title: "1チャンク1回", body: "重い文ベクトル化は、チャンクあたり高々1回に抑える。" },
            { title: "向きで比較", body: "正規化済みなので、テーマと語のコサイン類似度は純粋に意味の近さを表す。" },
          ],
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "α=0.10 は「過去9割・現在1割」の配合。話題が急に飛んでもテーマは一気に振れず、数チャンクかけて滑らかに追従する。相槌を弾くゲートが、無意味な揺らぎからテーマを守る。",
        },
      ],
    },
    {
      id: "dictionary-sse-score",
      heading: "辞書 SSE でのスコア計算",
      blocks: [
        {
          type: "text",
          content:
            "<p><code>/analysis/refer_dictionary_get_scores</code> の SSE では、DB または Gemini から得た語義候補と入力テキストの embedding を使って、返却用のスコアを計算する。複数語義の best-sense 選択は将来拡張の余地として関数・データ構造を持っているが、現行の説明では「語義候補と文脈ベクトルの類似度をスコアへ反映する」と捉えるのが正確だ。</p>",
        },
        {
          type: "code",
          code: {
            lang: "Python",
            title: "辞書 SSE の接続イメージ",
            code: `async for term_infos, text_vector, source in refer_dictionary_stream(text):
    score_results = compute_term_score_by_term_info(
        term_infos=term_infos,
        text_vector=text_vector,
    )
    yield {"term": term, "description": description, "score": score, "source": source}`,
          },
        },
        {
          type: "callout",
          variant: "info",
          content:
            "HTTP の <code>/analysis/score/terms</code> は、クライアントから渡された <code>term_vector</code> とサーバ側の IDF / テーマ状態を使う。一方、辞書 SSE は DB / Gemini から得た語義 embedding と入力文 embedding を使って、返却用のスコア付き結果を組み立てる。",
        },
      ],
    },
    {
      id: "summary",
      heading: "まとめ：観点を足し算で束ねる",
      blocks: [
        {
          type: "stats",
          items: [
            { value: "4x(1−x)", label: "素点の形", sub: "中庸が最大" },
            { value: "0.5", label: "テーマ類似の重み", sub: "theme_linear" },
            { value: "0.08", label: "IDF の重み", sub: "idf_scaled" },
            { value: "0.10", label: "EMA の α", sub: "テーマ追従" },
          ],
        },
        {
          type: "text",
          content:
            "<p>掛け算で観点を絡めると一つの要素が暴れたとき全体が壊れる。<strong>加算合成</strong>なら各観点の寄与が独立し、内訳をそのまま説明に使える。出現回数・話題への近さ・珍しさという異質な3軸を、素直な足し算で1つの重要度へまとめている。</p>",
        },
      ],
    },
  ],
};

export default page;
