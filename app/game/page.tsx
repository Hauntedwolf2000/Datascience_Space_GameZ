"use client";

/**
 * DS WARSHIP DEFENDER — Game Page
 *
 * KEY RULES (self-critiqued and fixed):
 *  1. Asteroid falling OFF-SCREEN does NOT damage the warship.
 *  2. Only direct collision with the warship counts as a hit.
 *  3. Warship has 3 hull points. 3 hits → GAME OVER.
 *  4. Warship is a military battleship SVG (not a spaceship emoji).
 *  5. Mobile: full-width shoot button + drag-to-steer (touch tracking on game area).
 *  6. Game loop uses stored W/H refs — no getBoundingClientRect in hot path.
 *  7. Questions panel hover PAUSES physics but never blocks answering.
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getQuestionsForLevel,
  getLevelConfig,
  TOTAL_LEVELS,
  type Question,
} from "../../data/questions";

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════
interface Asteroid {
  id: string;
  x: number; // px from left of game area
  y: number; // px from top of game area
  vx: number; // horizontal drift px/frame
  vy: number; // downward speed px/frame
  r: number; // collision radius px
  rot: number; // rotation degrees
  rotSpd: number;
  scale: number; // visual scale factor
  type: number; // 0-3 for different rock shapes
}

interface Projectile {
  id: string;
  x: number;
  y: number;
}

type Phase = "idle" | "playing" | "gameover";

// ══════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════
const MAX_HULL = 3;
const BULLET_SPEED = 7;
const SHIP_W = 64; // warship width px
const SHIP_H = 52; // warship height px
const SCORE_PER_KILL = 10;
const LEVEL_EVERY = 60; // score points per level-up
let _id = 0;
const nid = () => `${++_id}`;

// ── Lightweight ship catalogue for in-game picker ─────────────
const SHIPS_INLINE = [
  {
    id: "corvette",
    name: "CSS CORVETTE",
    class: "SCOUT",
    cost: 0,
    color: "#00cc66",
    emoji: "🚢",
  },
  {
    id: "destroyer",
    name: "DSS DESTROYER",
    class: "ASSAULT",
    cost: 50,
    color: "#00aaff",
    emoji: "⛴️",
  },
  {
    id: "cruiser",
    name: "MLS CRUISER",
    class: "HEAVY",
    cost: 150,
    color: "#cc44ff",
    emoji: "🛳️",
  },
  {
    id: "battleship",
    name: "NNS BATTLESHIP",
    class: "DREADNOUGHT",
    cost: 300,
    color: "#ffaa00",
    emoji: "🚀",
  },
  {
    id: "phantom",
    name: "AI PHANTOM",
    class: "STEALTH",
    cost: 500,
    color: "#ff3366",
    emoji: "👾",
  },
];

// ══════════════════════════════════════════════════════════════
// WARSHIP SVGs — 5 distinct silhouettes, all colors from ship data
// ══════════════════════════════════════════════════════════════
function WarshipSVG({ shipId }: { shipId: string }) {
  const ship = SHIPS_INLINE.find((s) => s.id === shipId) ?? SHIPS_INLINE[0];
  const c = ship.color;
  const c40 = c + "66";
  const c60 = c + "99";
  const bg = c + "18";

  const shapes: Record<string, JSX.Element> = {
    corvette: (
      <svg viewBox="0 0 64 56" fill="none" width="100%" height="100%">
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
        <circle cx="32" cy="2" r="2.5" fill={c} />
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
        <line x1="20" y1="30" x2="44" y2="30" stroke={c40} strokeWidth="0.7" />
        <line x1="22" y1="36" x2="42" y2="36" stroke={c40} strokeWidth="0.7" />
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
        <line
          x1="16"
          y1="22"
          x2="10"
          y2="30"
          stroke={c60}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="48"
          y1="22"
          x2="54"
          y2="30"
          stroke={c60}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    destroyer: (
      <svg viewBox="0 0 72 56" fill="none" width="100%" height="100%">
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
        <circle cx="30" cy="2" r="2.2" fill={c} />
        <circle cx="42" cy="2" r="2.2" fill={c} />
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
        <rect
          x="10"
          y="26"
          width="3"
          height="10"
          rx="1"
          fill="#001020"
          stroke={c}
          strokeWidth="0.8"
          transform="rotate(-20 11 31)"
        />
        <rect
          x="59"
          y="26"
          width="3"
          height="10"
          rx="1"
          fill="#001020"
          stroke={c}
          strokeWidth="0.8"
          transform="rotate(20 61 31)"
        />
        <line x1="18" y1="38" x2="54" y2="38" stroke={c40} strokeWidth="0.8" />
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
      </svg>
    ),
    cruiser: (
      <svg viewBox="0 0 76 58" fill="none" width="100%" height="100%">
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
        <circle cx="30" cy="1" r="2" fill={c} />
        <circle cx="36" cy="1" r="2" fill={c} />
        <circle cx="42" cy="1" r="2" fill={c} />
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
        <path d="M8 28 L2 38 L12 34 Z" fill={bg} stroke={c} strokeWidth="1" />
        <path d="M68 28 L74 38 L64 34 Z" fill={bg} stroke={c} strokeWidth="1" />
        <line x1="16" y1="36" x2="60" y2="36" stroke={c40} strokeWidth="1" />
        <line x1="20" y1="42" x2="56" y2="42" stroke={c40} strokeWidth="0.8" />
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
      </svg>
    ),
    battleship: (
      <svg viewBox="0 0 80 60" fill="none" width="100%" height="100%">
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
        <circle cx="29.5" cy="0" r="2.5" fill={c} />
        <circle cx="36.5" cy="0" r="2.5" fill={c} />
        <circle cx="43.5" cy="0" r="2.5" fill={c} />
        <circle cx="50.5" cy="0" r="2.5" fill={c} />
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
        <rect
          x="30"
          y="23"
          width="5"
          height="4"
          rx="1"
          fill={c}
          opacity="0.5"
        />
        <rect
          x="44"
          y="23"
          width="5"
          height="4"
          rx="1"
          fill={c}
          opacity="0.5"
        />
        <path d="M6 28 L0 36 L12 32 Z" fill={bg} stroke={c} strokeWidth="1.2" />
        <path
          d="M74 28 L80 36 L68 32 Z"
          fill={bg}
          stroke={c}
          strokeWidth="1.2"
        />
        <circle cx="2" cy="34" r="2.5" fill={c} opacity="0.7" />
        <circle cx="78" cy="34" r="2.5" fill={c} opacity="0.7" />
        <line x1="14" y1="38" x2="66" y2="38" stroke={c60} strokeWidth="1" />
        <line x1="18" y1="44" x2="62" y2="44" stroke={c40} strokeWidth="0.9" />
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
      </svg>
    ),
    phantom: (
      <svg viewBox="0 0 72 52" fill="none" width="100%" height="100%">
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
        <circle cx="36" cy="1" r="2.8" fill={c} />
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
          fill={c}
          opacity="0.95"
        />
        <rect
          x="37"
          y="17"
          width="5"
          height="5"
          rx="1"
          fill={c}
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
        <line
          x1="18"
          y1="24"
          x2="10"
          y2="34"
          stroke={c}
          strokeWidth="0.8"
          opacity="0.6"
        />
        <line
          x1="54"
          y1="24"
          x2="62"
          y2="34"
          stroke={c}
          strokeWidth="0.8"
          opacity="0.6"
        />
        <line
          x1="24"
          y1="34"
          x2="48"
          y2="34"
          stroke={c}
          strokeWidth="0.5"
          opacity="0.4"
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
      </svg>
    ),
  };

  return shapes[shipId] ?? shapes["corvette"];
}

function Warship({
  x,
  y,
  glow,
  shipId,
}: {
  x: number;
  y: number;
  glow: boolean;
  shipId: string;
}) {
  const ship = SHIPS_INLINE.find((s) => s.id === shipId) ?? SHIPS_INLINE[0];
  const gc = ship.color;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: SHIP_W,
        height: SHIP_H,
        pointerEvents: "none",
        transform: `translate(${x - SHIP_W / 2}px, ${-(14 + y)}px)`,
        filter: glow
          ? `drop-shadow(0 0 12px #00eeff) drop-shadow(0 0 24px #00eeff)`
          : `drop-shadow(0 0 7px ${gc}) drop-shadow(0 0 16px ${gc}88)`,
        transition: "filter 0.2s",
        willChange: "transform",
      }}
    >
      <WarshipSVG shipId={shipId} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ASTEROID SVG shapes
// ══════════════════════════════════════════════════════════════
const ASTEROID_PATHS = [
  "M0,-16 L9,-10 L15,-3 L12,8 L4,15 L-8,14 L-15,5 L-13,-7 L-6,-14 Z",
  "M0,-18 L12,-12 L18,0 L11,13 L0,18 L-13,12 L-17,-2 L-10,-14 Z",
  "M4,-15 L14,-6 L14,8 L6,16 L-7,16 L-15,6 L-14,-8 L-4,-16 Z",
  "M0,-14 L8,-8 L14,-2 L13,7 L7,14 L-5,15 L-13,8 L-15,-3 L-8,-12 Z",
];
const ASTEROID_COLORS = ["#ff4422", "#ff6633", "#ff8844", "#ffaa22"];

function AsteroidSVG({ asteroid }: { asteroid: Asteroid }) {
  const color = ASTEROID_COLORS[asteroid.type];
  return (
    <div
      key={asteroid.id}
      style={{
        position: "absolute",
        left: asteroid.x - asteroid.r,
        top: asteroid.y - asteroid.r,
        width: asteroid.r * 2,
        height: asteroid.r * 2,
        pointerEvents: "none",
        transform: `rotate(${asteroid.rot}deg)`,
        filter: `drop-shadow(0 0 6px ${color}88)`,
      }}
    >
      <svg
        viewBox="-20 -20 40 40"
        width={asteroid.r * 2}
        height={asteroid.r * 2}
      >
        <path
          d={ASTEROID_PATHS[asteroid.type]}
          fill={color}
          stroke="#ff220088"
          strokeWidth="1"
          opacity="0.92"
        />
        {/* crater details */}
        <circle
          cx="3"
          cy="-4"
          r="2.5"
          fill="none"
          stroke="#ffffff22"
          strokeWidth="0.8"
        />
        <circle
          cx="-5"
          cy="5"
          r="1.5"
          fill="none"
          stroke="#ffffff18"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EXPLOSION particle
