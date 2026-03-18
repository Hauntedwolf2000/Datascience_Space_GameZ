# ⚓ Data Science Warship Defender

> **An educational arcade game that teaches Data Science concepts through space combat.**
> Answer questions to earn ammo. Shoot asteroids. Defend the galaxy.

---

## 🎮 Live Demo

> http://localhost:3000/game/

---

## 📸 Overview

| Feature | Detail |
|---|---|
| 🎯 Questions | 30 Data Science questions across 3 levels |
| 🚢 Warships | 5 unique ships, unlockable with coins |
| 💥 Mechanic | Asteroids hit your ship → lose hull points |
| 🧠 Learning | Data Basics → Stats & Viz → ML Basics |
| 📱 Platform | Desktop / Tablet (900px+ screen required) |

---

## 🕹️ How to Play

1. **Answer a question** in the right panel to earn 🔫 ammo
2. **Press SPACE** (or the FIRE button) to shoot asteroids
3. Asteroids that **miss** your warship do **no damage**
4. Only **direct hits** damage your hull — you have **3 hull points**
5. Lose all 3 → **Hull Breach → Game Over**
6. Every **50 points** → level up (asteroids get faster)
7. Earn 🪙 **coins** (score ÷ 5) to unlock new warships

### Controls

| Action | Desktop | Tablet |
|---|---|---|
| Move ship | Arrow keys or W A S D | Drag finger on game area |
| Fire | SPACE bar | Tap game area / FIRE button |
| Pause game | Hover over question panel | — |
| Switch ship | Click ⚓ SHIP button | Click ⚓ SHIP button |

---

## 🚢 Warships

| Ship | Cost | Class | Highlight |
|---|---|---|---|
| CSS Corvette | Free | Scout | Fast, single cannon |
| DSS Destroyer | 🪙 50 | Assault | Twin cannons |
| MLS Cruiser | 🪙 150 | Heavy | Triple cannons, swept wings |
| NNS Battleship | 🪙 300 | Dreadnought | Quad cannons, heavy armor |
| AI Phantom | 🪙 500 | Stealth | Dashed hull, glowing eyes |

---

## 🧠 Question Levels

| Level | Topic | Speed |
|---|---|---|
| 1 — DATA BASICS | CSV, Pandas, DataFrames, null values | Slow |
| 2 — STATS & VIZ | Mean, median, charts, Matplotlib, Seaborn | Medium |
| 3 — ML BASICS | Supervised learning, overfitting, Scikit-learn | Fast |

---

## 💻 Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 🚀 Deploy to Netlify (Easiest — 2 minutes)

### Option A — Drag & Drop (no account needed)

```bash
npm install
npm run build
```

Then drag the `/out` folder to **[app.netlify.com/drop](https://app.netlify.com/drop)**  
You get a live public URL instantly. ✅

---

### Option B — Netlify + GitHub (auto-deploy on every push)

**Step 1 — Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ds-warship-defender.git
git branch -M main
git push -u origin main
```

**Step 2 — Connect to Netlify**

1. Go to **[app.netlify.com](https://app.netlify.com)** → **Add new site** → **Import from Git**
2. Connect GitHub → select your repo
3. Settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `out`
4. Click **Deploy site** ✅

Every `git push` to `main` will auto-deploy from now on.

---

## 🐙 Deploy to GitHub Pages (Free)

**Step 1 — Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ds-warship-defender.git
git branch -M main
git push -u origin main
```

**Step 2 — Enable GitHub Pages**

1. Open your repo on GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

**Step 3 — Done!**

The `.github/workflows/deploy.yml` file handles everything automatically.  
Every push to `main` triggers a new build and deploy.

🌐 Your site: `https://YOUR_USERNAME.github.io/ds-warship-defender/`

> ⚠️ **Important for GitHub Pages:**  
> If your URL has a subfolder (e.g. `/ds-warship-defender/`), add these two lines to `next.config.js`:
> ```js
> basePath: "/ds-warship-defender",
> assetPrefix: "/ds-warship-defender/",
> ```
> Replace `ds-warship-defender` with your actual repo name.

---

## 🛠️ Fix: node_modules pushed to GitHub by mistake

If you get a **"file exceeds 100MB"** error when pushing:

```bash
git rm -r --cached node_modules
git rm -r --cached .next
git rm -r --cached out
git add .
git commit -m "fix: remove node_modules from git"
git push origin main --force
```

---

## ➕ Adding Questions & Levels

All questions live in `/data/questions.ts` inside the `LEVEL_QUESTION_BANK` array.

### Add a question to an existing level:

```ts
{
  id: 111,              // Must be unique
  question: "Your question here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  answer: 0,            // 0 = A, 1 = B, 2 = C, 3 = D
}
```

### Add a completely new level:

```ts
{
  level: 4,
  label: "DEEP LEARNING",
  asteroidSpeed: 2.6,       // Higher = faster asteroids
  spawnInterval: 1500,      // Lower = more frequent spawns (ms)
  questions: [
    {
      id: 401,
      question: "What is a neural network?",
      options: [
        "Interconnected computation nodes",
        "A type of CSV file",
        "A Python loop",
        "A chart type",
      ],
      answer: 0,
    },
    // Add at least 5–10 questions per level
  ],
}
```

---

## 📁 Project Structure

```
/app
  page.tsx          ← Landing page (ship selector, radar, boot screen)
  layout.tsx        ← Root layout (clears game data on reload)
  /game
    page.tsx        ← Game page (all game logic lives here)

/data
  questions.ts      ← Question bank + level configs (edit this!)

/styles
  globals.css       ← Global styles, military terminal theme

/.github/workflows
  deploy.yml        ← GitHub Pages auto-deploy workflow

netlify.toml        ← Netlify deploy config
next.config.js      ← Next.js static export config
```

---

## 🧱 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework, static export |
| React 18 | UI components |
| TypeScript | Type safety |
| Framer Motion | Animations |
| Tailwind CSS | Utility styles |
| requestAnimationFrame | 60fps game loop |
| localStorage | Coin & ship persistence (reset on reload) |

---

## 📜 License

MIT — free to use, modify and deploy.
