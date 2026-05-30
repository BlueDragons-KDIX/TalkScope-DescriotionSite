import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "dictionary-api",
  title: "レイテンシ改善 ── DB 先行 × Gemini 補完 × SSE",
  description:
    "バックエンドで最も意識したのは、重い処理をどう待たせないかだ。DB と Gemini はバッチ化してリクエスト数を減らし、DB ヒットとミスを分離し、SSE で準備できた結果から返す。非同期並列で I/O 待ちの間に別タスクを進め、UX 上の待ち時間を短くするための設計を追う。",
  intro:
    "辞書参照は、TalkScope の中でもレイテンシが出やすい処理だ。DB、embedding、Gemini という I/O の多い処理が並ぶため、単純に全部終わるまで待つと体験が重くなる。そこで<strong>返せるものを先に返し、待ち時間の裏で次の処理を進める</strong>ことを軸に設計した。",
  tags: ["レイテンシ", "SSE", "Gemini"],
  sections: [
    {
      id: "latency-strategy",
      heading: "レイテンシ軽減の方針",
      blocks: [
        {
          type: "lead",
          content:
            "速くするために計算を雑にするのではなく、待たせ方を変える。リクエスト数を減らし、I/O を並列化し、準備できた結果から UI に流すことで、ユーザーが感じる待ち時間を短くした。",
        },
        {
          type: "cards",
          items: [
            { title: "バッチ化", tag: "DB / Gemini", body: "DB はまとめて参照し、Gemini も複数語を1プロンプトに束ねる。リクエスト数を減らし、サーバ負荷と失敗点を抑える。" },
            { title: "SSE", tag: "UX", body: "全処理完了を待たず、DB ヒットや Gemini の完了済みプロンプトから順に返す。" },
            { title: "非同期並列", tag: "I/O", body: "embedding、DB 参照、Gemini 呼び出しを待つ間に別の処理を進め、I/O 待ちを空白時間にしない。" },
          ],
        },
        {
          type: "table",
          caption: "レイテンシ対策と狙い",
          head: ["対策", "狙い"],
          rows: [
            ["DB バッチ参照", "単語ごとの DB 往復を避け、クエリ回数を削減する"],
            ["Gemini プロンプト分割", "複数語をまとめて投げ、完了したプロンプトから返す"],
            ["DB hit / miss の分離", "速い結果と重い生成処理を同じ待ち行列に入れない"],
            ["SSE", "準備できた結果から逐次返し、初回表示までの体感時間を短くする"],
            ["Gemini timeout", "外部 API の遅延でリクエスト全体が固まり続けるのを防ぐ"],
            ["リージョン近接", "Cloud Run と DB の配置を近づけ、ネットワーク RTT を抑える"],
          ],
        },
        {
          type: "callout",
          variant: "info",
          title: "リージョン近接",
          content:
            "DB と GCP 側の実行環境を地理的に近いリージョンへ寄せる考え方。英語では <code>region affinity</code> や <code>regional colocation</code> と呼ばれる文脈に近く、API 最適化だけでは消せないネットワーク往復時間を抑える狙いがある。",
        },
      ],
    },
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
            "DB ヒット分を先頭で yield するのが肝。既知語がある場合、ユーザーは Gemini の生成を待たずに、最初のバブルを見られる。",
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
            "<p>辞書参照は <code>AsyncGenerator</code> として実装され、結果を Server-Sent Events で逐次配信する。DB ヒット分が1イベント、その後 Gemini のプロンプトが1つ完了するたびに1イベント、という粒度で流れる。LLM 呼び出しは <code>asyncio.as_completed</code> で待ち受け、<strong>速く返ったプロンプトから順に</strong>届ける。</p>",
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
            { title: "タイムアウト", body: "Gemini API には timeout を設定し、外部 API 待ちでストリーム全体が止まり続けるのを防ぐ。" },
          ],
        },
      ],
    },
    {
      id: "gemini",
      heading: "Gemini と DB のバッチ処理",
      blocks: [
        {
          type: "text",
          content:
            "<p>未知語は <strong>Gemini</strong>（REST、既定 <code>gemini-1.5-flash</code>）に意味候補生成を依頼する。語は <code>group_size</code> 個ずつまとめて1プロンプトにし、各語につき最大 <code>generate_max_sense</code> 個の意味を JSON で返させる。DB も Gemini も単語ごとに細かく叩かず、まとまりで処理することで、リクエスト数と失敗点を減らしている。</p>",
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
            "バッチ化は単に速くするためだけではない。外部 API へのリクエスト数が減るほど、レート制限・ネットワークエラー・サーバ負荷の影響も小さくなる。",
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
