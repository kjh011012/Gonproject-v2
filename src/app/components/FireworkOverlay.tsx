import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  alpha: number;
  decay: number;
  life: number;
  gravity: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface Sparkle {
  x: number;
  y: number;
  r: number;
  alpha: number;
  decay: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

const FIREWORK_COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF8E53", "#E84393", "#00CEC9", "#FDCB6E",
  "#BFE9E2", "#CFE8FF", "#F6E7D8", "#FF9FF3",
  "#FEA47F", "#25CCF7", "#EAB543", "#55E6C1",
];

export function FireworkOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [visible, setVisible] = useState(true);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = canvas.offsetWidth * dpr;
    let h = canvas.offsetHeight * dpr;
    canvas.width = w;
    canvas.height = h;

    const particles: Particle[] = [];
    const sparkles: Sparkle[] = [];
    let phase = 0; // 0=orbit, 1=rise, 2=explode, 3=sparkle, 4=fadeout
    let phaseTime = 0;
    let globalAlpha = 1;

    // Orbit parameters
    let orbitAngle = -Math.PI / 2;
    const orbitCx = w / 2;
    const orbitCy = h / 2;
    const orbitRx = w * 0.2;
    const orbitRy = h * 0.15;
    let orbitTrail: { x: number; y: number; alpha: number }[] = [];

    // Rise parameters
    let riseX = 0;
    let riseY = 0;
    let riseTargetY = 0;

    // Text measurement
    const fontSize = Math.max(24, Math.min(w / 20, 48));
    const text = "당신의 일상에 따뜻한 돌봄을";

    startTimeRef.current = performance.now();

    function createExplosion(cx: number, cy: number, count: number) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = 3 + Math.random() * 8;
        const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed * dpr,
          vy: Math.sin(angle) * speed * dpr,
          r: (1.5 + Math.random() * 2.5) * dpr,
          color,
          alpha: 1,
          decay: 0.008 + Math.random() * 0.008,
          life: 1,
          gravity: 0.06 * dpr,
          trail: [],
        });
      }
    }

    function createSecondaryExplosions(cx: number, cy: number) {
      const offsets = [
        { dx: -w * 0.15, dy: -h * 0.08 },
        { dx: w * 0.18, dy: -h * 0.12 },
        { dx: -w * 0.08, dy: h * 0.05 },
        { dx: w * 0.1, dy: -h * 0.02 },
        { dx: 0, dy: -h * 0.18 },
        { dx: -w * 0.2, dy: -h * 0.15 },
        { dx: w * 0.22, dy: h * 0.02 },
      ];
      offsets.forEach((o, idx) => {
        setTimeout(() => {
          createExplosion(cx + o.dx, cy + o.dy, 60 + Math.floor(Math.random() * 40));
        }, idx * 200);
      });
    }

    function createSparkles() {
      for (let i = 0; i < 120; i++) {
        sparkles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (0.5 + Math.random() * 2) * dpr,
          alpha: Math.random() * 0.8 + 0.2,
          decay: 0.002 + Math.random() * 0.003,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
          twinkleSpeed: 2 + Math.random() * 4,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    const draw = (timestamp: number) => {
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = globalAlpha;

      // Phase transitions
      if (phase === 0 && elapsed > 3) {
        phase = 1;
        phaseTime = elapsed;
        // Set rise start position to current orbit position
        riseX = orbitCx + Math.cos(orbitAngle) * orbitRx;
        riseY = orbitCy + Math.sin(orbitAngle) * orbitRy;
        riseTargetY = h * 0.15;
      } else if (phase === 1 && elapsed - phaseTime > 1.2) {
        phase = 2;
        phaseTime = elapsed;
        // Main explosion
        createExplosion(riseX, riseTargetY, 120);
        createSecondaryExplosions(riseX, riseTargetY);
        createSparkles();
      } else if (phase === 2 && elapsed - phaseTime > 0.5) {
        phase = 3;
        phaseTime = elapsed;
      } else if (phase === 3 && elapsed - phaseTime > 4) {
        phase = 4;
        phaseTime = elapsed;
      }

      // Phase 0: Orbiting text beam
      if (phase === 0) {
        orbitAngle += 0.035;
        const bx = orbitCx + Math.cos(orbitAngle) * orbitRx;
        const by = orbitCy + Math.sin(orbitAngle) * orbitRy;

        // Add trail point
        orbitTrail.push({ x: bx, y: by, alpha: 1 });
        if (orbitTrail.length > 50) orbitTrail.shift();

        // Draw trail
        for (let i = 0; i < orbitTrail.length; i++) {
          const t = orbitTrail[i];
          t.alpha *= 0.95;
          const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 20 * dpr);
          grad.addColorStop(0, `rgba(246, 231, 216, ${t.alpha * 0.6})`);
          grad.addColorStop(1, `rgba(246, 231, 216, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 20 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw glowing beam
        const beamGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 40 * dpr);
        beamGrad.addColorStop(0, "rgba(255, 248, 230, 0.9)");
        beamGrad.addColorStop(0.4, "rgba(246, 231, 216, 0.5)");
        beamGrad.addColorStop(1, "rgba(191, 233, 226, 0)");
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.arc(bx, by, 40 * dpr, 0, Math.PI * 2);
        ctx.fill();

        // Draw text along beam
        ctx.save();
        ctx.font = `bold ${fontSize}px Pretendard, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255, 248, 230, ${0.7 + Math.sin(elapsed * 3) * 0.3})`;
        ctx.shadowColor = "rgba(246, 231, 216, 0.8)";
        ctx.shadowBlur = 20 * dpr;
        ctx.fillText(text, bx, by - 30 * dpr);
        ctx.restore();
      }

      // Phase 1: Rising beam
      if (phase === 1) {
        const progress = Math.min(1, (elapsed - phaseTime) / 1.2);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // ease out cubic
        const currentY = riseY + (riseTargetY - riseY) * easedProgress;
        const currentX = riseX;

        // Shrinking orbit trail
        for (const t of orbitTrail) {
          t.alpha *= 0.9;
        }
        for (const t of orbitTrail) {
          if (t.alpha > 0.01) {
            const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, 15 * dpr);
            grad.addColorStop(0, `rgba(246, 231, 216, ${t.alpha * 0.4})`);
            grad.addColorStop(1, `rgba(246, 231, 216, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 15 * dpr, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Rising beam with intensifying glow
        const intensity = 0.5 + progress * 0.5;
        const beamSize = (40 + progress * 30) * dpr;
        const beamGrad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, beamSize);
        beamGrad.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
        beamGrad.addColorStop(0.3, `rgba(255, 248, 230, ${intensity * 0.7})`);
        beamGrad.addColorStop(1, "rgba(246, 231, 216, 0)");
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.arc(currentX, currentY, beamSize, 0, Math.PI * 2);
        ctx.fill();

        // Text fading and shrinking
        const textAlpha = 1 - progress;
        if (textAlpha > 0) {
          ctx.save();
          const scale = 1 - progress * 0.5;
          ctx.font = `bold ${fontSize * scale}px Pretendard, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = `rgba(255, 248, 230, ${textAlpha})`;
          ctx.shadowColor = `rgba(246, 231, 216, ${textAlpha})`;
          ctx.shadowBlur = 15 * dpr;
          ctx.fillText(text, currentX, currentY - 25 * dpr);
          ctx.restore();
        }

        // Emit sparks while rising
        if (Math.random() > 0.3) {
          particles.push({
            x: currentX + (Math.random() - 0.5) * 20 * dpr,
            y: currentY,
            vx: (Math.random() - 0.5) * 2 * dpr,
            vy: (1 + Math.random() * 2) * dpr,
            r: (1 + Math.random() * 1.5) * dpr,
            color: FIREWORK_COLORS[Math.floor(Math.random() * 3)],
            alpha: 1,
            decay: 0.03,
            life: 1,
            gravity: 0.02 * dpr,
            trail: [],
          });
        }
      }

      // Draw & update particles (phases 1-4)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Update trail
        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
        if (p.trail.length > 8) p.trail.shift();

        // Draw trail
        for (let j = 0; j < p.trail.length; j++) {
          const t = p.trail[j];
          const trailAlpha = (j / p.trail.length) * t.alpha * 0.3;
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.r * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(")", `, ${trailAlpha})`).replace("rgb", "rgba");
          // Handle hex colors
          const rgba = hexToRgba(p.color, trailAlpha);
          ctx.fillStyle = rgba;
          ctx.fill();
        }

        // Draw particle
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
        pGrad.addColorStop(0, hexToRgba(p.color, p.alpha));
        pGrad.addColorStop(0.5, hexToRgba(p.color, p.alpha * 0.5));
        pGrad.addColorStop(1, hexToRgba(p.color, 0));
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba("#FFFFFF", p.alpha * 0.8);
        ctx.fill();

        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.alpha -= p.decay;
        p.life -= p.decay;

        if (p.alpha <= 0 || p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Draw sparkles (phases 3-4)
      if (phase >= 3) {
        for (let i = sparkles.length - 1; i >= 0; i--) {
          const s = sparkles[i];
          const twinkle = 0.5 + 0.5 * Math.sin(elapsed * s.twinkleSpeed + s.twinklePhase);
          const finalAlpha = s.alpha * twinkle;

          const sGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
          sGrad.addColorStop(0, hexToRgba(s.color, finalAlpha));
          sGrad.addColorStop(0.5, hexToRgba(s.color, finalAlpha * 0.3));
          sGrad.addColorStop(1, hexToRgba(s.color, 0));
          ctx.fillStyle = sGrad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();

          // Star shape for bigger sparkles
          if (s.r > 1.5 * dpr) {
            ctx.save();
            ctx.translate(s.x, s.y);
            ctx.rotate(elapsed * 0.5 + s.twinklePhase);
            ctx.fillStyle = hexToRgba("#FFFFFF", finalAlpha * 0.6);
            ctx.fillRect(-s.r * 2, -0.5, s.r * 4, 1);
            ctx.fillRect(-0.5, -s.r * 2, 1, s.r * 4);
            ctx.restore();
          }

          s.alpha -= s.decay;
          if (s.alpha <= 0) sparkles.splice(i, 1);
        }
      }

      // Phase 4: Fade out
      if (phase === 4) {
        const fadeProgress = Math.min(1, (elapsed - phaseTime) / 2);
        globalAlpha = 1 - fadeProgress;
        if (fadeProgress >= 1) {
          setVisible(false);
          return;
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      const newDpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth * newDpr;
      h = canvas.offsetHeight * newDpr;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 50 }}
    />
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(255,255,255,${alpha})`;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
