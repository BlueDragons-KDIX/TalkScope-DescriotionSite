import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "dictionary-api",
  title: "辞書 API ── DB 先行 × Gemini 補完 × SSE",
  description:
    "抽出した語の意味をどう返すか。まず DB をバッチで引き、ヒットしなかった語だけ Gemini に意味候補生成を依頼する。生成結果はその場でベクトル化し、SSE でプロンプト完了ごとに逐次返す。DB は速く、LLM は重いという非対称を素直に設計へ落とし込んだ辞書パイプラインを追う。",
  intro:
    "辞書参照は「速さ」と「網羅性」の綱引きだ。DB にある語は一瞬で返せるが、未知語は LLM で生成するしかなく時間がかかる。そこで<strong>速い答えは即返し、重い生成は待たせない</strong>よう、ストリーミングで段階的に結果を届ける設計にした。",
  tags: ["Gemini", "SSE", "辞書"],
  sections: [
    {
      id: "flow",
      heading: "DB 先行・LLM 補完の流れ",
      blocks: [
        {
          type: "lead",
          content:
            "辞書参照は「DB に聞く → 無い語だけ LLM に聞く → ベクトル化して保存」という一方向の流れ。DB ヒットは即返し、LLM 生成はプロンプト単位で完了したものから順に返す。",
        },
        {
          type: "steps",
          items: [
            { title: "文ベクトル化（並行）", body: "入力テキストの embedding を先に走らせ、後段の類似度スコア計算に備える。" },
            { title: "検索対象の抽出 → dedup", body: "形態素解析で名詞などを抽出し、複合語を連結。1文字語は単独検索から除外する。" },
            { title: "DB バッチ参照", body: "ユニークな語をまとめて DB に問い合わせ。ヒットした語は <code>source: \"db\"</code> で<strong>先に</strong>返す。" },
            { title: "ミス分を Gemini へ", body: "DB に無かった語だけをグループに分け、プロンプト単位で語義を生成する。" },
            { title: "ベクトル化して逐次返却", body: "生成された語義をその場で embedding し、<code>source: \"llm\"</code> で順次返す。最後にまとめて DB へ保存。" },
          ],
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "DB ヒット分を先頭で yield するのが肝。既知語がある場合、ユーザーは重い LLM 生成を待たずに、最初のバブルを見られる。",
        },
      ],
    },
    {
      id: "sse",
      heading: "SSE ── 完了した分から流す",
      blocks: [
        {
          type: "text",
          content:
            "<p>辞書参照は <code>AsyncGenerator</code> として実装され、結果を Server-Sent Events で逐次配信する。DB ヒット分が1イベント、その後 LLM のプロンプトが1つ完了するたびに1イベント、という粒度で流れる。LLM 呼び出しは <code>asyncio.as_completed</code> で待ち受け、<strong>速く返ったプロンプトから順に</strong>届ける。</p>",
        },
        {
          type: "code",
          code: {
            lang: "Python",
            title: "service_analyze_text（SSE ペイロード）",
            code: `async for term_infos, text_vector, source in refer_dictionary_stream(text):
    score_results = compute_term_score_by_term_info(term_infos, text_vector)
    response = [
        {"term": t, "description": d, "score": s, "source": source}
        for t, d, s in score_results
    ]
    if response:
        yield f"data: {json.dumps(response, ensure_ascii=False)}\\n\\n"`,
          },
        },
        {
          type: "cards",
          items: [
            { title: "source フィールド", body: "その語義が DB 由来（<code>db</code>）か LLM 生成（<code>llm</code>）かを明示する。" },
            { title: "プロンプト粒度", body: "1プロンプト分の語義が揃った時点で embedding まで済ませ、即 yield する。" },
            { title: "失敗は握りつぶさない", body: "あるプロンプトの生成が失敗してもログに残して継続し、他の語を巻き添えにしない。" },
          ],
        },
      ],
    },
    {
      id: "gemini",
      heading: "Gemini への語義生成依頼",
      blocks: [
        {
          type: "text",
          content:
            "<p>未知語は <strong>Gemini</strong>（REST、既定 <code>gemini-1.5-flash</code>）に意味候補生成を依頼する。語は <code>group_size</code> 個ずつまとめて1プロンプトにし、各語につき最大 <code>generate_max_sense</code> 個の意味を JSON で返させる。モデル、timeout、group size、生成数は環境変数で調整できる。</p>",
        },
        {
          type: "specs",
          items: [
            { term: "モデル", value: "<code>gemini-1.5-flash</code>（環境変数で差し替え可）" },
            { term: "group_size", value: "1プロンプトの語数 — 既定 <code>10</code>" },
            { term: "generate_max_sense", value: "1語あたりの意味候補数 — 既定 <code>3</code>" },
            { term: "出力形式", value: "語をキーにした JSON object（意味の配列）" },
            { term: "並列実行", value: "プロンプト群を <code>asyncio</code> で並行呼び出し" },
          ],
        },
        {
          type: "code",
          code: {
            lang: "JSON",
            title: "Gemini に返させる語義 JSON の形",
            code: `{
  "機械学習": ["データからパターンを学習し予測を行う技術"],
  "推論": ["既知の事実から結論を導く処理", "学習済みモデルで予測を出すこと"]
}`,
          },
        },
        {
          type: "callout",
          variant: "info",
          content:
            "「入力された単語を完全一致のキーに」「入力外の単語は足さない」と制約することで、後段のベクトル化・DB 保存が語をそのまま突き合わせられる。出力スキーマを固定することが、パイプラインの安定の前提になる。",
        },
      ],
    },
    {
      id: "fallback",
      heading: "失敗時の扱い",
      blocks: [
        {
          type: "text",
          content:
            "<p>SSE 版の辞書 API は、失敗した外部処理をできるだけ局所化する。DB が使えなければ DB 検索をスキップし、LLM の一部プロンプトが失敗した場合はログに残して他のプロンプトを継続する。すべての外部依存が落ちても常に完全な結果を返せる、という意味ではなく、<strong>取れた分を先に返す</strong>ための設計だ。</p>",
        },
        {
          type: "table",
          caption: "辞書 API の劣化パス",
          head: ["状況", "挙動"],
          rows: [
            ["DB 利用不可", "DB 検索をスキップし、全語を LLM 生成に回す"],
            ["DB 検索が例外", "空リストにフォールバックし、ミス扱いで LLM へ"],
            ["LLM プロンプト失敗", "そのプロンプトだけ捨て、他の語の結果は返す"],
            ["embedding 失敗", "空ベクトルを返し、その後のスコア計算で扱える範囲に縮退"],
            ["DB 保存失敗", "ログに残して継続（生成結果の返却は完了済み）"],
          ],
        },
        {
          type: "quote",
          text: "速い答えは即返し、重い生成は待たせず、どこかが落ちても止めない。",
          cite: "辞書パイプラインの設計方針",
        },
      ],
    },
  ],
};

export default page;
