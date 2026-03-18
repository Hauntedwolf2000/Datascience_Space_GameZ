"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SHIPS } from "../data/ships";
import type { ShipDef } from "../data/ships";

// ─────────────────────────────────────────────────────────────
// Radar canvas
// ─────────────────────────────────────────────────────────────
function RadarDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const S = 180;
    canvas.width = S;
    canvas.height = S;
    const cx = S / 2,
      cy = S / 2,
      r = S / 2 - 8;
    const blips = Array.from({ length: 6 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: (0.3 + Math.random() * 0.6) * r,
      lit: 0,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      ctx.fillStyle = "#000a05";
      ctx.beginPath();
      ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
      ctx.fill();
      [0.33, 0.66, 1].forEach((f) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * f, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,255,136,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      ctx.strokeStyle = "rgba(0,255,136,0.09)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRef.current);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, -0.5, 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(0,255,136,0.13)";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r, 0);
      ctx.strokeStyle = "rgba(0,255,136,0.75)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      blips.forEach((b) => {
        const bx = cx + Math.cos(b.angle) * b.dist;
        const by = cy + Math.sin(b.angle) * b.dist;
        const diff =
          (((angleRef.current - b.angle) % (Math.PI * 2)) + Math.PI * 2) %
          (Math.PI * 2);
        if (diff < 0.15) b.lit = 1;
        b.lit = Math.max(0, b.lit - 0.013);
        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,136,${b.lit * 0.9})`;
        ctx.shadowColor = "#00ff88";
        ctx.shadowBlur = 7 * b.lit;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,136,0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,255,136,0.9)";
      ctx.shadowColor = "#00ff88";
      ctx.shadowBlur = 7;
      ctx.fill();
      ctx.shadowBlur = 0;
      angleRef.current = (angleRef.current + 0.025) % (Math.PI * 2);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} style={{ width: 180, height: 180 }} />;
}

// ─────────────────────────────────────────────────────────────
// Starfield
// ─────────────────────────────────────────────────────────────
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.1 + 0.1,
      spd: Math.random() * 0.12 + 0.02,
      a: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.fillStyle = "#000a05";
      ctx.fillRect(0, 0, c.width, c.height);
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,255,210,${s.a})`;
        ctx.fill();
        s.y += s.spd;
        if (s.y > c.height) {
          s.y = 0;
          s.x = Math.random() * c.width;
        }
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Ship SVG previews for hangar
// ─────────────────────────────────────────────────────────────
function ShipSVG({ ship, size = 60 }: { ship: ShipDef; size?: number }) {
  const c = ship.color;
  const a = ship.accentColor;
  const bg = c + "18";

  const shapes: Record<string, JSX.Element> = {
    corvette: (
      <>
        <path
          d="M32 4 L46 20 L48 38 L40 46 L24 46 L16 38 L18 20 Z"
          fill={bg}
          stroke={c}
          strokeWidth="1.5"
        />
        <rect
          x="30"
          y="2"
          width="4"
          height="16"
          rx="2"
          fill="#001a08"
          stroke={c}
          strokeWidth="1.2"
        />
        <circle cx="32" cy="2" r="2.5" fill={a} />
        <rect
          x="26"
          y="16"
          width="12"
          height="10"
          rx="2"
          fill="#001a08"
          stroke={c}
          strokeWidth="1"
        />
        <rect
          x="28"
          y="18"
          width="3"
          height="3"
          rx="0.5"
          fill="#00eeff"
          opacity="0.9"
        />
        <rect
          x="33"
          y="18"
          width="3"
          height="3"
          rx="0.5"
          fill="#00eeff"
          opacity="0.9"
        />
        <circle
          cx="24"
          cy="44"
          r="2"
          fill="#001008"
          stroke={c}
          strokeWidth="0.8"
        />
        <circle
          cx="32"
          cy="46"
          r="2"
          fill="#001008"
          stroke={c}
          strokeWidth="0.8"
        />
        <circle
          cx="40"
          cy="44"
          r="2"
          fill="#001008"
          stroke={c}
          strokeWidth="0.8"
        />
      </>
    ),
    destroyer: (
      <>
        <path
          d="M36 3 L58 16 L62 34 L52 46 L20 46 L10 34 L14 16 Z"
          fill={bg}
          stroke={c}
          strokeWidth="1.5"
        />
        <rect
          x="28"
          y="2"
          width="4"
          height="15"
          rx="1.5"
          fill="#001520"
          stroke={c}
          strokeWidth="1.2"
        />
        <rect
          x="40"
          y="2"
          width="4"
          height="15"
          rx="1.5"
          fill="#001520"
          stroke={c}
          strokeWidth="1.2"
        />
        <circle cx="30" cy="2" r="2.2" fill={a} />{" "}
        <circle cx="42" cy="2" r="2.2" fill={a} />
        <rect
          x="26"
          y="14"
          width="20"
          height="14"
          rx="2"
          fill="#001525"
          stroke={c}
          strokeWidth="1"
        />
        <rect
          x="29"
          y="17"
          width="4"
          height="4"
          rx="1"
          fill="#00eeff"
          opacity="0.9"
        />
        <rect
          x="35"
          y="17"
          width="4"
          height="4"
          rx="1"
          fill="#00eeff"
          opacity="0.9"
        />
        <circle
          cx="22"
          cy="44"
          r="2.5"
          fill="#001020"
          stroke={c}
          strokeWidth="0.9"
        />
        <circle
          cx="36"
          cy="46"
          r="2.5"
          fill="#001020"
          stroke={c}
          strokeWidth="0.9"
        />
        <circle
          cx="50"
          cy="44"
          r="2.5"
          fill="#001020"
          stroke={c}
          strokeWidth="0.9"
        />
      </>
    ),
    cruiser: (
      <>
        <path
          d="M38 2 L64 14 L68 34 L60 48 L16 48 L8 34 L12 14 Z"
          fill={bg}
          stroke={c}
          strokeWidth="1.8"
        />
        <rect
          x="28"
          y="1"
          width="4"
          height="14"
          rx="1.5"
          fill="#100020"
          stroke={c}
          strokeWidth="1.2"
        />
        <rect
          x="34"
          y="1"
          width="4"
          height="14"
          rx="1.5"
          fill="#100020"
          stroke={c}
          strokeWidth="1.2"
        />
        <rect
          x="40"
          y="1"
          width="4"
          height="14"
          rx="1.5"
          fill="#100020"
          stroke={c}
          strokeWidth="1.2"
        />
        <circle cx="30" cy="1" r="2" fill={a} />{" "}
        <circle cx="36" cy="1" r="2" fill={a} />{" "}
        <circle cx="42" cy="1" r="2" fill={a} />
        <rect
          x="24"
          y="12"
          width="28"
          height="18"
          rx="3"
          fill="#100025"
          stroke={c}
          strokeWidth="1.2"
        />
        <rect
          x="28"
          y="16"
          width="5"
          height="5"
          rx="1"
          fill="#00eeff"
          opacity="0.9"
        />
        <rect
          x="35"
          y="16"
          width="5"
          height="5"
          rx="1"
          fill="#00eeff"
          opacity="0.9"
        />
        <rect
          x="42"
          y="16"
          width="5"
          height="5"
          rx="1"
          fill="#00eeff"
          opacity="0.9"
        />
        <circle
          cx="20"
          cy="46"
          r="3"
          fill="#100020"
          stroke={c}
          strokeWidth="1"
        />
        <circle
          cx="30"
          cy="48"
          r="3"
          fill="#100020"
          stroke={c}
          strokeWidth="1"
        />
        <circle
          cx="46"
          cy="48"
          r="3"
          fill="#100020"
          stroke={c}
          strokeWidth="1"
        />
        <circle
          cx="56"
          cy="46"
          r="3"
          fill="#100020"
          stroke={c}
          strokeWidth="1"
        />
      </>
    ),
    battleship: (
      <>
        <path
          d="M40 1 L68 13 L74 33 L66 50 L14 50 L6 33 L12 13 Z"
          fill={bg}
          stroke={c}
          strokeWidth="2"
        />
        <rect
          x="27"
          y="0"
          width="5"
          height="14"
          rx="2"
          fill="#180a00"
          stroke={c}
          strokeWidth="1.3"
        />
        <rect
          x="34"
          y="0"
          width="5"
          height="14"
          rx="2"
          fill="#180a00"
          stroke={c}
          strokeWidth="1.3"
        />
        <rect
          x="41"
          y="0"
          width="5"
          height="14"
          rx="2"
          fill="#180a00"
          stroke={c}
          strokeWidth="1.3"
        />
        <rect
          x="48"
          y="0"
          width="5"
          height="14"
          rx="2"
          fill="#180a00"
          stroke={c}
          strokeWidth="1.3"
        />
        <circle cx="29.5" cy="0" r="2.5" fill={a} />{" "}
        <circle cx="36.5" cy="0" r="2.5" fill={a} />
        <circle cx="43.5" cy="0" r="2.5" fill={a} />{" "}
        <circle cx="50.5" cy="0" r="2.5" fill={a} />
        <rect
          x="26"
          y="12"
          width="28"
          height="20"
          rx="3"
          fill="#180a00"
          stroke={c}
          strokeWidth="1.3"
        />
        <rect
          x="30"
          y="16"
          width="5"
          height="5"
          rx="1"
          fill="#00eeff"
          opacity="0.9"
        />
        <rect
          x="37"
          y="16"
          width="5"
          height="5"
          rx="1"
          fill="#00eeff"
          opacity="0.9"
        />
        <rect
          x="44"
          y="16"
          width="5"
          height="5"
          rx="1"
          fill="#00eeff"
          opacity="0.9"
        />
        <circle
          cx="16"
          cy="48"
          r="3.5"
          fill="#180a00"
          stroke={c}
          strokeWidth="1"
        />
        <circle
          cx="27"
          cy="50"
          r="3.5"
          fill="#180a00"
          stroke={c}
          strokeWidth="1"
        />
        <circle
          cx="40"
          cy="51"
          r="3.5"
          fill="#180a00"
          stroke={c}
          strokeWidth="1"
        />
        <circle
          cx="53"
          cy="50"
          r="3.5"
          fill="#180a00"
          stroke={c}
          strokeWidth="1"
        />
        <circle
          cx="64"
          cy="48"
          r="3.5"
          fill="#180a00"
          stroke={c}
          strokeWidth="1"
        />
      </>
    ),
    phantom: (
      <>
        <path
          d="M36 3 L54 18 L62 34 L46 42 L26 42 L10 34 L18 18 Z"
          fill={bg}
          stroke={c}
          strokeWidth="1.2"
          strokeDasharray="5 2.5"
        />
        <rect
          x="34"
          y="1"
          width="4"
          height="18"
          rx="2"
          fill="#0a0015"
          stroke={c}
          strokeWidth="1.2"
        />
        <circle cx="36" cy="1" r="2.8" fill={a} />
        <rect
          x="28"
          y="14"
          width="16"
          height="13"
          rx="2"
          fill="#100020"
          stroke={c}
          strokeWidth="0.9"
        />
        <rect
          x="30"
          y="17"
          width="5"
          height="5"
          rx="1"
          fill={a}
          opacity="0.95"
        />
        <rect
          x="37"
          y="17"
          width="5"
          height="5"
          rx="1"
          fill={a}
          opacity="0.95"
        />
        <path
          d="M18 24 L4 38 L20 34 Z"
          fill={bg}
          stroke={c}
          strokeWidth="0.8"
          opacity="0.7"
        />
        <path
          d="M54 24 L68 38 L52 34 Z"
          fill={bg}
          stroke={c}
          strokeWidth="0.8"
          opacity="0.7"
        />
        <circle
          cx="26"
          cy="41"
          r="2"
          fill="#0a0015"
          stroke={c}
          strokeWidth="0.8"
        />
        <circle
          cx="36"
          cy="43"
          r="2"
          fill="#0a0015"
          stroke={c}
          strokeWidth="0.8"
        />
        <circle
          cx="46"
          cy="41"
          r="2"
          fill="#0a0015"
          stroke={c}
          strokeWidth="0.8"
        />
        <ellipse
          cx="36"
          cy="22"
          rx="10"
          ry="8"
          fill="none"
          stroke={c}
          strokeWidth="0.5"
          opacity="0.25"
        />
      </>
    ),
  };

  const viewBoxes: Record<string, string> = {
    corvette: "0 0 64 56",
    destroyer: "0 0 72 56",
    cruiser: "0 0 76 58",
    battleship: "0 0 80 60",
    phantom: "0 0 72 52",
  };

  return (
    <svg
      viewBox={viewBoxes[ship.id] ?? "0 0 64 56"}
      width={size}
      height={size}
      fill="none"
    >
      {shapes[ship.id] ?? shapes["corvette"]}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat bar
// ─────────────────────────────────────────────────────────────
function StatBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: "0.6rem",
      }}
    >
      <span style={{ color: "var(--green-dim)", width: 64, flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 9,
              borderRadius: 1,
              background: i < value ? color : "rgba(255,255,255,0.07)",
              boxShadow: i < value ? `0 0 4px ${color}88` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Landing page
// ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [booting, setBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [coins, setCoins] = useState(0);
  const [selectedId, setSelectedId] = useState("corvette");
  const [tab, setTab] = useState<"home" | "hangar">("home");

  const BOOT = [
    "INITIALISING COMBAT SYSTEM v4.2...",
    "LOADING THREAT DATABASE............OK",
    "CALIBRATING ASTEROID SENSORS.......OK",
    "WEAPON SYSTEMS ONLINE..............OK",
    "DATA SCIENCE MODULE LOADED.........OK",
    "WARSHIP AI READY. COMMANDER AWAITED.",
  ];

  useEffect(() => {
    const c = parseInt(localStorage.getItem("ds_coins") ?? "0", 10);
    const s = localStorage.getItem("ds_selected_ship") ?? "corvette";
    setCoins(isNaN(c) ? 0 : c);
    setSelectedId(s);
  }, []);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT.length) {
        setBootLines((p) => [...p, BOOT[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => setBooting(false), 400);
      }
    }, 230);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectShip = (ship: ShipDef) => {
    if (ship.cost > coins) return;
    setSelectedId(ship.id);
    localStorage.setItem("ds_selected_ship", ship.id);
  };

  const addCoins = (n: number) => {
    const next = coins + n;
    setCoins(next);
    localStorage.setItem("ds_coins", String(next));
  };

  const deploy = () => {
    localStorage.setItem("ds_selected_ship", selectedId);
    router.push("/game");
  };

  const selectedShip = SHIPS.find((s) => s.id === selectedId) ?? SHIPS[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        fontFamily: "var(--font-mono)",
        position: "relative",
        paddingBottom: 32,
      }}
    >
      <Starfield />

      {/* Boot overlay */}
      <AnimatePresence>
        {booting && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "0 10vw",
              background: "rgba(0,10,5,0.97)",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  color: "var(--green-mid)",
                  fontSize: "0.75rem",
                  marginBottom: 4,
                }}
              >
                {">"} {line}
              </motion.div>
            ))}
            <motion.span
              style={{
                color: "var(--green-hi)",
                fontSize: "0.75rem",
                marginTop: 4,
              }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              _
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {!booting && (
        <div style={{ position: "relative", zIndex: 10 }}>
          {/* Sticky header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px",
              background: "rgba(0,10,5,0.92)",
              borderBottom: "1px solid rgba(0,255,136,0.12)",
              position: "sticky",
              top: 0,
              zIndex: 20,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                color: "var(--green-hi)",
                letterSpacing: "0.1em",
              }}
              className="glow-green flicker"
            >
              ⚓ GDC
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.55rem",
                color: "var(--green-dim)",
                letterSpacing: "0.1em",
              }}
            >
              DATA SCIENCE WARSHIP DEFENDER
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(255,220,0,0.08)",
                border: "1px solid rgba(255,220,0,0.3)",
                borderRadius: 4,
                padding: "3px 9px",
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                color: "#ffdd44",
              }}
            >
              🪙 {coins}
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              background: "rgba(0,10,5,0.85)",
              borderBottom: "1px solid rgba(0,255,136,0.1)",
            }}
          >
            {(["home", "hangar"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  fontFamily: "var(--font-display)",
                  cursor: "pointer",
                  border: "none",
                  background:
                    tab === t ? "rgba(0,255,136,0.07)" : "transparent",
                  color: tab === t ? "var(--green-hi)" : "var(--green-dim)",
                  borderBottom:
                    tab === t
                      ? "2px solid var(--green-hi)"
                      : "2px solid transparent",
                  textShadow: tab === t ? "0 0 8px var(--green-hi)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {t === "home" ? "▸ MISSION BRIEF" : "⚓ SHIP HANGAR"}
              </button>
            ))}
          </div>

          {/* ── HOME TAB ── */}
          {tab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 16px",
                gap: 18,
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              <div style={{ textAlign: "center", width: "100%" }}>
                <div
                  style={{
                    color: "var(--green-dim)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.28em",
                    marginBottom: 8,
                  }}
                  className="flicker"
                >
                  ◈ CLASSIFIED — TOP SECRET ◈
                </div>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--green-hi)",
                    fontSize: "clamp(1.5rem, 7vw, 2rem)",
                    fontWeight: 900,
                    lineHeight: 1.15,
                  }}
                  className="glow-green flicker"
                >
                  DATA SCIENCE
                  <br />
                  <span
                    style={{
                      color: "var(--cyan-hi)",
                      textShadow: "0 0 14px var(--cyan-hi)",
                    }}
                  >
                    WARSHIP
                  </span>
                  <br />
                  DEFENDER
                </h1>
              </div>

              {/* Radar with ship overlay */}
              <div
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="panel"
                  style={{ borderRadius: "50%", padding: 6 }}
                >
                  <RadarDisplay />
                </div>
                <motion.div
                  style={{
                    position: "absolute",
                    filter: `drop-shadow(0 0 10px ${selectedShip.color}88)`,
                  }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ShipSVG ship={selectedShip} size={52} />
                </motion.div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  fontSize: "0.62rem",
                  color: selectedShip.color,
                  textShadow: `0 0 8px ${selectedShip.color}`,
                }}
              >
                ◈ ACTIVE: {selectedShip.name} — {selectedShip.class} ◈
              </div>

              <div
                className="panel corner-decor"
                style={{
                  width: "100%",
                  borderRadius: 8,
                  padding: "12px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                  textAlign: "center",
                }}
              >
                {[
                  { val: "250", label: "QUESTIONS", color: "var(--green-hi)" },
                  { val: "5", label: "LEVELS", color: "var(--amber)" },
                  { val: "3", label: "HULL PTS", color: "var(--red-hi)" },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        color: s.color,
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontSize: "0.52rem",
                        color: "var(--green-dim)",
                        marginTop: 2,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="panel"
                style={{
                  width: "100%",
                  borderRadius: 8,
                  padding: "12px 14px",
                  fontSize: "0.72rem",
                  color: "#66cc99",
                  lineHeight: 1.85,
                }}
              >
                ▸ Answer questions → earn ammo 🔫
                <br />▸ Asteroids that <em>hit your warship</em> deal damage
                <br />▸ Missed asteroids{" "}
                <strong style={{ color: "var(--green-hi)" }}>
                  do NOT
                </strong>{" "}
                damage you
                <br />
                ▸ 3 direct hits = hull breach = GAME OVER
                <br />▸ Earn 🪙 coins: score ÷ 5 per session
              </div>

              <motion.button
                className="btn-military btn-fire"
                style={{ width: "100%", padding: "13px", fontSize: "0.85rem" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={deploy}
              >
                ⚓ DEPLOY {selectedShip.name}
              </motion.button>

              <button
                className="btn-military"
                style={{ width: "100%", padding: "9px", fontSize: "0.65rem" }}
                onClick={() => setTab("hangar")}
              >
                ⚓ SWITCH WARSHIP
              </button>

              <div
                style={{
                  fontSize: "0.58rem",
                  color: "var(--green-dim)",
                  textAlign: "center",
                }}
              >
                SPACE to fire &nbsp;·&nbsp; Arrow keys / WASD to move
                &nbsp;·&nbsp; 900px+ screen required
              </div>
            </motion.div>
          )}

          {/* ── HANGAR TAB ── */}
          {tab === "hangar" && (
            <motion.div
              key="hangar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: "16px", maxWidth: 500, margin: "0 auto" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--green-dim)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.13em",
                  marginBottom: 12,
                }}
              >
                ▸ SELECT WARSHIP &nbsp;|&nbsp; COINS:{" "}
                <span style={{ color: "#ffdd44" }}>🪙 {coins}</span>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {SHIPS.map((ship) => {
                  const unlocked = coins >= ship.cost;
                  const isSelected = selectedId === ship.id;
                  return (
                    <motion.div
                      key={ship.id}
                      className="panel"
                      onClick={() => selectShip(ship)}
                      style={{
                        borderRadius: 8,
                        padding: "12px",
                        border: isSelected
                          ? `1px solid ${ship.color}`
                          : unlocked
                            ? "1px solid rgba(0,255,136,0.1)"
                            : "1px solid rgba(255,255,255,0.05)",
                        opacity: unlocked ? 1 : 0.48,
                        cursor: unlocked ? "pointer" : "not-allowed",
                        boxShadow: isSelected
                          ? `0 0 20px ${ship.color}33`
                          : "none",
                        transition: "all 0.2s",
                      }}
                      whileHover={unlocked ? { scale: 1.01 } : {}}
                      whileTap={unlocked ? { scale: 0.985 } : {}}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            flexShrink: 0,
                            width: 66,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingTop: 4,
                            filter: unlocked
                              ? `drop-shadow(0 0 8px ${ship.color}77)`
                              : "grayscale(1) opacity(0.35)",
                          }}
                        >
                          {unlocked ? (
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 2.1,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <ShipSVG ship={ship} size={60} />
                            </motion.div>
                          ) : (
                            <div
                              style={{
                                fontSize: "1.8rem",
                                textAlign: "center",
                              }}
                            >
                              🔒
                            </div>
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 1,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                color: isSelected
                                  ? ship.color
                                  : unlocked
                                    ? "#ccffee"
                                    : "#446655",
                                textShadow: isSelected
                                  ? `0 0 8px ${ship.color}`
                                  : "none",
                              }}
                            >
                              {ship.name}
                            </span>
                            {isSelected && (
                              <span
                                style={{
                                  fontSize: "0.52rem",
                                  color: ship.color,
                                  background: `${ship.color}18`,
                                  border: `1px solid ${ship.color}44`,
                                  borderRadius: 3,
                                  padding: "1px 5px",
                                  flexShrink: 0,
                                }}
                              >
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "0.57rem",
                              color: "var(--green-dim)",
                              letterSpacing: "0.1em",
                              marginBottom: 4,
                            }}
                          >
                            {ship.class}
                          </div>
                          <div
                            style={{
                              fontSize: "0.63rem",
                              color: "#88bbaa",
                              lineHeight: 1.4,
                              marginBottom: 6,
                            }}
                          >
                            {ship.description}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 3,
                            }}
                          >
                            <StatBar
                              label="SPEED"
                              value={ship.speed}
                              color={ship.accentColor}
                            />
                            <StatBar
                              label="FIREPOWER"
                              value={ship.firepower}
                              color={ship.color}
                            />
                            <StatBar
                              label="ARMOR"
                              value={ship.armor}
                              color="#ff3344"
                            />
                          </div>
                          {!unlocked && (
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: "0.6rem",
                                color: "var(--amber)",
                                display: "flex",
                                gap: 4,
                                flexWrap: "wrap",
                              }}
                            >
                              🔒 REQUIRES 🪙 {ship.cost}
                              <span style={{ color: "var(--green-dim)" }}>
                                ({Math.max(0, ship.cost - coins)} more needed)
                              </span>
                            </div>
                          )}
                          {unlocked && !isSelected && (
                            <button
                              className="btn-military"
                              style={{
                                marginTop: 7,
                                padding: "3px 11px",
                                fontSize: "0.58rem",
                                borderColor: ship.color,
                                color: ship.color,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectShip(ship);
                              }}
                            >
                              SELECT
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                className="btn-military btn-fire"
                style={{
                  width: "100%",
                  padding: "13px",
                  fontSize: "0.82rem",
                  marginTop: 14,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={deploy}
              >
                ⚓ DEPLOY {selectedShip.name}
              </motion.button>

              <button
                className="btn-military"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: 8,
                  fontSize: "0.58rem",
                  opacity: 0.35,
                }}
                onClick={() => addCoins(50)}
              >
                [DEV] +50 COINS FOR TESTING
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
