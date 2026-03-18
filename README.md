# ⚓ DS Warship Defender

A military-aesthetic educational arcade game teaching Data Science through space combat.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Key Game Rules (Fixed)
- Asteroids that **miss your warship** do NOT damage you — only direct hits count
- 3 direct hits → Hull Breach → Game Over
- Answer questions correctly → earn ammo
- Hover the question panel → game pauses

## Controls

| Action | Desktop | Mobile |
|---|---|---|
| Move | ← → arrow keys or A/D | Drag finger on game area |
| Fire | SPACE | Tap bottom area OR the FIRE button |
| Pause | Hover question panel | Scroll question panel |

## Adding Levels & Questions

Edit `/data/questions.ts` → `LEVEL_QUESTION_BANK` array.

```ts
// Add a new level:
{
  level: 4,
  label: "DEEP LEARNING",
  asteroidSpeed: 2.5,      // higher = faster
  spawnInterval: 1600,     // lower = more frequent
  questions: [
    {
      id: 401,
      question: "What is a neural network?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: 0,  // 0=A, 1=B, 2=C, 3=D
    },
    // ... add 9+ more
  ],
}
```

## What Changed From V1
- ✅ Asteroids that fall offscreen do NOT damage warship
- ✅ Game only ends when asteroids directly HIT the warship (3 hits)
- ✅ Warship is a military battleship SVG — not an emoji spaceship
- ✅ Military radar / green phosphor terminal aesthetic
- ✅ Mobile: drag to steer + tap lower area to fire
- ✅ Starfield rendered on canvas (no layout reflows)
- ✅ Game area dimensions stored in ref — no getBoundingClientRect in hot loop