// ══════════════════════════════════════════════════════════════
interface Explosion {
  id: string;
  x: number;
  y: number;
  big: boolean;
}

function ExplosionFX({ ex }: { ex: Explosion }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: ex.x - 24,
        top: ex.y - 24,
        pointerEvents: "none",
      }}
      initial={{ opacity: 1, scale: 0.4 }}
      animate={{ opacity: 0, scale: ex.big ? 2.8 : 2 }}
      transition={{ duration: 0.45 }}
    >
      <svg viewBox="0 0 48 48" width="48" height="48">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <line
            key={i}
            x1="24"
            y1="24"
            x2={24 + 16 * Math.cos((deg * Math.PI) / 180)}
            y2={24 + 16 * Math.sin((deg * Math.PI) / 180)}
            stroke={ex.big ? "#ff4422" : "#ffaa22"}
            strokeWidth={ex.big ? "2.5" : "1.8"}
            strokeLinecap="round"
            opacity="0.9"
          />
        ))}
        <circle
          cx="24"
          cy="24"
          r={ex.big ? 7 : 4}
          fill={ex.big ? "#ff6633" : "#ffcc44"}
          opacity="0.85"
        />
      </svg>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// PROJECTILE
// ══════════════════════════════════════════════════════════════
function ProjectileFX({ p }: { p: Projectile }) {
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - 3,
        top: p.y - 10,
        width: 6,
        height: 18,
        borderRadius: 3,
        background:
          "linear-gradient(180deg, #ffffff 0%, #00eeff 40%, #6366f1 100%)",
        boxShadow: "0 0 8px #00eeff, 0 0 16px #0044ff",
        pointerEvents: "none",
      }}
    />
  );
}

