"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// ══════════════════════════════════════════════════════════════
// WARSHIP CATALOGUE
// Coins stored in localStorage as "ds_coins"
// Earned: score ÷ 5 per game session (saved in game page on gameover)
// ══════════════════════════════════════════════════════════════
export interface ShipDef {
  id: string;
  name: string;
  class: string;
  cost: number;
  description: string;
  color: string;
  accentColor: string;
  speed: number;      // 1-10
  firepower: number;
  armor: number;
}

export const SHIPS: ShipDef[] = [
  { id: "corvette",   name: "CSS CORVETTE",    class: "SCOUT CLASS",    cost: 0,   description: "Fast and nimble. Standard-issue vessel for new recruits.",       color: "#00cc66", accentColor: "#00eeff", speed: 8,  firepower: 5,  armor: 3 },
  { id: "destroyer",  name: "DSS DESTROYER",   class: "ASSAULT CLASS",  cost: 50,  description: "Reinforced hull. Preferred by veteran data scientists.",          color: "#00aaff", accentColor: "#4488ff", speed: 6,  firepower: 7,  armor: 6 },
  { id: "cruiser",    name: "MLS CRUISER",     class: "HEAVY CLASS",    cost: 150, description: "Built for sustained combat. Dual-barrel ML cannon array.",        color: "#cc44ff", accentColor: "#ff44cc", speed: 4,  firepower: 9,  armor: 8 },
  { id: "battleship", name: "NNS BATTLESHIP",  class: "DREADNOUGHT",    cost: 300, description: "Neural-net powered. The pinnacle of galactic firepower.",         color: "#ffaa00", accentColor: "#ff6600", speed: 2,  firepower: 10, armor: 9 },
  { id: "phantom",    name: "AI PHANTOM",      class: "STEALTH CLASS",  cost: 500, description: "Classified vessel. Equipped with generative AI cloaking tech.",   color: "#ff3366", accentColor: "#ff99cc", speed: 9,  firepower: 8,  armor: 4 },
];

