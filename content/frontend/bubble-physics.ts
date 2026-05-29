import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "bubble-physics",
  title: "バブルクラウド物理エンジン",
  description:
    "重要語をバブルとして浮かせる。その配置は「ランダム」でも「格子」でもなく、毎フレーム走る2D物理シミュレーションで決まる。浮力・求心力・反発力の3力と、React を迂回した translate3d 描画で 60fps を保つ実装を解説する。",
  intro:
    "バブルは単なるタグクラウドではない。<strong>重要度に応じてサイズが変わり</strong>、互いに押し合いながら自然な配置に落ち着く。会話が進むほどバブルが生まれては消えるこの UI を、軽量な物理エンジンで支えている。",
  tags: ["物理シミュレーション", "requestAnimationFrame", "パフォーマンス"],
  sections: [
    {
      id: "overview",
      heading: "バブルとは何か",
      blocks: [
        {
          type: "images",
          images: [
            { src: "/window-bubble.png", alt: "バブルウィンドウ", caption: "重要語がバブルとして浮かぶ" },
            { src: "/app-bubble.png", alt: "バブルと文字起こしの同時表示", caption: "ハイライトとバブルが連動する" },
          ],
          layout: "row",
        },
        {
          type: "text",
          content:
            "<p>ホバーで簡単な説明、左クリックで詳細パネル、右クリックでピン留め——マウスだけで操作が完結する。会話に集中したまま、視線移動だけで重要語を捌けるよう、配置の自然さに徹底的にこだわった。</p>",
        },
      ],
    },
    {
      id: "size",
      heading: "サイズは重要度で決まる",
      blocks: [
        {
          type: "text",
          content:
            "<p>各バブルの半径は、基準サイズにユーザー倍率とスコア係数を掛けて算出する。重要な語ほど大きく、ただし<strong>上限 95px</strong> で頭打ちにして、画面を占有しすぎないようにしている。</p>",
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "BubbleCloud.tsx — 半径の決定",
            code: `const baseR = 20;
let r = baseR * scaleFactor * scoreMult;
r = Math.min(r, 95); // 極端に大きくなりすぎないよう上限`,
          },
        },
        {
          type: "list",
          items: [
            "<code>scaleFactor</code>：ユーザーがスライダーで決める倍率（カスタマイズ記事参照）",
            "<code>scoreMult</code>：バックエンドが返す重要度スコアから導く係数",
            "ピン留め中のバブルはサイズ計算を上書きし、固定サイズで安定表示する",
          ],
        },
      ],
    },
    {
      id: "forces",
      heading: "3つの力による物理シミュレーション",
      blocks: [
        {
          type: "text",
          content:
            "<p>バブルの位置は毎フレーム、3 種類の力の合力で更新される。実際の係数は次のとおり、ごく小さな値だ。小さい力を毎フレーム積み上げることで、ふわりとした挙動が生まれる。</p>",
        },
        {
          type: "specs",
          items: [
            { term: "GRAVITY", value: "<code>-0.15</code>（上向きの浮力）" },
            { term: "DAMPING", value: "<code>0.88</code>（速度の減衰）" },
            { term: "求心力係数", value: "<code>0.0008</code>（中央へ緩やかに）" },
            { term: "反発係数", value: "<code>0.08</code>（食い込み深さに比例）" },
          ],
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "BubbleCloud.tsx — 各フレームの tick（要約）",
            code: `const GRAVITY = -0.15;  // 上に向かう浮力
const DAMPING = 0.88;

for (const n1 of nodes) {
  n1.vy += GRAVITY;                 // 1. 浮力
  n1.vx += (cx - n1.x) * 0.0008;    // 2. 中央への求心力

  // 3. 反発（ペナルティ法）：重なりを押し出す
  for (const n2 of others) {
    const dx = n1.x - n2.x, dy = n1.y - n2.y;
    const dist = Math.hypot(dx, dy);
    const minDist = n1.radius + n2.radius + PADDING;
    if (dist < minDist && dist > 0) {
      const force = (minDist - dist) * 0.08; // 食い込みに比例
      n1.vx += (dx / dist) * force;
      n1.vy += (dy / dist) * force;
    }
  }
}

// 速度を減衰させて位置に反映
n1.vx *= DAMPING; n1.vy *= DAMPING;
n1.x += n1.vx;    n1.y += n1.vy;`,
          },
        },
        {
          type: "list",
          items: [
            "<strong>浮力</strong>：常に上方向へ働く一定の力。バブルが「浮かんでいる」ように見せる。",
            "<strong>求心力</strong>：コンテナ中央へ引き寄せ、端や画面外への張り付きを防ぐ。",
            "<strong>反発力（ペナルティ法）</strong>：距離が「半径の和＋余白」を下回ると、食い込み深さに比例した力で互いを押し出す。重なりが自然に解消される。",
          ],
        },
        {
          type: "callout",
          variant: "note",
          content:
            "乱数による初速はあるが、力の計算自体は決定論的。反発の応答にランダム性を持たせていないため、同じ入力からは同じ整列に収束する。",
        },
      ],
    },
    {
      id: "fps",
      heading: "React を介さない 60fps 描画",
      blocks: [
        {
          type: "text",
          content:
            "<p>物理演算の結果をそのまま React の state に反映すると、毎フレーム再レンダリングが走りフレームレートが落ちる。TalkScope では <strong>React を完全に迂回した描画</strong>を採用した。座標は素の JS オブジェクトで持ち、DOM ノードの <code>transform</code> を直接書き換える。</p>",
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            title: "BubbleCloud.tsx — DOM への直接反映",
            code: `// tick の最後で、各ノードの DOM を直接更新する
el.style.transform =
  \`translate3d(\${n1.x - n1.radius}px, \${n1.y - n1.radius}px, 0)\`;

e.rafId = requestAnimationFrame(tick); // 次フレームを予約`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "毎フレームの位置更新は style.transform の直接書き換えで処理し、React の再レンダリングはバブルの追加・削除・サイズ変更時だけに限定する。これで 60fps を安定して維持できる。",
        },
        {
          type: "text",
          content:
            "<p>バブルの登場・退場には <strong>Motion</strong>（旧 Framer Motion）を使い、<code>spring</code>（damping 18 / stiffness 220）で弾むように現れる。物理ループの軽量な座標更新と、宣言的なアニメーションを役割分担させているのがポイントだ。</p>",
        },
      ],
    },
    {
      id: "responsive",
      heading: "コンテナリサイズへの自動対応",
      blocks: [
        {
          type: "text",
          content:
            "<p>レイアウトエンジンでバブルパネルをドラッグリサイズすると、コンテナの中心座標が変わる。求心力のターゲットを新しい中心へ更新すれば、バブルは物理力に従って自然に再配置される。倍率も枠サイズに追従して調整されるため、小さくしてもはみ出さない。</p>",
        },
        {
          type: "stats",
          items: [
            { value: "60fps", label: "描画レート", sub: "rAF + transform 直書き" },
            { value: "95px", label: "半径の上限", sub: "占有を抑える" },
            { value: "3", label: "合成する力", sub: "浮力 / 求心 / 反発" },
            { value: "0.88", label: "減衰係数", sub: "ふわっとした収束" },
          ],
        },
      ],
    },
  ],
};

export default page;
