# WiseClick Kids 🛡️

> Cybersecurity education for children aged 7–14 — interactive modules, games, stories, and a parent/teacher dashboard.

---

## Stack

- **Next.js 15** — App Router, React Server Components
- **Supabase** — Auth, Postgres database, Row Level Security
- **Tailwind CSS** — Utility styling
- **Vercel** — Deployment (recommended)

---

## Quick Start

### 1. Clone & install

```bash
unzip wiseclick-kids.zip
cd wiseclick-kids
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Dashboard → SQL Editor → paste the complete content of `supabase/schema.sql` → Run
3. Dashboard → Settings → API → copy **Project URL** and **anon public** key

### 3. Configure environment

```bash
cp .env.example .env.local
# Fill in your Supabase URL and anon key
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel

```bash
npx vercel
# Add the 2 env vars in Vercel → Settings → Environment Variables
```

---

## User Flows

```
/login     Register or sign in (Supabase Auth)
     ↓
/          Smart router
     ↓
/setup     Create child profile / switch child
     ↓
/kids      Child home — XP, badges, progress
     ├── /kids/modules      7 learning modules
     ├── /kids/story        3 interactive stories
     ├── /kids/games        4 mini-games
     ├── /kids/quiz         10-question quiz
     └── /kids/challenges   Achievement challenges

/parent    Parent panel (PIN-locked)
/teacher   Teacher dashboard — classes, students, progress
```

---

## Database Schema

| Table | Purpose |
|---|---|
| `families` | One per family, linked to auth.users |
| `children` | 1-N children per family |
| `module_progress` | Progress per child per module |
| `badges` | Earned badges per child |
| `teachers` | Teacher accounts |
| `classes` | Classes created by teachers |
| `class_children` | Students enrolled in a class |

All tables have **Row Level Security** — families see only their own data.

### Important Supabase setup

Use the current [schema.sql](./supabase/schema.sql) as the only script to paste into a new Supabase project. It creates the tables, signup profiles, indexes, RLS policies, and the secure class-code enrollment function.

For an older development database, run [reset.sql](./supabase/reset.sql) first and then run `schema.sql`. `reset.sql` permanently deletes WiseClick application data but keeps Supabase Auth users; never run it in production.

---

## Content

**7 modules** — strangers online, passwords, cyberbullying, safe browsing, personal info, screen time, ABC cybersecurity vocabulary (A→Z)

**13 badges** — earned by completing modules, quizzes, stories, games, and streaks

**3 interactive stories** — branching narratives with choices and XP

**4 mini-games** — password strength, safe/unsafe sorting, phishing detector, quiz battle

---

## Monetization

Recommended freemium model:

| Tier | Price | Content |
|---|---|---|
| Free | €0 | 2 modules, 1 story, basic progress |
| Premium | €4.99/mo or €39/yr | All 7 modules, full parent panel, all badges |
| School | €199/yr | Multi-class teacher dashboard, progress reports |

To add Stripe: `npm install stripe @stripe/stripe-js` then add `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to env.

---

## Legal (required for kids apps)

- **GDPR-K / COPPA** — parental consent for users under 13
- **No advertising** — never add ads to a children's product
- **Privacy Policy** — required before launch — use [Iubenda](https://iubenda.com) or [Termly](https://termly.io)
- **Data minimization** — only email + password collected at signup

---

## Roadmap

- [ ] Stripe payments + premium content gate
- [ ] Email verification
- [ ] Arabic + English language support
- [ ] PDF progress reports for teachers
- [ ] Admin super-dashboard
- [ ] Mobile app (Capacitor)
