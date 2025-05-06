# Keiko Reads

A modern book review web app built with React, TypeScript, Supabase, and Tailwind CSS.

## Project Structure

```
keikoreads/
  src/
    assets/         # Static images and icons
    components/     # Reusable React components (e.g., SmartLink, Header, BookCard)
    hooks/          # Custom React hooks
    pages/          # Page-level React components (e.g., Home, BookDetail, ReviewDetail)
    types/          # TypeScript type definitions
    utils/          # Utility functions (e.g., formatters, API clients)
    ...
  public/
    assets/         # All images and icons used in the app
  database/         # SQL and migration scripts
  docs/             # All project documentation (COMPONENTS.md, UTILS.md, etc.)
  supabase/         # Supabase migrations and SQL scripts
  ...
```

## General Development Rules

- **Internal links** (within the app) must use the `SmartLink` component or React Router's `Link` (if not using SmartLink).
- **External links** (to other domains) must use the `SmartLink` component, which automatically opens them in a new tab with `rel="noopener noreferrer"`.
- All navigation and external links should use `SmartLink` for consistency.
- Use utility functions from `src/utils/formatters.ts` for formatting dates, numbers, and links.
- Use TypeScript for all new files and components.
- Use functional React components and hooks.
- Use Tailwind CSS for styling.
- Keep business logic in `src/utils` or `src/services` (if created), not in components.
- Use environment variables for secrets and configuration.
- Use clear, descriptive names for files, components, and variables.

## Key Components

- See `docs/COMPONENTS.md` for detailed documentation on each major component.

## Utilities

- See `docs/UTILS.md` for documentation on utility functions.

## Contributing

- Please see `docs/CONTRIBUTING.md` for guidelines on adding new features, components, or pages.

## Authentication

The application uses Supabase for authentication with the following features:

- **Email/Password Authentication**: Users can sign up and sign in with email and password
- **OAuth Authentication**: Login with Google is supported
- **Protected Routes**: Certain routes require authentication
- **Email Verification**: Email-based signups require verification
- **Profile Management**: User profiles are stored in a separate table

### Authentication Flow

1. Users can sign up with email/password or OAuth (Google)
2. Email signups require verification via email link
3. OAuth signups are automatically verified (Google has already verified the email)
4. All authentication state is managed via the AuthContext
5. Protected routes use the ProtectedRoute component

### Testing Authentication

To clear all users for testing purposes:

1. Set up the required environment variables:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key
   VITE_SUPABASE_URL=your_supabase_url
   ```

2. Run the clearUsers.js script:
   ```
   node scripts/clearUsers.js
   ```

This script will:
- Clear all profiles from the profiles table
- Delete all users from the auth.users table (except for admin@example.com)
- Log the process to the console

**Note**: The script requires a Supabase service role key with admin permissions.