// ── Warship SVG renderer ──────────────────────────────────────
function ShipSVG({ ship, size = 80 }: { ship: ShipDef; size?: number }) {
  const c = ship.color;
  const a = ship.accentColor;

  const bodies: Record<string, JSX.Element> = {
    corvette: (
      <>
        <path d="M32 4 L50 20 L54 36 L44 44 L20 44 L10 36 L14 20 Z" fill="#001a0d" stroke={c} strokeWidth="1.5"/>
        <rect x="26" y="14" width="12" height="12" rx="2" fill="#002a10" stroke={c} strokeWidth="1"/>
        <rect x="30" y="4" width="4" height="12" rx="2" fill="#003a15" stroke={c} strokeWidth="1"/>
        <circle cx="32" cy="4" r="2.2" fill={a} opacity="0.95"/>
        <rect x="27.5" y="17" width="3.5" height="3.5" rx="0.5" fill={a} opacity="0.85"/>
        <rect x="33" y="17" width="3.5" height="3.5" rx="0.5" fill={a} opacity="0.85"/>
        <line x1="14" y1="38" x2="50" y2="38" stroke={c} strokeWidth="0.7" opacity="0.5"/>
        <circle cx="22" cy="43" r="2" fill="#001a0d" stroke={c} strokeWidth="0.8"/>
        <circle cx="32" cy="45" r="2" fill="#001a0d" stroke={c} strokeWidth="0.8"/>
        <circle cx="42" cy="43" r="2" fill="#001a0d" stroke={c} strokeWidth="0.8"/>
      </>
    ),
    destroyer: (
      <>
        <path d="M32 2 L56 16 L60 34 L50 46 L14 46 L4 34 L8 16 Z" fill="#001020" stroke={c} strokeWidth="1.5"/>
        <rect x="24" y="12" width="16" height="16" rx="2" fill="#001530" stroke={c} strokeWidth="1"/>
        <rect x="28" y="2" width="4" height="12" rx="1.5" fill="#001a3a" stroke={c} strokeWidth="1"/>
        <rect x="36" y="5" width="3" height="9" rx="1" fill="#001a3a" stroke={c} strokeWidth="0.8"/>
        <circle cx="30" cy="2" r="2.2" fill={a} opacity="0.95"/>
        <circle cx="37.5" cy="5" r="1.5" fill={a} opacity="0.7"/>
        <rect x="28" y="15" width="3.5" height="3.5" rx="0.5" fill={a} opacity="0.85"/>
        <rect x="32.5" y="15" width="3.5" height="3.5" rx="0.5" fill={a} opacity="0.85"/>
        <path d="M12 38 L20 24" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
        <path d="M52 38 L44 24" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
        <circle cx="20" cy="45" r="2.5" fill="#001020" stroke={c} strokeWidth="0.8"/>
        <circle cx="32" cy="47" r="2.5" fill="#001020" stroke={c} strokeWidth="0.8"/>
        <circle cx="44" cy="45" r="2.5" fill="#001020" stroke={c} strokeWidth="0.8"/>
      </>
    ),
    cruiser: (
      <>
        <path d="M32 2 L58 14 L62 32 L56 46 L8 46 L2 32 L6 14 Z" fill="#0a0015" stroke={c} strokeWidth="1.5"/>
        <rect x="22" y="10" width="20" height="18" rx="3" fill="#150025" stroke={c} strokeWidth="1"/>
        <rect x="27" y="2" width="4" height="11" rx="1.5" fill="#1a0030" stroke={c} strokeWidth="1"/>
        <rect x="33" y="2" width="4" height="11" rx="1.5" fill="#1a0030" stroke={c} strokeWidth="1"/>
        <circle cx="29" cy="2" r="2.2" fill={a} opacity="0.95"/>
        <circle cx="35" cy="2" r="2.2" fill={a} opacity="0.95"/>
        <rect x="26" y="14" width="4" height="4" rx="1" fill={a} opacity="0.85"/>
        <rect x="32" y="14" width="4" height="4" rx="1" fill={a} opacity="0.85"/>
        <path d="M6 30 L14 18" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M58 30 L50 18" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="6" cy="30" r="2.5" fill={a} opacity="0.6"/>
        <circle cx="58" cy="30" r="2.5" fill={a} opacity="0.6"/>
        <circle cx="20" cy="45" r="2.5" fill="#0a0015" stroke={c} strokeWidth="0.8"/>
        <circle cx="32" cy="47" r="2.5" fill="#0a0015" stroke={c} strokeWidth="0.8"/>
        <circle cx="44" cy="45" r="2.5" fill="#0a0015" stroke={c} strokeWidth="0.8"/>
      </>
    ),
    battleship: (
      <>
        <path d="M32 1 L60 12 L66 30 L60 46 L4 46 L-2 30 L4 12 Z" fill="#100800" stroke={c} strokeWidth="1.5"/>
        <rect x="20" y="8" width="24" height="20" rx="3" fill="#1a1000" stroke={c} strokeWidth="1.2"/>
        <rect x="27" y="1" width="5" height="11" rx="2" fill="#200e00" stroke={c} strokeWidth="1.2"/>
        <rect x="32" y="1" width="5" height="11" rx="2" fill="#200e00" stroke={c} strokeWidth="1.2"/>
        <circle cx="29.5" cy="1" r="2.5" fill={a} opacity="0.95"/>
        <circle cx="34.5" cy="1" r="2.5" fill={a} opacity="0.95"/>
        <rect x="24" y="12" width="5" height="5" rx="1" fill={a} opacity="0.85"/>
        <rect x="31" y="12" width="5" height="5" rx="1" fill={a} opacity="0.85"/>
        <path d="M2 28 L12 14" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <path d="M62 28 L52 14" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="2" cy="28" r="3" fill={a} opacity="0.7"/>
        <circle cx="62" cy="28" r="3" fill={a} opacity="0.7"/>
        <path d="M2 35 L8 26" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <path d="M62 35 L56 26" stroke={c} strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <circle cx="16" cy="45" r="3" fill="#100800" stroke={c} strokeWidth="1"/>
        <circle cx="32" cy="47" r="3" fill="#100800" stroke={c} strokeWidth="1"/>
        <circle cx="48" cy="45" r="3" fill="#100800" stroke={c} strokeWidth="1"/>
      </>
    ),
    phantom: (
      <>
        <path d="M32 3 L54 18 L58 34 L44 42 L20 42 L6 34 L10 18 Z" fill="#0a0010" stroke={c} strokeWidth="1.2" strokeDasharray="4 2"/>
        <rect x="24" y="12" width="16" height="14" rx="2" fill="#150020" stroke={a} strokeWidth="0.8" opacity="0.7"/>
        <rect x="29" y="3" width="6" height="12" rx="2" fill="#1a0028" stroke={c} strokeWidth="1"/>
        <circle cx="32" cy="3" r="2.5" fill={a}/>
        <rect x="27" y="16" width="4" height="4" rx="1" fill={a} opacity="0.95"/>
        <rect x="33" y="16" width="4" height="4" rx="1" fill={a} opacity="0.95"/>
        <path d="M10 28 L2 38 L14 34 Z" fill={c} opacity="0.35" stroke={c} strokeWidth="0.5"/>
        <path d="M54 28 L62 38 L50 34 Z" fill={c} opacity="0.35" stroke={c} strokeWidth="0.5"/>
        <line x1="18" y1="36" x2="46" y2="36" stroke={a} strokeWidth="0.5" opacity="0.35"/>
        <circle cx="20" cy="41" r="2" fill="#0a0010" stroke={a} strokeWidth="0.8"/>
        <circle cx="32" cy="43" r="2" fill="#0a0010" stroke={a} strokeWidth="0.8"/>
        <circle cx="44" cy="41" r="2" fill="#0a0010" stroke={a} strokeWidth="0.8"/>
      </>
    ),
  };

  return (
    <svg viewBox="-4 0 72 52" width={size} height={Math.round(size * 52 / 68)} fill="none" xmlns="http://www.w3.org/2000/svg">
      {bodies[ship.id] ?? bodies["corvette"]}
    </svg>
  );
}

