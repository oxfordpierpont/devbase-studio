# Devbase Studio - MVP Scope

**Version:** 1.0.0-alpha
**Target:** Working prototype in this session
**Goal:** Demonstrate core concept with minimal viable features

---

## MVP Features (Realistic Scope)

### Core Platform
- ✅ Visual drag-and-drop builder
- ✅ 15 essential components (vs 100+ in PRD)
- ✅ 10 core functions (vs 100+ in PRD)
- ✅ 1 UI kit (Modern Minimalist)
- ✅ Code generation (Next.js only for MVP)
- ✅ Vercel deployment (web only)
- ✅ Project management (CRUD)
- ✅ Basic authentication

### Components (15 Essential)
1. Button
2. Text/Heading
3. Input
4. Container
5. Card
6. Image
7. Link
8. Divider
9. Grid
10. Flex
11. Form
12. Textarea
13. Select
14. Checkbox
15. Alert

### Functions (10 Core)
1. Navigate to Page
2. Submit Form
3. Fetch Data (API)
4. Show Alert
5. Set State
6. Local Storage (Get/Set)
7. Validate Form
8. Format Date
9. Format Currency
10. Conditional Render

### Modules (1 Simple)
- **Blog Module**: Posts, Categories, Comments (basic)

### Deployment
- Web only (Vercel)
- No mobile builds in MVP
- Code export to ZIP

---

## Out of Scope for MVP

❌ React Native / Mobile apps (add in v1.1)
❌ Module marketplace (add in v2.0)
❌ Real-time collaboration (add in v2.0)
❌ Multiple UI kits (add in v1.2)
❌ Advanced functions (100+) (add incrementally)
❌ Complex modules (Social Network, Uber, etc.) (add in v2.0+)
❌ AI code generation (add in v3.0)
❌ Mobile app store deployment (add in v1.5)

---

## Technical Stack (MVP)

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- React DnD
- Zustand
- TanStack Query

### Backend
- Supabase (Postgres + Auth)
- Edge Functions

### Deployment
- Vercel (web hosting)
- GitHub (version control)

### Tools
- Turborepo (monorepo)
- Prettier, ESLint
- Vitest (testing)

---

## Success Criteria

✅ User can create account
✅ User can create new project
✅ User can drag components onto canvas
✅ User can configure component properties
✅ User can preview app
✅ User can generate Next.js code
✅ User can deploy to Vercel
✅ Generated app runs correctly

---

## Architecture

```
devbase-studio/
├── apps/
│   └── web/                 # Visual builder (Next.js)
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── config/              # Shared configs
│   └── database/            # Database types & migrations
├── functions/               # Function library
├── modules/                 # Pre-built modules
│   └── blog/               # Blog module
└── generators/              # Code generators
    └── nextjs/             # Next.js generator
```

---

## Timeline Estimate

**This session:** Core infrastructure + visual builder basics
**Week 1-2:** Complete visual builder
**Week 3-4:** Code generation engine
**Week 5-6:** Deployment + testing
**Week 7-8:** Polish + documentation

**Realistic MVP:** 8-12 weeks with dedicated team

---

## Licensing (Resolved)

**Platform:** MIT License (changed from GPL)
**Generated Code:** MIT License
**Reason:** More permissive, better for adoption, no GPL conflicts
