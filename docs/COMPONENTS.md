# Components Documentation

> **Note:** This file is now located in the `docs/` directory.

## SmartLink
Handles both internal and external links. Internal links use React Router, external links open in a new tab.

**Props:**
- `to` (string): Destination URL or path.
- `children` (ReactNode): Link content.
- `className` (string, optional): CSS classes.
- All other anchor props are supported.

**Usage:**
```tsx
<SmartLink to="/about">About</SmartLink>
<SmartLink to="https://external.com">External</SmartLink>
```

---

## Header
Displays the site logo, navigation, and dark mode toggle.

**Props:**
- `isDarkMode` (boolean): Current dark mode state.
- `toggleDarkMode` (function): Toggles dark mode.

**Usage:**
```tsx
<Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
```

---

## BookCard
Displays a summary card for a book, including cover, title, author, rating, and review date.

**Props:**
- `book` (Book): Book object.

**Usage:**
```tsx
<BookCard book={book} />
```

---

## BookDetail
Shows detailed information and review for a single book.

**Props:** None (uses URL params).

**Usage:**
Route: `/reviews/:id`

---

## ReviewDetail
Shows a detailed review for a book, with options to edit or delete.

**Props:** None (uses URL params).

**Usage:**
Route: `/reviews/:id`

---

## Adding New Components
- Place new reusable components in `src/components/`.
- Use TypeScript and provide prop types/interfaces.
- Add JSDoc comments for all exported functions and components. 