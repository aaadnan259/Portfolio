# Project Plan: Portfolio Audit & Improvements

**Goal:** Execute the comprehensive code review and improvements audit from Comet Browser in manageable sprints.

## 🎯 Strategic Decisions
- **Testing Approach:** Build out local tests thoroughly first before wiring up the GitHub Actions CI/CD workflow.
- **Iconography:** Migrate from external Devicons CDN to local SVG files to maintain the recognizable tech stack colors.
- **Error Monitoring:** A simple structured server logger will be utilized (no third-party telemetry services).
- **Environment Variables:** Adopt a Zod schema in `src/lib/env.ts` aligned strictly with existing Vercel deployments.

---

## 🏃 Sprint 1: Critical Updates & Foundation
- [ ] **Dependencies:** Run `npm update` and selectively update critical packages (`@vercel/speed-insights`, `react-hook-form`, `resend`, `playwright`).
- [ ] **TypeScript:** Update `tsconfig.json` to enable `strict` mode (`strictNullChecks`, `noImplicitAny`, etc.).
- [ ] **Environment Variables:** Implement `src/lib/env.ts` using Zod for robust runtime validation of Vercel secrets.
- [ ] **Documentation:** Create `.env.example` to establish configuration baseline.

## 🏃 Sprint 2: Security, Config, & DevX
- [ ] **Next.js Config:** Update `next.config.ts` (enable compression, caching, unoptimized images, etc.).
- [ ] **Security Headers:** Add `Content-Security-Policy` (CSP) and strict security headers via `next.config.ts`.
- [ ] **Linting:** Configure specific ESLint rules (`react-hooks/exhaustive-deps`, etc.) in `eslint.config.mjs`.
- [ ] **Pre-commit Hooks:** Install and configure Husky and `lint-staged` to enforce code quality before commits.

## 🏃 Sprint 3: Performance & Assets
- [ ] **Speed Insights:** Fix `@vercel/speed-insights` configuration in `layout.tsx` to resolve the mobile "No data available" issue.
- [ ] **Iconography:** Remove external Devicons CDN import from `globals.css` and migrate to local SVG files.
- [ ] **Error Monitoring:** Build a simple structured server logger module for error tracking without third-party tools.

## 🏃 Sprint 4: Testing & CI/CD
- [ ] **Unit Tests:** Add comprehensive unit tests and Component tests locally using Vitest and React Testing Library (focusing on API routes and UI components).
- [ ] **E2E Tests:** Ensure local Playwright test suite covers critical flows and navigation.
- [ ] **CI/CD:** Once local tests are solid, create `.github/workflows/test-and-lint.yml` to run tests and linting on push/PRs.

---

**Next steps for user:**
1. Review this plan.
2. Confirm if we are ready to kick off **Sprint 1**.
3. We will iterate using `/create` or by updating the codebase step-by-step per sprint.
