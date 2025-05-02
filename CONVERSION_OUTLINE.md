# Keiko Reads React Conversion Outline

---

## Phase 1: Audit & Clean Up
- [x] **1.1** Scan the codebase for any remaining Wix dependencies or artifacts.
- [x] **1.2** Remove all static HTML files (except `index.html` for Vite).
- [x] **1.3** Move all static assets (images, etc.) to `public/assets/` and update all references.

---

## Phase 2: Centralized Layout & Consistency
- [x] **2.1** Create a `Layout` component that includes:
  - [x] Header (with logo, navigation, dark mode toggle)
  - [x] Main content container (consistent max width, padding, background)
  - [x] Footer
- [x] **2.2** Refactor all pages to use the `Layout` component for uniform width and structure.

---

## Phase 3: Routing & Navigation
- [ ] **3.1** Centralize all routes in a single file (e.g., `src/routes.tsx`).
- [ ] **3.2** Replace all internal `<a>` tags with `<Link>` from `react-router-dom`.
- [ ] **3.3** Ensure all navigation and page links work correctly.

---

## Phase 4: Tailwind Conversion & UI Polish
- [x] **4.1** Convert any remaining static HTML/CSS to Tailwind-based React components.
- [x] **4.2** Replace custom CSS with Tailwind classes where possible.
- [x] **4.3** Polish all UI elements for a professional, cohesive look.

---

## Phase 5: Theming & Background
- [ ] **5.1** Integrate a rose-gold particles background using a React library (e.g., `react-tsparticles`).
- [ ] **5.2** Ensure the background and theme are consistent across all pages.
- [ ] **5.3** Polish and finalize dark mode support.

---

## Phase 6: Book Reviews System
- [ ] **6.1** Create a `ReviewsProvider` (React context) for managing review data.
- [ ] **6.2** Store reviews in local storage (with UUIDs for each entry).
- [ ] **6.3** Build a `/reviews` page with:
  - [ ] Sort/filter controls (by date, title, author, etc.)
  - [ ] Time range filters (day/week/month/6mo/year)
  - [ ] Search functionality
  - [ ] "Add Review" button (UI only for now)
- [ ] **6.4** Ensure each review has a persistent UUID.

---

## Phase 7: Centralized Utilities
- [ ] **7.1** Implement a centralized logger utility (type-safe, browser console notifications).
- [ ] **7.2** Add a global error boundary for catching and displaying errors.
- [ ] **7.3** Centralize type definitions and dependency management.

---

## Phase 8: Data Flow & Future API Integration
- [ ] **8.1** Ensure all data flows through the `ReviewsProvider` (top-down).
- [ ] **8.2** Prepare the provider for future Supabase integration (single interface for data access).

---

## Phase 9: Final Polish & QA
- [ ] **9.1** Test all links, navigation, and page layouts for consistency.
- [ ] **9.2** Ensure all pages use the shared layout and have uniform width.
- [ ] **9.3** Review and polish all UI elements for a beautiful, finished look.
- [ ] **9.4** Confirm dark mode and background work everywhere.

---

## Phase 10: Launch-Ready
- [ ] **10.1** Remove any unused files, code, or dependencies.
- [ ] **10.2** Update documentation and README.
- [ ] **10.3** Prepare for deployment (build, test, etc.).

---

**How to Use This Outline:**
- Tackle each phase in order, checking off tasks as you go.
- If you need code examples or want to automate any step, just ask for that section and I'll provide the implementation. 