// ══════════════════════════════════════════════════════════════
// HUD — high-contrast, always readable
// ══════════════════════════════════════════════════════════════
function HUD({
  score,
  bullets,
  hull,
  level,
  paused,
}: {
  score: number;
  bullets: number;
  hull: number;
  level: number;
  paused: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "7px 12px",
        gap: 6,
        flexShrink: 0,
        background: "rgba(0,5,2,0.96)",
        borderBottom: "1px solid rgba(0,255,136,0.2)",
      }}
    >
      {/* Score */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(255,220,0,0.1)",
          border: "1px solid rgba(255,220,0,0.3)",
          borderRadius: 5,
          padding: "3px 10px",
          minWidth: 60,
        }}
      >
        <span
          style={{
            fontSize: "0.5rem",
            color: "#aa8800",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-display)",
          }}
        >
          SCORE
        </span>
        <motion.span
          key={score}
          initial={{ scale: 1.3, color: "#ffff00" }}
          animate={{ scale: 1, color: "#ffdd44" }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: "1rem",
            fontWeight: 900,
            fontFamily: "var(--font-display)",
            color: "#ffdd44",
            textShadow: "0 0 10px #ffdd44",
          }}
        >
          {String(score).padStart(4, "0")}
        </motion.span>
      </div>

      {/* Bullets */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(0,238,255,0.08)",
          border: "1px solid rgba(0,238,255,0.3)",
          borderRadius: 5,
          padding: "3px 10px",
          minWidth: 60,
        }}
      >
        <span
          style={{
            fontSize: "0.5rem",
            color: "#007799",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-display)",
          }}
        >
          AMMO
        </span>
        <motion.span
          key={bullets}
          initial={{ scale: 1.4, color: "#ffffff" }}
          animate={{ scale: 1, color: "#00eeff" }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: "1rem",
            fontWeight: 900,
            fontFamily: "var(--font-display)",
            color: "#00eeff",
            textShadow: "0 0 10px #00eeff",
          }}
        >
          🔫 {bullets}
        </motion.span>
      </div>

      {/* Hull */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(255,51,68,0.08)",
          border: "1px solid rgba(255,51,68,0.3)",
          borderRadius: 5,
          padding: "3px 8px",
        }}
      >
        <span
          style={{
            fontSize: "0.5rem",
            color: "#882233",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-display)",
            marginBottom: 3,
          }}
        >
          HULL
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: MAX_HULL }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i < hull ? 1 : 0.6,
                opacity: i < hull ? 1 : 0.2,
              }}
              style={{
                width: 12,
                height: 20,
                borderRadius: 2,
                background:
                  i < hull
                    ? hull === 1
                      ? "#ff3344"
                      : "#ff5566"
                    : "rgba(255,51,68,0.15)",
                border: "1px solid rgba(255,51,68,0.5)",
                boxShadow:
                  i < hull
                    ? `0 0 8px ${hull === 1 ? "#ff0011" : "#ff334488"}`
                    : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Level */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "rgba(0,255,136,0.06)",
          border: "1px solid rgba(0,255,136,0.2)",
          borderRadius: 5,
          padding: "3px 10px",
          minWidth: 44,
        }}
      >
        <span
          style={{
            fontSize: "0.5rem",
            color: "var(--green-dim)",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-display)",
          }}
        >
          LVL
        </span>
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 900,
            fontFamily: "var(--font-display)",
            color: "var(--green-hi)",
            textShadow: "0 0 10px var(--green-hi)",
          }}
        >
          {level}
        </span>
      </div>

      {paused && (
        <div
          style={{
            fontSize: "0.55rem",
            color: "var(--amber)",
            letterSpacing: "0.12em",
            background: "rgba(255,170,0,0.1)",
            border: "1px solid rgba(255,170,0,0.3)",
            borderRadius: 4,
            padding: "2px 7px",
          }}
          className="flicker"
        >
          ⏸ PAUSED
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// QUESTION PANEL
// ── FIX: always highlights the CORRECT answer after any pick.
//         If user picks wrong, their choice glows red AND the
//         correct one glows green simultaneously.
// ══════════════════════════════════════════════════════════════
function QuestionPanel({
  question,
  onAnswer,
  gameStarted,
  onHover,
  noAmmoFlash,
}: {
  question: Question | null;
  onAnswer: (idx: number) => void;
  gameStarted: boolean;
  onHover: (v: boolean) => void;
  noAmmoFlash: boolean;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  // Reset when question changes
  useEffect(() => {
    setPicked(null);
    setResult(null);
  }, [question?.id]);

  const answer = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const ok = question!.answer === idx;
    setResult(ok ? "correct" : "wrong");
    onAnswer(idx);
    // Show result for 3 seconds, then advance to next question
    setTimeout(() => {
      setPicked(null);
      setResult(null);
    }, 3000);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        gap: 8,
        fontFamily: "var(--font-mono)",
        overflowY: "auto",
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          paddingBottom: 6,
          borderBottom: "1px solid rgba(0,255,136,0.12)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: gameStarted ? "var(--green-hi)" : "var(--green-dim)",
            boxShadow: gameStarted ? "0 0 8px var(--green-hi)" : "none",
          }}
          className={gameStarted ? "radar-ping" : ""}
        />
        <span
          style={{
            color: "var(--green-dim)",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
          }}
        >
          INTEL SYSTEM
        </span>
        <span
          style={{
            color: "var(--amber)",
            fontSize: "0.6rem",
            marginLeft: "auto",
          }}
        >
          ⏸ HOVER = PAUSE
        </span>
      </div>

      {/* No-ammo alert */}
      <AnimatePresence>
        {noAmmoFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flexShrink: 0,
              background: "rgba(255,170,0,0.15)",
              border: "2px solid var(--amber)",
              borderRadius: 6,
              padding: "10px 12px",
              textAlign: "center",
              color: "var(--amber)",
              fontSize: "0.85rem",
              fontWeight: 700,
              textShadow: "0 0 10px var(--amber)",
              boxShadow: "0 0 20px rgba(255,170,0,0.25)",
            }}
          >
            ⚠ NO AMMO! Answer a question to reload 🔫
          </motion.div>
        )}
      </AnimatePresence>

      {!gameStarted ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--green-dim)",
            fontSize: "0.75rem",
            textAlign: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: "2rem" }}>📡</div>
          <div>AWAITING MISSION START</div>
          <div style={{ fontSize: "0.62rem", color: "#003322" }}>
            Questions appear once
            <br />
            combat begins
          </div>
        </div>
      ) : question ? (
        <>
          {/* Question text */}
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(0,255,136,0.05)",
              border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: 7,
              padding: "12px 12px",
              fontSize: "0.95rem",
              color: "#e0fff0",
              lineHeight: 1.55,
              flexShrink: 0,
              fontWeight: 600,
            }}
          >
            <span style={{ color: "var(--amber)", marginRight: 6 }}>▸</span>
            {question.question}
          </motion.div>

          {/* Options — pure inline styles so correct=green / wrong=red always wins */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {question.options.map((opt, idx) => {
              const isCorrect = idx === question.answer;
              const isPicked = idx === picked;
              const answered = picked !== null;

              let bg = "rgba(0,255,136,0.04)";
              let border = "1px solid rgba(0,255,136,0.14)";
              let color = "#99ffcc";
              let shadow = "none";
              let opacity = 1;
              let cursor = "pointer";

              if (answered) {
                if (isCorrect) {
                  bg = "rgba(0,255,136,0.18)";
                  border = "2px solid #00ff88";
                  color = "#00ff88";
                  shadow = "0 0 14px rgba(0,255,136,0.5)";
                } else if (isPicked) {
                  bg = "rgba(255,51,68,0.18)";
                  border = "2px solid #ff3344";
                  color = "#ff3344";
                  shadow = "0 0 14px rgba(255,51,68,0.4)";
                } else {
                  opacity = 0.28;
                  cursor = "default";
                }
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => answer(idx)}
                  disabled={answered}
                  animate={
                    isPicked && result === "wrong"
                      ? { x: [0, -9, 9, -6, 6, 0] }
                      : {}
                  }
                  transition={{ duration: 0.38 }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 6,
                    border,
                    background: bg,
                    color,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.88rem",
                    lineHeight: 1.45,
                    cursor,
                    opacity,
                    boxShadow: shadow,
                    textShadow:
                      answered && (isCorrect || isPicked)
                        ? `0 0 8px ${isCorrect ? "#00ff88" : "#ff3344"}`
                        : "none",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {/* Letter badge */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-display)",
                      background:
                        answered && isCorrect
                          ? "#00ff88"
                          : answered && isPicked
                            ? "#ff3344"
                            : "rgba(0,255,136,0.1)",
                      color:
                        answered && (isCorrect || isPicked)
                          ? "#000"
                          : "var(--green-dim)",
                    }}
                  >
                    {["A", "B", "C", "D"][idx]}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {/* Result icon */}
                  {answered && isCorrect && (
                    <span style={{ flexShrink: 0, fontSize: "0.9rem" }}>
                      ✅
                    </span>
                  )}
                  {answered && isPicked && !isCorrect && (
                    <span style={{ flexShrink: 0, fontSize: "0.9rem" }}>
                      ❌
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Result banner — stays visible for 3 seconds */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: "center",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  padding: "10px 12px",
                  borderRadius: 6,
                  flexShrink: 0,
                  color: result === "correct" ? "#00ff88" : "#ff3344",
                  background:
                    result === "correct"
                      ? "rgba(0,255,136,0.12)"
                      : "rgba(255,51,68,0.14)",
                  border: `2px solid ${result === "correct" ? "rgba(0,255,136,0.5)" : "rgba(255,51,68,0.5)"}`,
                  textShadow: `0 0 12px ${result === "correct" ? "#00ff88" : "#ff3344"}`,
                  boxShadow: `0 0 20px ${result === "correct" ? "rgba(0,255,136,0.2)" : "rgba(255,51,68,0.2)"}`,
                }}
              >
                {result === "correct"
                  ? "✅ CORRECT! +1 AMMO LOADED"
                  : "❌ WRONG! Correct answer shown above ↑"}
                <div
                  style={{ fontSize: "0.65rem", marginTop: 4, opacity: 0.7 }}
                >
                  Next question in 3 seconds…
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : null}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// GAME OVER SCREEN — saves coins (score ÷ 5) to localStorage
// ══════════════════════════════════════════════════════════════
function GameOverScreen({
  score,
  level,
  onRestart,
  onHome,
}: {
  score: number;
  level: number;
  onRestart: () => void;
  onHome: () => void;
}) {
  const coinsEarned = Math.floor(score / 5);

  // Save coins once on mount (when game over screen appears)
  useEffect(() => {
    const prev = parseInt(localStorage.getItem("ds_coins") ?? "0", 10);
    localStorage.setItem(
      "ds_coins",
      String((isNaN(prev) ? 0 : prev) + coinsEarned),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(6px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="panel corner-decor"
        style={{
          borderRadius: 8,
          padding: "28px 24px",
          textAlign: "center",
          maxWidth: 290,
          width: "90%",
          fontFamily: "var(--font-display)",
        }}
        initial={{ scale: 0.6, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>💥</div>
        <div
          style={{
            fontSize: "1.4rem",
            fontWeight: 900,
            color: "var(--red-hi)",
            textShadow: "0 0 16px var(--red-hi)",
            letterSpacing: "0.1em",
            marginBottom: 4,
          }}
        >
          HULL BREACH
        </div>
        <div
          style={{
            color: "var(--green-dim)",
            fontSize: "0.7rem",
            marginBottom: 16,
          }}
        >
          WARSHIP DESTROYED
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{ fontSize: "1.6rem", color: "#ffdd44", fontWeight: 900 }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: "0.58rem",
                color: "var(--green-dim)",
                letterSpacing: "0.08em",
              }}
            >
              SCORE
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "1.6rem",
                color: "var(--green-hi)",
                fontWeight: 900,
              }}
            >
              LV{level}
            </div>
            <div
              style={{
                fontSize: "0.58rem",
                color: "var(--green-dim)",
                letterSpacing: "0.08em",
              }}
            >
              LEVEL
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "1.6rem", color: "#ffdd44", fontWeight: 900 }}
            >
              +{coinsEarned}
            </div>
            <div
              style={{
                fontSize: "0.58rem",
                color: "#ffdd44",
                letterSpacing: "0.08em",
              }}
            >
              🪙 COINS
            </div>
          </div>
        </div>

        {/* Coins earned callout */}
        <div
          style={{
            marginBottom: 16,
            padding: "6px 0",
            borderRadius: 4,
            background: "rgba(255,220,0,0.07)",
            border: "1px solid rgba(255,220,0,0.25)",
            fontSize: "0.62rem",
            color: "#ffdd44",
          }}
        >
          🪙 {coinsEarned} coins saved to hangar
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            className="btn-military btn-fire"
            style={{ width: "100%", padding: "12px" }}
            onClick={onRestart}
          >
            ↺ REDEPLOY
          </button>
          <button
            className="btn-military btn-danger"
            style={{ width: "100%", padding: "12px" }}
            onClick={onHome}
          >
            ← RETREAT TO BASE
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// LEVEL UP FLASH
// ══════════════════════════════════════════════════════════════
function LevelUpFlash({ level }: { level: number }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 2, times: [0, 0.15, 0.8, 1] }}
    >
      <div
        style={{
          background: "rgba(0,10,5,0.85)",
          backdropFilter: "blur(4px)",
          border: "2px solid var(--amber)",
          boxShadow: "0 0 30px rgba(255,170,0,0.5)",
          borderRadius: 8,
          padding: "18px 32px",
          textAlign: "center",
          fontFamily: "var(--font-display)",
        }}
      >
        <div
          style={{
            color: "var(--amber)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
          }}
        >
          ⚠ ALERT
        </div>
        <div
          style={{
            color: "var(--amber)",
            fontSize: "1.4rem",
            fontWeight: 900,
            marginTop: 4,
          }}
        >
          SECTOR {level}
        </div>
        <div style={{ color: "#ccaa55", fontSize: "0.65rem", marginTop: 4 }}>
          THREAT LEVEL RISING
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// HIT FLASH
// ══════════════════════════════════════════════════════════════
function HitFlash({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 40,
        background: "rgba(255,30,30,0.35)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.35 }}
    />
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN GAME PAGE
// ══════════════════════════════════════════════════════════════
export default function GamePage() {
  const router = useRouter();

  // ── DOM refs ──
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameDims = useRef({ w: 0, h: 0 }); // stored so rAF never calls getBCR
  const rafRef = useRef<number>(0);
  const isPausedRef = useRef(false);

  // ── State shown to React ──
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [bullets, setBullets] = useState(3);
  const [hull, setHull] = useState(MAX_HULL);
  const [level, setLevel] = useState(1);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [shipX, setShipX] = useState(200);
  const [shipY, setShipY] = useState(0); // distance from bottom in px
  const [selectedShipId, setSelectedShipId] = useState("corvette");
  const [showShipPicker, setShowShipPicker] = useState(false);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const [paused, setPaused] = useState(false);
  const [noAmmoFlash, setNoAmmoFlash] = useState(false);

  // ── Refs for game loop (no stale closures) ──
  const phaseRef = useRef<Phase>("idle");
  const scoreRef = useRef(0);
  const bulletsRef = useRef(3);
  const hullRef = useRef(MAX_HULL);
  const levelRef = useRef(1);
  const asteroidsRef = useRef<Asteroid[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const shipXRef = useRef(200);
  const shipYRef = useRef(0); // distance from bottom in px
  const lastSpawnRef = useRef(0);
  const keysRef = useRef<Record<string, boolean>>({});

  // ── Load selected ship from localStorage ──
  useEffect(() => {
    const s = localStorage.getItem("ds_selected_ship") ?? "corvette";
    setSelectedShipId(s);
  }, []);

  // ── Coins available (for ship picker) ──
  const [coins, setCoins] = useState(0);
  useEffect(() => {
    const c = parseInt(localStorage.getItem("ds_coins") ?? "0", 10);
    setCoins(isNaN(c) ? 0 : c);
  }, []);

  // ── Question state ──
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const questionsRef = useRef<Question[]>([]);
  const qIdxRef = useRef(0);

  // ── Sync React state from refs (called each frame) ──
  const sync = useCallback(() => {
    setAsteroids([...asteroidsRef.current]);
    setProjectiles([...projectilesRef.current]);
    setShipX(shipXRef.current);
    setShipY(shipYRef.current);
    setScore(scoreRef.current);
    setBullets(bulletsRef.current);
    setHull(hullRef.current);
    setLevel(levelRef.current);
  }, []);

  // ── Measure game area on mount & resize ──
  useEffect(() => {
    const measure = () => {
      const el = gameAreaRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      gameDims.current = { w: r.width, h: r.height };
      if (shipXRef.current > r.width - SHIP_W / 2)
        shipXRef.current = r.width - SHIP_W / 2;
      if (shipYRef.current > r.height - SHIP_H - 14)
        shipYRef.current = r.height - SHIP_H - 14;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ── Spawn one asteroid ──
  const spawnAsteroid = useCallback(() => {
    const { w } = gameDims.current;
    const cfg = getLevelConfig(levelRef.current);
    const r = 14 + Math.random() * 14;
    const a: Asteroid = {
      id: nid(),
      x: r + Math.random() * (w - r * 2),
      y: -r,
      vx: (Math.random() - 0.5) * 0.8,
      vy: cfg.asteroidSpeed + Math.random() * 0.6,
      r,
      rot: Math.random() * 360,
      rotSpd: (Math.random() - 0.5) * 3,
      scale: 1,
      type: Math.floor(Math.random() * 4),
    };
    asteroidsRef.current = [...asteroidsRef.current, a];
  }, []);

  // ── Fire projectile ──
  const fire = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    if (bulletsRef.current <= 0) {
      // No ammo — flash the question panel as a hint
      setNoAmmoFlash(true);
      setTimeout(() => setNoAmmoFlash(false), 800);
      return;
    }
    bulletsRef.current -= 1;
    setBullets(bulletsRef.current);
    const { h } = gameDims.current;
    const shipAbsY = h - SHIP_H - 14 - shipYRef.current;
    projectilesRef.current = [
      ...projectilesRef.current,
      { id: nid(), x: shipXRef.current, y: shipAbsY },
    ];
  }, []);

  // ── Main game loop ──
  const loop = useCallback(
    (ts: number) => {
      if (phaseRef.current !== "playing") return;

      if (isPausedRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const { w, h } = gameDims.current;
      if (!w || !h) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── Move ship (keyboard) — full 2D ──
      const step = 4;
      if (keysRef.current["ArrowLeft"] || keysRef.current["a"])
        shipXRef.current = Math.max(SHIP_W / 2 + 4, shipXRef.current - step);
      if (keysRef.current["ArrowRight"] || keysRef.current["d"])
        shipXRef.current = Math.min(
          w - SHIP_W / 2 - 4,
          shipXRef.current + step,
        );
      if (keysRef.current["ArrowUp"] || keysRef.current["w"])
        shipYRef.current = Math.min(h - SHIP_H - 20, shipYRef.current + step);
      if (keysRef.current["ArrowDown"] || keysRef.current["s"])
        shipYRef.current = Math.max(0, shipYRef.current - step);

      // ── Spawn ──
      const cfg = getLevelConfig(levelRef.current);
      if (ts - lastSpawnRef.current > cfg.spawnInterval) {
        spawnAsteroid();
        lastSpawnRef.current = ts;
      }

      // ── Move projectiles ──
      projectilesRef.current = projectilesRef.current
        .map((p) => ({ ...p, y: p.y - BULLET_SPEED }))
        .filter((p) => p.y > -20);

      // ── Move asteroids ──
      const updatedRocks = asteroidsRef.current.map((a) => ({
        ...a,
        x: a.x + a.vx,
        y: a.y + a.vy,
        rot: a.rot + a.rotSpd,
      }));

      // ── Collision: projectile ↔ asteroid ──
      const killedAsteroidIds = new Set<string>();
      const killedBulletIds = new Set<string>();
      const newExps: Explosion[] = [];

      for (const p of projectilesRef.current) {
        for (const a of updatedRocks) {
          if (killedAsteroidIds.has(a.id) || killedBulletIds.has(p.id))
            continue;
          const dist = Math.hypot(p.x - a.x, p.y + 9 - a.y);
          if (dist < a.r + 3) {
            killedAsteroidIds.add(a.id);
            killedBulletIds.add(p.id);
            scoreRef.current += SCORE_PER_KILL;
            newExps.push({ id: nid(), x: a.x, y: a.y, big: false });
          }
        }
      }

      // ── Collision: asteroid ↔ warship ──
      const sxc = shipXRef.current;
      const syc = h - SHIP_H / 2 - 14 - shipYRef.current;

      for (const a of updatedRocks) {
        if (killedAsteroidIds.has(a.id)) continue;
        const dist = Math.hypot(a.x - sxc, a.y - syc);
        if (dist < a.r + SHIP_W / 2.5) {
          killedAsteroidIds.add(a.id);
          hullRef.current = Math.max(0, hullRef.current - 1);
          newExps.push({ id: nid(), x: a.x, y: a.y, big: true });
          setHitFlash(true);
          setTimeout(() => setHitFlash(false), 400);
          if (hullRef.current <= 0) {
            phaseRef.current = "gameover";
            setPhase("gameover");
          }
        }
      }

      // ── Remove killed objects (asteroids that miss scroll off harmlessly) ──
      asteroidsRef.current = updatedRocks.filter(
        (a) => !killedAsteroidIds.has(a.id) && a.y < h + a.r + 20,
        // ↑ asteroids that fall past the bottom are simply removed — NO damage
      );
      projectilesRef.current = projectilesRef.current.filter(
        (p) => !killedBulletIds.has(p.id),
      );

      // ── Level up ──
      const newLevel = Math.min(
        TOTAL_LEVELS,
        1 + Math.floor(scoreRef.current / LEVEL_EVERY),
      );
      if (newLevel > levelRef.current) {
        levelRef.current = newLevel;
        const qs = getQuestionsForLevel(newLevel);
        questionsRef.current = qs;
        qIdxRef.current = 0;
        setQuestions(qs);
        setQIdx(0);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2200);
      }

      // ── Add explosions to React state ──
      if (newExps.length > 0) {
        setExplosions((prev) => {
          const next = [...prev, ...newExps];
          const ids = new Set(newExps.map((e) => e.id));
          setTimeout(
            () => setExplosions((e) => e.filter((x) => !ids.has(x.id))),
            500,
          );
          return next;
        });
      }

      sync();
      rafRef.current = requestAnimationFrame(loop);
    },
    [spawnAsteroid, sync],
  );

  // ── Start / restart ──
  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    _id = 0;
    scoreRef.current = 0;
    bulletsRef.current = 3;
    hullRef.current = MAX_HULL;
    levelRef.current = 1;
    asteroidsRef.current = [];
    projectilesRef.current = [];
    lastSpawnRef.current = 0;
    qIdxRef.current = 0;
    isPausedRef.current = false;

    // Centre ship
    const el = gameAreaRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      gameDims.current = { w: r.width, h: r.height };
      shipXRef.current = r.width / 2;
      shipYRef.current = 0;
    }

    const qs = getQuestionsForLevel(1);
    questionsRef.current = qs;
    setQuestions(qs);
    setQIdx(0);
    setExplosions([]);
    setHitFlash(false);
    setShowLevelUp(false);
    sync();

    phaseRef.current = "playing";
    setPhase("playing");
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, sync]);

  // ── Keyboard ──
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === " ") {
        e.preventDefault();
        fire();
      }
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [fire]);

  // ── Touch: drag ship + tap to fire ──
  const lastTouchX = useRef<number | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const t = e.touches[0];
      lastTouchX.current = t.clientX;
      // tap fire if finger is in lower 30% of game area
      const el = gameAreaRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const relY = (t.clientY - rect.top) / rect.height;
        if (relY > 0.7) fire();
      }
    },
    [fire],
  );

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (phaseRef.current !== "playing") return;
    const t = e.touches[0];
    const el = gameAreaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = t.clientX - rect.left;
    const relY = t.clientY - rect.top;
    shipXRef.current = Math.min(
      gameDims.current.w - SHIP_W / 2 - 4,
      Math.max(SHIP_W / 2 + 4, relX),
    );
    // Convert touch Y to "distance from bottom"
    const fromBottom = gameDims.current.h - relY - SHIP_H / 2;
    shipYRef.current = Math.min(
      gameDims.current.h - SHIP_H - 20,
      Math.max(0, fromBottom),
    );
  }, []);

  // ── Pause game when ship picker is open ──
  useEffect(() => {
    isPausedRef.current = showShipPicker;
    if (showShipPicker) setPaused(true);
    else setPaused(false);
  }, [showShipPicker]);

  // ── Pause on question hover (only if ship picker not open) ──
  const handleQHover = useCallback(
    (v: boolean) => {
      if (showShipPicker) return; // ship picker already pausing
      isPausedRef.current = v;
      setPaused(v);
    },
    [showShipPicker],
  );

  // ── Answer question ──
  const handleAnswer = useCallback((idx: number) => {
    const q = questionsRef.current[qIdxRef.current];
    if (!q) return;
    // Award bullet immediately
    if (idx === q.answer) {
      bulletsRef.current += 1;
      setBullets(bulletsRef.current);
    }
    // Delay question advance by 3s — matches the QuestionPanel feedback timer
    setTimeout(() => {
      const next = (qIdxRef.current + 1) % questionsRef.current.length;
      qIdxRef.current = next;
      setQIdx(next);
    }, 3000);
  }, []);

  // ── Cleanup ──
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ── Mobile screen width detection ──
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const currentQ = questions[qIdx] ?? null;
  const gameStarted = phase !== "idle";

  // ── Mobile block screen ──
  if (isMobile) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, #001a0d 0%, #000a05 60%, #000 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          padding: 24,
          textAlign: "center",
          gap: 0,
        }}
      >
        {/* Scanline effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.09) 2px, rgba(0,0,0,0.09) 4px)",
          }}
        />

        {/* Animated radar pulse */}
        <div
          style={{
            position: "relative",
            width: 120,
            height: 120,
            marginBottom: 28,
          }}
        >
          {[1, 1.6, 2.2].map((scale, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid rgba(0,255,136,0.35)",
              }}
              animate={{ scale: [1, scale], opacity: [0.8, 0] }}
              transition={{
                duration: 2,
                delay: i * 0.55,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(0,255,136,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,255,136,0.05)",
            }}
          >
            <span style={{ fontSize: "2.8rem" }}>🖥️</span>
          </div>
        </div>

        {/* Warning header */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.6rem",
            color: "var(--amber)",
            letterSpacing: "0.3em",
            marginBottom: 12,
          }}
          className="flicker"
        >
          ◈ SYSTEM ALERT ◈
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            fontWeight: 900,
            color: "var(--red-hi)",
            textShadow: "0 0 18px var(--red-hi)",
            lineHeight: 1.2,
            marginBottom: 16,
            letterSpacing: "0.06em",
          }}
        >
          INSUFFICIENT
          <br />
          DISPLAY SIZE
        </h1>

        {/* Panel */}
        <div
          style={{
            background: "rgba(0,10,5,0.85)",
            border: "1px solid rgba(0,255,136,0.2)",
            borderRadius: 10,
            padding: "18px 22px",
            maxWidth: 340,
            width: "100%",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              color: "#88ccaa",
              lineHeight: 1.8,
              marginBottom: 12,
            }}
          >
            <span style={{ color: "var(--amber)" }}>▸</span> This game requires
            a<br />
            <strong style={{ color: "var(--green-hi)" }}>
              desktop or tablet screen
            </strong>
            <br />
            (min.{" "}
            <strong style={{ color: "var(--cyan-hi)" }}>900px wide</strong>) to
            play properly.
          </div>

          <div
            style={{
              background: "rgba(255,51,68,0.08)",
              border: "1px solid rgba(255,51,68,0.25)",
              borderRadius: 6,
              padding: "10px 12px",
              fontSize: "0.72rem",
              color: "#ffaaaa",
              lineHeight: 1.7,
            }}
          >
            <div
              style={{
                marginBottom: 4,
                fontWeight: 700,
                color: "var(--red-hi)",
              }}
            >
              ⚠ Why mobile doesn&apos;t work:
            </div>
            The game has a live question panel, HUD, ship controls and asteroid
            field — all need sufficient space to be playable and readable.
          </div>
        </div>

        {/* Options */}
        <div
          style={{
            background: "rgba(0,10,5,0.85)",
            border: "1px solid rgba(0,255,136,0.15)",
            borderRadius: 10,
            padding: "14px 18px",
            maxWidth: 340,
            width: "100%",
            fontSize: "0.75rem",
            color: "#66cc99",
            lineHeight: 2,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.58rem",
              color: "var(--green-dim)",
              letterSpacing: "0.12em",
              marginBottom: 8,
            }}
          >
            ▸ HOW TO PLAY
          </div>
          <div>
            📱 On phone → request{" "}
            <strong style={{ color: "var(--green-hi)" }}>Desktop Site</strong>{" "}
            in your browser menu
          </div>
          <div>
            💻 Switch to a{" "}
            <strong style={{ color: "var(--green-hi)" }}>
              laptop or desktop
            </strong>
          </div>
          <div>
            📐 Use a{" "}
            <strong style={{ color: "var(--green-hi)" }}>tablet</strong> in
            landscape mode
          </div>
        </div>

        <motion.button
          className="btn-military"
          style={{ padding: "12px 28px", fontSize: "0.7rem", marginBottom: 12 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            cancelAnimationFrame(rafRef.current);
            window.history.back();
          }}
        >
          ← BACK TO BASE
        </motion.button>

        <div
          style={{
            fontSize: "0.58rem",
            color: "var(--green-dim)",
            letterSpacing: "0.1em",
          }}
        >
          Current width: {typeof window !== "undefined" ? window.innerWidth : 0}
          px / Required: 900px+
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-deep)",
        fontFamily: "var(--font-mono)",
        overflow: "hidden",
      }}
    >
      {/* ── Top nav bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 10px",
          background: "rgba(0,5,2,0.97)",
          borderBottom: "1px solid rgba(0,255,136,0.15)",
          flexShrink: 0,
          gap: 6,
        }}
      >
        <button
          className="btn-military"
          style={{ padding: "4px 9px", fontSize: "0.58rem" }}
          onClick={() => {
            cancelAnimationFrame(rafRef.current);
            router.push("/");
          }}
        >
          ← BASE
        </button>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.58rem",
            color: "var(--green-hi)",
            letterSpacing: "0.1em",
          }}
          className="glow-green flicker"
        >
          ⚓ DS WARSHIP DEFENDER
        </div>
        {/* Ship switcher button */}
        <button
          className="btn-military"
          style={{
            padding: "4px 9px",
            fontSize: "0.58rem",
            borderColor: "var(--amber)",
            color: "var(--amber)",
          }}
          onClick={() => setShowShipPicker((p) => !p)}
        >
          ⚓ SHIP
        </button>
      </div>

      {/* ── Inline ship picker overlay — pauses game while open ── */}
      <AnimatePresence>
        {showShipPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              style={{
                width: "min(320px, 92vw)",
                maxHeight: "80vh",
                overflowY: "auto",
                background: "rgba(0,8,3,0.98)",
                border: "1px solid rgba(255,170,0,0.4)",
                borderRadius: 10,
                padding: 14,
                boxShadow:
                  "0 0 40px rgba(0,0,0,0.9), 0 0 20px rgba(255,170,0,0.15)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.7rem",
                      color: "var(--amber)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    ⚓ SWITCH WARSHIP
                  </div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--green-dim)",
                      marginTop: 2,
                    }}
                  >
                    🪙 {coins} coins &nbsp;·&nbsp; ⭐ {score} score
                  </div>
                </div>
                <button
                  className="btn-military"
                  style={{ padding: "4px 10px", fontSize: "0.6rem" }}
                  onClick={() => setShowShipPicker(false)}
                >
                  ✕ RESUME
                </button>
              </div>

              {SHIPS_INLINE.map((ship) => {
                const unlocked = coins >= ship.cost;
                const canUnlockWithScore = !unlocked && score >= ship.cost;
                const isActive = selectedShipId === ship.id;
                return (
                  <div
                    key={ship.id}
                    style={{
                      padding: "10px 10px",
                      borderRadius: 6,
                      marginBottom: 6,
                      border: isActive
                        ? `2px solid ${ship.color}`
                        : unlocked
                          ? "1px solid rgba(0,255,136,0.15)"
                          : "1px solid rgba(255,255,255,0.06)",
                      background: isActive
                        ? `${ship.color}18`
                        : "rgba(0,255,136,0.02)",
                      boxShadow: isActive ? `0 0 16px ${ship.color}33` : "none",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          fontSize: "1.8rem",
                          opacity: unlocked ? 1 : 0.35,
                        }}
                      >
                        {ship.emoji}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: isActive
                              ? ship.color
                              : unlocked
                                ? "#ccffee"
                                : "#335544",
                            textShadow: isActive
                              ? `0 0 8px ${ship.color}`
                              : "none",
                          }}
                        >
                          {ship.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.56rem",
                            color: "var(--green-dim)",
                            marginTop: 1,
                          }}
                        >
                          {ship.class}
                        </div>
                      </div>
                      {isActive && (
                        <span
                          style={{
                            fontSize: "0.55rem",
                            padding: "2px 7px",
                            borderRadius: 3,
                            background: `${ship.color}22`,
                            border: `1px solid ${ship.color}55`,
                            color: ship.color,
                          }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Action row */}
                    <div
                      style={{
                        marginTop: 7,
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      {unlocked && !isActive && (
                        <button
                          className="btn-military"
                          style={{
                            flex: 1,
                            padding: "6px",
                            fontSize: "0.6rem",
                            borderColor: ship.color,
                            color: ship.color,
                          }}
                          onClick={() => {
                            setSelectedShipId(ship.id);
                            localStorage.setItem("ds_selected_ship", ship.id);
                            setShowShipPicker(false);
                          }}
                        >
                          ⚓ DEPLOY THIS SHIP
                        </button>
                      )}
                      {canUnlockWithScore && (
                        <button
                          className="btn-military"
                          style={{
                            flex: 1,
                            padding: "6px",
                            fontSize: "0.6rem",
                            borderColor: "var(--amber)",
                            color: "var(--amber)",
                          }}
                          onClick={() => {
                            // spend score as coins to unlock
                            const newCoins = coins + score;
                            setCoins(newCoins);
                            localStorage.setItem("ds_coins", String(newCoins));
                            setSelectedShipId(ship.id);
                            localStorage.setItem("ds_selected_ship", ship.id);
                            setShowShipPicker(false);
                          }}
                        >
                          🔓 UNLOCK & DEPLOY (use {ship.cost} pts)
                        </button>
                      )}
                      {!unlocked && !canUnlockWithScore && (
                        <div
                          style={{
                            fontSize: "0.58rem",
                            color: "var(--amber)",
                            flex: 1,
                          }}
                        >
                          🔒 Need 🪙 {ship.cost} coins (
                          {Math.max(0, ship.cost - coins)} more)
                        </div>
                      )}
                      {unlocked && isActive && (
                        <div
                          style={{
                            fontSize: "0.58rem",
                            color: ship.color,
                            flex: 1,
                          }}
                        >
                          ✓ Currently deployed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main area: game + questions ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column" /* mobile: stacked */,
          overflow: "hidden",
          minHeight: 0,
        }}
        className="lg-row" /* we'll override with inline for desktop */
      >
        {/* Responsive layout rules */}
        <style>{`
          @media (min-width: 900px) {
            .layout-main { flex-direction: row !important; }
            .game-col { flex: 0 0 60% !important; width: 60% !important; min-width: 0; display: flex; flex-direction: column; }
            .q-col { flex: 0 0 40% !important; width: 40% !important; border-left: 1px solid rgba(0,255,136,0.12); overflow-y: auto; display: flex; flex-direction: column; }
            .dpad-controls { display: none !important; }
          }
          @media (max-width: 899px) {
            .layout-main { flex-direction: column !important; }
            .game-col { flex: 0 0 55vw !important; height: 55vw; min-height: 220px; max-height: 52vh; display: flex; flex-direction: column; }
            .q-col { flex: 1 1 0 !important; min-height: 180px; border-top: 1px solid rgba(0,255,136,0.12); overflow-y: auto; display: flex; flex-direction: column; }
            .dpad-controls { display: flex !important; }
          }
        `}</style>

        <div
          className="layout-main"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* ── LEFT / TOP: Game area ── */}
          <div
            className="game-col"
            style={{ display: "flex", flexDirection: "column", minHeight: 0 }}
          >
            <HUD
              score={score}
              bullets={bullets}
              hull={hull}
              level={level}
              paused={paused}
            />

            {/* Game canvas */}
            <div
              ref={gameAreaRef}
              style={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
                background:
                  "radial-gradient(ellipse at 50% 0%, #001a0d 0%, #000a05 60%, #000000 100%)",
                touchAction: "none",
                userSelect: "none",
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
            >
              {/* Subtle star field */}
              <StarFieldCanvas />

              {/* Grid lines (radar-style) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  backgroundImage:
                    "linear-gradient(rgba(0,255,136,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.035) 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />

              {/* Asteroids */}
              {asteroids.map((a) => (
                <AsteroidSVG key={a.id} asteroid={a} />
              ))}

              {/* Projectiles */}
              {projectiles.map((p) => (
                <ProjectileFX key={p.id} p={p} />
              ))}

              {/* Explosions */}
              <AnimatePresence>
                {explosions.map((ex) => (
                  <ExplosionFX key={ex.id} ex={ex} />
                ))}
              </AnimatePresence>

              {/* Hit flash */}
              <HitFlash visible={hitFlash} />

              {/* Warship */}
              {phase !== "idle" && (
                <Warship
                  x={shipX}
                  y={shipY}
                  glow={hull === 1}
                  shipId={selectedShipId}
                />
              )}

              {/* Level up */}
              <AnimatePresence>
                {showLevelUp && <LevelUpFlash level={level} />}
              </AnimatePresence>

              {/* Idle overlay */}
              {phase === "idle" && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.7)",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--green-dim)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                    }}
                  >
                    SYSTEM READY
                  </div>
                  <motion.button
                    className="btn-military btn-fire"
                    style={{ fontSize: "1rem", padding: "14px 36px" }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={startGame}
                  >
                    ⚓ LAUNCH
                  </motion.button>
                  <div
                    style={{ color: "var(--green-dim)", fontSize: "0.65rem" }}
                  >
                    Tap lower area or SPACE to fire
                  </div>
                </div>
              )}

              {/* Game over */}
              {phase === "gameover" && (
                <GameOverScreen
                  score={score}
                  level={level}
                  onRestart={startGame}
                  onHome={() => {
                    cancelAnimationFrame(rafRef.current);
                    router.push("/");
                  }}
                />
              )}
            </div>

            {/* Mobile controls — full 2D d-pad, hidden on desktop */}
            <div
              className="dpad-controls"
              style={{
                alignItems: "center",
                gap: 6,
                padding: "6px 8px",
                background: "rgba(0,5,2,0.95)",
                borderTop: "1px solid rgba(0,255,136,0.12)",
                flexShrink: 0,
              }}
            >
              {/* D-pad */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gridTemplateRows: "1fr 1fr 1fr",
                  gap: 3,
                  width: 104,
                }}
              >
                <div />
                <button
                  className="btn-military"
                  style={{
                    padding: "10px 0",
                    fontSize: "0.85rem",
                    gridColumn: "2",
                  }}
                  onPointerDown={() => {
                    keysRef.current["ArrowUp"] = true;
                  }}
                  onPointerUp={() => {
                    keysRef.current["ArrowUp"] = false;
                  }}
                  onPointerLeave={() => {
                    keysRef.current["ArrowUp"] = false;
                  }}
                >
                  ▲
                </button>
                <div />
                <button
                  className="btn-military"
                  style={{ padding: "10px 0", fontSize: "0.85rem" }}
                  onPointerDown={() => {
                    keysRef.current["ArrowLeft"] = true;
                  }}
                  onPointerUp={() => {
                    keysRef.current["ArrowLeft"] = false;
                  }}
                  onPointerLeave={() => {
                    keysRef.current["ArrowLeft"] = false;
                  }}
                >
                  ◀
                </button>
                <div
                  style={{
                    background: "rgba(0,255,136,0.04)",
                    border: "1px solid rgba(0,255,136,0.1)",
                    borderRadius: 4,
                  }}
                />
                <button
                  className="btn-military"
                  style={{ padding: "10px 0", fontSize: "0.85rem" }}
                  onPointerDown={() => {
                    keysRef.current["ArrowRight"] = true;
                  }}
                  onPointerUp={() => {
                    keysRef.current["ArrowRight"] = false;
                  }}
                  onPointerLeave={() => {
                    keysRef.current["ArrowRight"] = false;
                  }}
                >
                  ▶
                </button>
                <div />
                <button
                  className="btn-military"
                  style={{
                    padding: "10px 0",
                    fontSize: "0.85rem",
                    gridColumn: "2",
                  }}
                  onPointerDown={() => {
                    keysRef.current["ArrowDown"] = true;
                  }}
                  onPointerUp={() => {
                    keysRef.current["ArrowDown"] = false;
                  }}
                  onPointerLeave={() => {
                    keysRef.current["ArrowDown"] = false;
                  }}
                >
                  ▼
                </button>
                <div />
              </div>
              {/* Fire button */}
              <button
                className="btn-military btn-fire"
                style={{
                  flex: 1,
                  padding: "14px 0",
                  fontSize: "0.85rem",
                  height: "100%",
                }}
                onClick={fire}
              >
                🔫 FIRE
                <br />
                <span style={{ fontSize: "0.7rem" }}>({bullets} ammo)</span>
              </button>
            </div>
          </div>

          {/* ── RIGHT / BOTTOM: Questions ── */}
          <div className="q-col" style={{ background: "var(--bg-panel)" }}>
            <QuestionPanel
              question={currentQ}
              onAnswer={handleAnswer}
              gameStarted={gameStarted}
              onHover={handleQHover}
              noAmmoFlash={noAmmoFlash}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inline star canvas for game background ─────────────────────
function StarFieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);
  useEffect(() => {
    const c = ref.current!;
    const parent = c.parentElement!;
    const resize = () => {
      c.width = parent.clientWidth;
      c.height = parent.clientHeight;
    };
    resize();
    const ctx = c.getContext("2d")!;
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 0.9 + 0.1,
      spd: Math.random() * 0.1 + 0.02,
      a: Math.random() * 0.5 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
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
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