// ── Stat bars ─────────────────────────────────────────────────
function StatBar({ label, value, max = 10, color }: { label: string; value: number; max?: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.6rem" }}>
      <span style={{ color: "var(--green-dim)", width: 64, letterSpacing: "0.06em", flexShrink: 0 }}>{label}</span>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} style={{
            width: 8, height: 9, borderRadius: 1,
            background: i < value ? color : "rgba(255,255,255,0.07)",
            boxShadow: i < value ? `0 0 4px ${color}88` : "none",
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Compact Radar ─────────────────────────────────────────────
function RadarDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const angleRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const S = 180; canvas.width = S; canvas.height = S;
    const cx = S / 2, cy = S / 2, r = S / 2 - 8;
    const blips = Array.from({ length: 6 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: (0.3 + Math.random() * 0.6) * r, lit: 0,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      ctx.fillStyle = "#000a05"; ctx.beginPath(); ctx.arc(cx, cy, r + 8, 0, Math.PI * 2); ctx.fill();
      [0.33, 0.66, 1].forEach(f => {
        ctx.beginPath(); ctx.arc(cx, cy, r * f, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,255,136,0.12)"; ctx.lineWidth = 1; ctx.stroke();
      });
      ctx.strokeStyle = "rgba(0,255,136,0.09)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy); ctx.stroke();
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angleRef.current);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, -0.5, 0); ctx.closePath();
      ctx.fillStyle = "rgba(0,255,136,0.13)"; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r, 0);
      ctx.strokeStyle = "rgba(0,255,136,0.75)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
      blips.forEach(b => {
        const bx = cx + Math.cos(b.angle) * b.dist;
        const by = cy + Math.sin(b.angle) * b.dist;
        const diff = ((angleRef.current - b.angle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.15) b.lit = 1;
        b.lit = Math.max(0, b.lit - 0.013);
        ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,136,${b.lit * 0.9})`;
        ctx.shadowColor = "#00ff88"; ctx.shadowBlur = 7 * b.lit; ctx.fill(); ctx.shadowBlur = 0;
      });
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,136,0.4)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,255,136,0.9)"; ctx.shadowColor = "#00ff88"; ctx.shadowBlur = 7; ctx.fill(); ctx.shadowBlur = 0;
      angleRef.current = (angleRef.current + 0.025) % (Math.PI * 2);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return <canvas ref={canvasRef} style={{ width: 180, height: 180 }} />;
}

// ── Starfield ─────────────────────────────────────────────────
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.1 + 0.1, spd: Math.random() * 0.12 + 0.02, a: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.fillStyle = "#000a05"; ctx.fillRect(0, 0, c.width, c.height);
      stars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,255,210,${s.a})`; ctx.fill();
        s.y += s.spd; if (s.y > c.height) { s.y = 0; s.x = Math.random() * c.width; }
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════
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

  // Load persisted data
  useEffect(() => {
    const c = parseInt(localStorage.getItem("ds_coins") ?? "0", 10);
    const s = localStorage.getItem("ds_selected_ship") ?? "corvette";
    setCoins(isNaN(c) ? 0 : c);
    setSelectedId(s);
  }, []);

  // Boot sequence
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT.length) { setBootLines(p => [...p, BOOT[i]]); i++; }
      else { clearInterval(iv); setTimeout(() => setBooting(false), 500); }
    }, 240);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectShip = (ship: ShipDef) => {
    if (ship.cost > coins) return;
    setSelectedId(ship.id);
    localStorage.setItem("ds_selected_ship", ship.id);
  };

  const selectedShip = SHIPS.find(s => s.id === selectedId) ?? SHIPS[0];

  const deploy = () => {
    localStorage.setItem("ds_selected_ship", selectedId);
    router.push("/game");
  };

  const addCoins = (n: number) => {
    const next = coins + n;
    setCoins(next);
    localStorage.setItem("ds_coins", String(next));
  };

  return (
    /* KEY FIX: min-h-screen + overflow-y:auto = fully scrollable */
    <div style={{
      minHeight: "100vh",
      overflowY: "auto",
      overflowX: "hidden",
      fontFamily: "var(--font-mono)",
      position: "relative",
      paddingBottom: 32,
    }}>
      <Starfield />

      {/* Boot overlay */}
      <AnimatePresence>
        {booting && (
          <motion.div
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              display: "flex", flexDirection: "column", justifyContent: "center",
              alignItems: "flex-start", padding: "0 10vw",
              background: "rgba(0,10,5,0.97)",
            }}
            exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          >
            {bootLines.map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                style={{ color: "var(--green-mid)", fontSize: "0.75rem", marginBottom: 4 }}>
                {">"} {line}
              </motion.div>
            ))}
            <motion.span style={{ color: "var(--green-hi)", fontSize: "0.75rem", marginTop: 4 }}
              animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>_</motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {!booting && (
        <div style={{ position: "relative", zIndex: 10 }}>

          {/* Sticky header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px",
            background: "rgba(0,10,5,0.92)",
            borderBottom: "1px solid rgba(0,255,136,0.12)",
            position: "sticky", top: 0, zIndex: 20,
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", color: "var(--green-hi)", letterSpacing: "0.1em" }}
              className="glow-green flicker">⚓ GDC</div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "0.55rem", color: "var(--green-dim)",
              letterSpacing: "0.1em", textAlign: "center",
            }}>DATA SCIENCE WARSHIP DEFENDER</div>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "rgba(255,220,0,0.08)", border: "1px solid rgba(255,220,0,0.3)",
              borderRadius: 4, padding: "3px 9px",
              fontFamily: "var(--font-display)", fontSize: "0.65rem", color: "#ffdd44",
            }}>🪙 {coins}</div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", background: "rgba(0,10,5,0.85)", borderBottom: "1px solid rgba(0,255,136,0.1)" }}>
            {(["home", "hangar"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "10px 0", fontSize: "0.62rem", letterSpacing: "0.1em",
                fontFamily: "var(--font-display)", cursor: "pointer", border: "none",
                background: tab === t ? "rgba(0,255,136,0.07)" : "transparent",
                color: tab === t ? "var(--green-hi)" : "var(--green-dim)",
                borderBottom: tab === t ? "2px solid var(--green-hi)" : "2px solid transparent",
                textShadow: tab === t ? "0 0 8px var(--green-hi)" : "none",
                transition: "all 0.15s",
              }}>
                {t === "home" ? "▸ MISSION BRIEF" : "⚓ SHIP HANGAR"}
              </button>
            ))}
          </div>

          {/* ── HOME TAB ── */}
          {tab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px", gap: 18, maxWidth: 420, margin: "0 auto" }}
            >
              {/* Title */}
              <div style={{ textAlign: "center", width: "100%" }}>
                <div style={{ color: "var(--green-dim)", fontSize: "0.58rem", letterSpacing: "0.28em", marginBottom: 8 }} className="flicker">
                  ◈ CLASSIFIED — TOP SECRET ◈
                </div>
                <h1 style={{
                  fontFamily: "var(--font-display)", color: "var(--green-hi)",
                  fontSize: "clamp(1.5rem, 7vw, 2rem)", fontWeight: 900, letterSpacing: "0.05em", lineHeight: 1.15,
                }} className="glow-green flicker">
                  DATA SCIENCE<br />
                  <span style={{ color: "var(--cyan-hi)", textShadow: "0 0 14px var(--cyan-hi)" }}>WARSHIP</span><br />
                  DEFENDER
                </h1>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8 }}>
                  <div style={{ height: 1, flex: 1, maxWidth: 60, background: "linear-gradient(90deg,transparent,var(--green-dim))" }} />
                  <span style={{ color: "var(--green-dim)", fontSize: "0.58rem", letterSpacing: "0.1em" }}>SECTOR 7-G</span>
                  <div style={{ height: 1, flex: 1, maxWidth: 60, background: "linear-gradient(90deg,var(--green-dim),transparent)" }} />
                </div>
              </div>

              {/* Radar + hovering ship */}
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <div className="panel" style={{ borderRadius: "50%", padding: 6 }}>
                  <RadarDisplay />
                </div>
                <motion.div style={{ position: "absolute" }}
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
                  <div style={{ filter: `drop-shadow(0 0 10px ${selectedShip.color}88)` }}>
                    <ShipSVG ship={selectedShip} size={52} />
                  </div>
                </motion.div>
              </div>

              {/* Active ship */}
              <div style={{ textAlign: "center", fontSize: "0.62rem", color: selectedShip.color, textShadow: `0 0 8px ${selectedShip.color}` }}>
                ◈ ACTIVE: {selectedShip.name} — {selectedShip.class} ◈
              </div>

              {/* Mission stats */}
              <div className="panel corner-decor" style={{
                width: "100%", borderRadius: 8, padding: "12px",
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center",
              }}>
                {[
                  { val: "250", label: "QUESTIONS", color: "var(--green-hi)" },
                  { val: "5",  label: "LEVELS",    color: "var(--amber)" },
                  { val: "3",  label: "HULL PTS",  color: "var(--red-hi)" },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 900, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: "0.52rem", color: "var(--green-dim)", letterSpacing: "0.08em", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Rules */}
              <div className="panel" style={{ width: "100%", borderRadius: 8, padding: "12px 14px", fontSize: "0.72rem", color: "#66cc99", lineHeight: 1.85 }}>
                ▸ Answer questions → earn ammo 🔫<br />
                ▸ Asteroids that <em>hit your warship</em> deal damage<br />
                ▸ Missed asteroids <strong style={{ color: "var(--green-hi)" }}>do NOT</strong> damage you<br />
                ▸ 3 direct hits = hull breach = GAME OVER<br />
                ▸ Earn 🪙 coins: your score ÷ 5 per session
              </div>

              {/* Deploy */}
              <motion.button className="btn-military btn-fire"
                style={{ width: "100%", padding: "13px", fontSize: "0.85rem" }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={deploy}>
                ⚓ DEPLOY {selectedShip.name}
              </motion.button>

              <button className="btn-military" style={{ width: "100%", padding: "9px", fontSize: "0.65rem" }}
                onClick={() => setTab("hangar")}>
                ⚓ SWITCH WARSHIP
              </button>

              <div style={{ fontSize: "0.58rem", color: "var(--green-dim)", textAlign: "center" }}>
                SPACE / tap to fire &nbsp;·&nbsp; drag or ← → to steer
              </div>
            </motion.div>
          )}

          {/* ── HANGAR TAB ── */}
          {tab === "hangar" && (
            <motion.div
              key="hangar"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: "16px", maxWidth: 500, margin: "0 auto" }}
            >
              <div style={{
                fontFamily: "var(--font-display)", color: "var(--green-dim)",
                fontSize: "0.58rem", letterSpacing: "0.13em", marginBottom: 12,
              }}>
                ▸ SELECT WARSHIP &nbsp;|&nbsp; COINS: <span style={{ color: "#ffdd44" }}>🪙 {coins}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SHIPS.map(ship => {
                  const unlocked = coins >= ship.cost;
                  const isSelected = selectedId === ship.id;
                  return (
                    <motion.div
                      key={ship.id}
                      className="panel"
                      onClick={() => selectShip(ship)}
                      style={{
                        borderRadius: 8, padding: "12px 12px",
                        border: isSelected ? `1px solid ${ship.color}` : unlocked ? "1px solid rgba(0,255,136,0.1)" : "1px solid rgba(255,255,255,0.05)",
                        opacity: unlocked ? 1 : 0.48,
                        cursor: unlocked ? "pointer" : "not-allowed",
                        boxShadow: isSelected ? `0 0 20px ${ship.color}33` : "none",
                        transition: "all 0.2s",
                      }}
                      whileHover={unlocked ? { scale: 1.01 } : {}}
                      whileTap={unlocked ? { scale: 0.985 } : {}}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        {/* Ship visual */}
                        <div style={{
                          flexShrink: 0, width: 66, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 4,
                          filter: unlocked ? `drop-shadow(0 0 8px ${ship.color}77)` : "grayscale(1) opacity(0.35)",
                        }}>
                          {unlocked ? (
                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}>
                              <ShipSVG ship={ship} size={60} />
                            </motion.div>
                          ) : (
                            <div style={{ fontSize: "1.8rem", textAlign: "center" }}>🔒</div>
                          )}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 1 }}>
                            <span style={{
                              fontFamily: "var(--font-display)", fontSize: "0.68rem", fontWeight: 700,
                              color: isSelected ? ship.color : unlocked ? "#ccffee" : "#446655",
                              textShadow: isSelected ? `0 0 8px ${ship.color}` : "none",
                            }}>{ship.name}</span>
                            {isSelected && (
                              <span style={{
                                fontSize: "0.52rem", color: ship.color,
                                background: `${ship.color}18`, border: `1px solid ${ship.color}44`,
                                borderRadius: 3, padding: "1px 5px", flexShrink: 0,
                              }}>ACTIVE</span>
                            )}
                          </div>
                          <div style={{ fontSize: "0.57rem", color: "var(--green-dim)", letterSpacing: "0.1em", marginBottom: 4 }}>
                            {ship.class}
                          </div>
                          <div style={{ fontSize: "0.63rem", color: "#88bbaa", lineHeight: 1.4, marginBottom: 6 }}>
                            {ship.description}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <StatBar label="SPEED"     value={ship.speed}     color={ship.accentColor} />
                            <StatBar label="FIREPOWER" value={ship.firepower} color={ship.color} />
                            <StatBar label="ARMOR"     value={ship.armor}     color="#ff3344" />
                          </div>

                          {!unlocked && (
                            <div style={{ marginTop: 6, fontSize: "0.6rem", color: "var(--amber)", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                              🔒 REQUIRES 🪙 {ship.cost}
                              <span style={{ color: "var(--green-dim)" }}>
                                ({Math.max(0, ship.cost - coins)} more needed)
                              </span>
                            </div>
                          )}
                          {unlocked && !isSelected && (
                            <button className="btn-military"
                              style={{ marginTop: 7, padding: "3px 11px", fontSize: "0.58rem", borderColor: ship.color, color: ship.color }}
                              onClick={e => { e.stopPropagation(); selectShip(ship); }}>
                              SELECT
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button className="btn-military btn-fire"
                style={{ width: "100%", padding: "13px", fontSize: "0.82rem", marginTop: 14 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={deploy}>
                ⚓ DEPLOY {selectedShip.name}
              </motion.button>

              {/* Dev testing button — remove in production */}
              <button className="btn-military"
                style={{ width: "100%", padding: "8px", marginTop: 8, fontSize: "0.58rem", opacity: 0.35 }}
                onClick={() => addCoins(50)}>
                [DEV] +50 COINS FOR TESTING
              </button>
            </motion.div>
          )}

        </div>
      )}
    </div>
  );
}
