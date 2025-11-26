const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// === Circle groups data ===
const groups = [
  { x: w * 0.25, y: h * 0.55, color: "rgba(0,123,255,", size: 250, miniCount: 8, miniRadius: 150 },
  { x: w * 0.75, y: h * 0.35, color: "rgba(255,140,0,", size: 200, miniCount: 7, miniRadius: 130 },
  { x: w * 0.5, y: h * 0.75, color: "rgba(255,215,0,", size: 160, miniCount: 6, miniRadius: 100 },
];

// Generate mini circles
groups.forEach(g => {
  g.minis = [];
  for (let i = 0; i < g.miniCount; i++) {
    g.minis.push({
      angle: (i / g.miniCount) * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.01,
    });
  }
});

function drawGradientCircle(x, y, size, color, pulsePhase) {
  const radius = size * (1 + 0.05 * Math.sin(pulsePhase));
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `${color}0.9)`);
  gradient.addColorStop(0.4, `${color}0.5)`);
  gradient.addColorStop(1, `${color}0)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawMiniCircle(x, y, color) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.5, `${color}0.5)`);
  gradient.addColorStop(1, `${color}0)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
}

function drawLines(minis, color) {
  ctx.strokeStyle = `${color}0.25)`;
  ctx.lineWidth = 1;
  for (let i = 0; i < minis.length; i++) {
    for (let j = i + 1; j < minis.length; j++) {
      ctx.beginPath();
      ctx.moveTo(minis[i].x, minis[i].y);
      ctx.lineTo(minis[j].x, minis[j].y);
      ctx.stroke();
    }
  }
}

let t = 0;
function animate() {
  ctx.clearRect(0, 0, w, h);
  t += 0.02;

  groups.forEach(g => {
    // Draw main glowing circle
    drawGradientCircle(g.x, g.y, g.size, g.color, t);

    // Update & draw mini orbiting circles
    const minis = [];
    g.minis.forEach((m, i) => {
      const angle = m.angle + t * m.speed * 20;
      const x = g.x + Math.cos(angle) * g.miniRadius;
      const y = g.y + Math.sin(angle) * g.miniRadius;
      drawMiniCircle(x, y, g.color);
      minis.push({ x, y });
    });

    // Draw faint connecting lines
    drawLines(minis, g.color);
  });

  requestAnimationFrame(animate);
}
animate();
