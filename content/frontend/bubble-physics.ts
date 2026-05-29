import type { DetailPage } from "@/content/types";

const page: DetailPage = {
  slug: "bubble-physics",
  title: "バブルクラウド物理エンジン",
  description:
    "会話中に抽出された重要語をバブルとして浮かせる。配置は「ランダム」でも「格子」でもなく、2D 物理シミュレーションで動的に決定される。",
  tags: ["物理シミュレーション", "requestAnimationFrame", "パフォーマンス"],
  sections: [
    {
      id: "overview",
      heading: "バブルとは何か",
      blocks: [
        {
          type: "images",
          images: [
            {
              src: "/window-bubble.png",
              alt: "バブルウィンドウ",
              caption: "重要語がバブルとして浮かぶ",
            },
            {
              src: "/app-bubble.png",
              alt: "バブルと文字起こしの同時表示",
              caption: "文字起こしのハイライトとバブルが連動",
            },
          ],
          layout: "row",
        },
        {
          type: "text",
          content: `<p>バブルは単なる「タグクラウド」ではない。<strong>重要度スコアに応じてサイズが変わり</strong>、互いに物理的に押し合いながら自然な配置に落ち着く UI コンポーネントだ。</p>
<p>ホバーで簡単な説明、左クリックで詳細パネルを表示、右クリックでピン留め。マウスだけで完結する操作体系を徹底した。</p>`,
        },
      ],
    },
    {
      id: "forces",
      heading: "3つの力による物理シミュレーション",
      blocks: [
        {
          type: "text",
          content: `<p>バブルの位置は毎フレーム、3 種類の力の合力で更新される。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "概念コード（TypeScript）",
            code: `// 各フレームで全バブルに適用される力
function applyForces(bubble: Bubble, others: Bubble[], container: Rect) {
  let fx = 0, fy = 0;

  // 1. 浮力：下から上へ定常的に押し上げる
  fy -= BUOYANCY;

  // 2. 求心力：コンテナ中央へ引き寄せる（端への張り付きを防ぐ）
  fx += (container.cx - bubble.x) * ATTRACTION;
  fy += (container.cy - bubble.y) * ATTRACTION;

  // 3. 反発力（ペナルティ法）：他バブルとの重なりを押し出す
  for (const other of others) {
    const dx = bubble.x - other.x;
    const dy = bubble.y - other.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = bubble.r + other.r + MARGIN;

    if (dist < minDist && dist > 0) {
      const overlap = minDist - dist;
      const force = overlap * REPULSION;  // 食い込み深さに比例
      fx += (dx / dist) * force;
      fy += (dy / dist) * force;
    }
  }

  bubble.vx = (bubble.vx + fx) * DAMPING;
  bubble.vy = (bubble.vy + fy) * DAMPING;
  bubble.x += bubble.vx;
  bubble.y += bubble.vy;
}`,
          },
        },
        {
          type: "list",
          items: [
            "<strong>浮力</strong>：常に上方向に押し上げる一定の力。バブルが自然に「浮かんでいる」ように見える。",
            "<strong>求心力</strong>：コンテナ中央への引力。画面外・端への張り付きを防ぐ。",
            "<strong>反発力（ペナルティ法）</strong>：2バブル間の距離が「半径の和＋マージン」を下回ると、食い込み深さに比例した力で互いを押し出す。",
          ],
        },
      ],
    },
    {
      id: "fps",
      heading: "React を介さない 60fps 描画",
      blocks: [
        {
          type: "text",
          content: `<p>物理演算の結果をそのまま React の state に反映すると、毎フレームの再レンダリングが発生してフレームレートが落ちる。TalkScope では <strong>React を完全に迂回した描画</strong> を採用している。</p>`,
        },
        {
          type: "code",
          code: {
            lang: "TypeScript",
            code: `// BubbleCloud.tsx — アニメーションループ
const loop = useCallback(() => {
  // 物理演算は純粋な JS オブジェクト配列で完結
  bubbles.forEach((b) => applyForces(b, bubbles, containerRect));

  // DOM ノードを直接書き換える（React の state/props を更新しない）
  bubbles.forEach((b) => {
    const el = domRefs.current.get(b.id);
    if (el) {
      el.style.transform = \`translate(\${b.x - b.r}px, \${b.y - b.r}px)\`;
    }
  });

  rafId.current = requestAnimationFrame(loop);
}, []);`,
          },
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "React の再レンダリングはバブルの追加・削除・サイズ変更時のみ発生させる。毎フレームの位置更新は style.transform の直接書き換えで処理。これにより 60fps を安定して維持できる。",
        },
        {
          type: "text",
          content: `<p>バブルのサイズ（重要度・ピン留め状態）が変化した瞬間だけ React が再レンダリングし、次フレームの衝突判定で隣のバブルを自動的に押し退ける。物理的な「動的整列」が自然に起きる。</p>`,
        },
      ],
    },
    {
      id: "responsive",
      heading: "コンテナリサイズへの自動対応",
      blocks: [
        {
          type: "text",
          content: `<p>ユーザーがウィンドウ枠をドラッグしてバブルパネルをリサイズすると、<code>ResizeObserver</code> でコンテナサイズの変化を検知し、求心力のターゲット座標を新しい中心点に更新する。バブルは物理力に従って自然に再配置される。</p>`,
        },
        {
          type: "callout",
          variant: "info",
          content:
            "スライダーでバブルの倍率をユーザーが変更可能。枠の大きさを変えると倍率が自動調整されるため、パネルが小さくなってもバブルがはみ出さない。",
        },
      ],
    },
  ],
};

export default page;
