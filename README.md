# Professional Dental Clinic

> **Demo / practice project.** This is not a real clinic. The phone numbers, doctor profile, reviews and prices are placeholders. Please do not call or send real personal data.

A full-stack dental clinic website with an appointment request form and a private admin dashboard for managing requests.

**Live demo:** `ADD-YOUR-VERCEL-URL-HERE`

## Features

**Public site**
- Treatments, dentist profile, reviews, location and opening hours
- Appointment request form (`/book`) with validation and spam protection
- Emergency call banner
- Privacy page

**Admin dashboard (`/admin`)**
- Single admin login (Supabase Auth)
- Appointment list with status filter (new, confirmed, cancelled), search by name or phone, and pagination
- Create, edit (status and notes) and delete appointments
- One-tap Call and WhatsApp links
- Responsive layout (cards on mobile, table on desktop)

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (React) |
| Database and auth | Supabase (PostgreSQL, Auth, Row Level Security) |
| Session handling | `@supabase/ssr` (cookie-based sessions) |
| Validation | Zod (shared schema for form, search params and admin actions) |
| Bot protection | Cloudflare Turnstile (booking form and admin login) |
| Email notifications | Transactional email on new requests |
| Hosting | Vercel |

## Security measures

- **Row Level Security:** the `anon` role has no access to the `appointments` table. Only one policy exists, allowing the authenticated admin full access.
- **Server-side admin guard:** every `/admin` page and server action checks that the user is logged in and that `user.id` matches `ADMIN_USER_ID`. Hiding the UI alone is not relied upon.
- **No secret keys in client code:** only the publishable key is used in the app. The build output is checked for leaked secrets.
- **Generic login error:** "Invalid email or password", so account existence is not revealed.
- **Turnstile** on the public form and admin login, verified on the server.
- **Security headers and CSP** configured in `next.config.ts`.
- **`/admin` is not indexed:** `noindex`, `Cache-Control: no-store`, disallowed in `robots.txt`, excluded from the sitemap.
- **Sign-ups disabled** in Supabase Auth; one manually created admin user.
- **No personal data in logs.**

## Getting started

```bash
git clone <your-repo-url>
cd dental-clinic
npm install
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

Create `.env.local` (never commit it):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
ADMIN_USER_ID=
# plus the Turnstile and email keys used by the booking form
```

- `NEXT_PUBLIC_*` values are public by design.
- `ADMIN_USER_ID` is the Supabase Auth user ID allowed to use `/admin`.
- Set the same variables in Vercel before deploying.

### Database

Create an `appointments` table in Supabase with Row Level Security enabled, no grants to `anon`, and a single policy for the authenticated admin user. The table stores name, phone, treatment, preferred time, status, notes and `created_at`.

## Project structure

```
src/
  app/
    book/            public booking form
    admin/           login, dashboard, appointment actions
  lib/supabase/      server-side Supabase client
```

## Credits

- Hero image: `ADD-SOURCE-AND-LICENSE-HERE`
- Built with the help of AI-assisted tooling; design, testing and security review done manually.

## Limitations

This is a practice project. Not included: slot-based booking, multiple admins, patient records, file uploads, separate dev and production databases.

## License

For learning and portfolio use only.
