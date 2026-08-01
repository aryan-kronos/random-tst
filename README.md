# 🎙️ Verbalis — Master of Speech

> Learn deeply. Speak with authority. In sixty seconds.

Verbalis is my little gym for the voice. The idea is simple: draw a random topic
you know nothing about, learn it properly for a few minutes, and then explain it
out loud — clearly, confidently, in just 60 seconds. Do that daily and you stop
freezing in conversations, interviews, classrooms, everywhere.

I built this for myself because I kept saying "I'll practice speaking tomorrow."
Tomorrow never came. So I made tomorrow into a website. 😄

---

## ✨ What's inside

- **🎰 The Topic Oracle** — a roulette that spins across 32 hand-written topics
  in 9 knowledge spheres (philosophy, science, art, history, nature, technology,
  life, society, business). Pick a difficulty: *Gentle*, *Moderate* or *Bold*.
- **📚 A real masterclass per topic** — not just a title and good luck. Each
  topic comes with a cinematic cover, a storytelling arc, key pillars, deep
  dives, surprising facts, elevated vocabulary and a custom 60-second speech
  blueprint with timestamps.
- **🎧 Studio voice narration** — pre-rendered, human-sounding narrations (no
  robotic browser TTS, I promise) with a seek bar, ±10s skip, speed control and
  a restart button. More topics get their studio voice every batch.
- **📒 Handwritten study notes** — generated, inked desk-pages with washi tape,
  highlighter streaks and little doodles, like the notes you'd pass to a friend
  before an exam.
- **⏱️ The 60-second arena** — a circular timer with your blueprint cues right
  beside it: hook in 10s, core in 35s, close strong.
- **🏆 Progress that feels good** — XP, 10 orator ranks from *Nervous Novice*
  upwards, streaks, mastery checklist and a session history. My personal
  motivation hack.

---

## 🛠️ Tech stack

- **React 19 + TypeScript** — the whole UI is one state machine with four
  stages: dashboard → masterclass → speak → victory
- **Vite 7** — builds to a single self-contained HTML file
  (`vite-plugin-singlefile`), media included
- **Tailwind CSS 4** — the warm paper/cream aesthetic you see
- **Framer Motion** — roulette physics, reveals and celebrations
- **Web Audio API** — ticks, chimes and the victory fanfare are synthesized in
  code, no audio files needed for those

---

## 🚀 Run it locally

```bash
# clone this repo
git clone https://github.com/aryan-kronos/random-tst.git
cd random-tst

# install dependencies
npm install

# start the dev server
npm run dev
```

Then open http://localhost:5173 and start talking to your screen. Neighbours
may have questions. 🗣️

### Build for production

```bash
npm run build      # outputs one single dist/index.html
npm run preview    # serve the production build locally
```

The build inlines everything (JS, CSS, studio narrations, note art) into a
single HTML file, so the `dist/index.html` you get works literally anywhere —
even opened straight from your file manager.

---

## ☁️ Deployment

Hosted on **Vercel** — connected to this repo, so every push to `main`
redeploys automatically. Zero config needed; Vercel detects the Vite project
on its own.

---

## 🗺️ Roadmap (the honest one)

- [x] 32 curated topics with full masterclass content
- [x] Studio voice + handwritten note art system
- [x] 10/32 topics upgraded with studio narration & inked notes
- [ ] Remaining 22 topics: studio voices + note pages (in progress!)
- [ ] Record-your-own-voice practice sessions
- [ ] Weekly report card of your speaking momentum
- [ ] Maybe Hindi + more languages for narrations

---

## 🤝 Contributing

This is a personal learning project, but if you spot something broken or have
a topic idea that would make a killer 60-second speech, feel free to open an
issue. Kind humans only. 💛

---

<p align="center">
  Built with ☕, stubbornness, and a lot of practice speeches nobody heard.<br>
  <b>aryan-kronos</b>
</p>
