# Contributing Guidelines

> **Note:** This file is now located in the `docs/` directory.

Thank you for considering contributing to Keiko Reads!

## General Guidelines
- Follow the rules and conventions outlined in the `README.md`.
- Use TypeScript for all new files and components.
- Use functional React components and hooks.
- Use Tailwind CSS for styling.
- Keep business logic in `src/utils` or `src/services` (if created), not in components.
- Use clear, descriptive names for files, components, and variables.

## Adding New Components
- Place new reusable components in `src/components/`.
- Use TypeScript and provide prop types/interfaces.
- Add JSDoc comments for all exported functions and components.
- Document new components in `docs/COMPONENTS.md`.

## Adding New Pages
- Place new page components in `src/pages/`.
- Use TypeScript and provide prop types/interfaces.
- Add JSDoc comments for all exported functions and components.
- Update routing in `src/routes.tsx` as needed.

## Adding Utilities
- Place new utility functions in `src/utils/`.
- Document new utilities in `docs/UTILS.md`.

## Link Handling
- Use the `SmartLink` component for all navigation and external links.
- Internal links (within the app) must use `SmartLink` or React Router's `Link` (if not using SmartLink).
- External links (to other domains) must use `SmartLink`, which opens them in a new tab with `rel="noopener noreferrer"`.

## Pull Requests
- Ensure your code passes linting and builds successfully.
- Write clear, descriptive commit messages.
- Reference related issues or feature requests in your PR description.
- Be open to feedback and code review. 