# Project Explorer

An interactive tool for MSc Artificial Intelligence students at Queen's University Belfast to browse, filter, and shortlist dissertation projects for **ECS8056 — Themed Research Project**.

Built from a spreadsheet of 65 projects across 6 research themes from 17 supervisors, this app replaces the experience of scrolling through dense Excel rows with a searchable, filterable interface designed for comparing and narrowing down project choices.

## Features

- **Search** across project titles, descriptions, supervisors, and keywords
- **Filter** by research theme, supervisor, or industry partnership
- **Sort** alphabetically by title, supervisor, or theme
- **Shortlist** projects with persistent storage (localStorage), then compare them side-by-side or copy to clipboard
- **Project details** panel with full descriptions, keywords, and supervisor contact
- **Supervisor profiles** showing all their projects and a link to their QUB Pure page
- **Dark mode** support with theme-coded colour badges per research area

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data

Project and supervisor data lives in `data/projects.json` and `data/supervisors.json`, sourced from the official ECS8056 spreadsheet. Each project includes a title, supervisor, theme, keywords, description, and optional industrial partner.

## Tech Stack

- [Next.js](https://nextjs.org) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4 with OkLCh colour theming
- [shadcn/ui](https://ui.shadcn.com) components
- [Framer Motion](https://motion.dev) for animations
