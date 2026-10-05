# Verification — account and admin upgrade

Date: 2026-10-05. Target: Supabase `shoe` / `ipqcxqsjzkbtxpljvdcy`.

| Suite | Result | Scope |
| --- | --- | --- |
| `npm test` | 55 passed | Shoe/cart/catalog validation, UTC paid analytics and revenue snapshots |
| `npm run test:db` | 49 passed | All 31 migrations in PGlite; roles, RLS, owner bootstrap, checkout, inventory, exchanges, reviews and support |
| `npm run test:ui` | 58 passed | Isolated demo interactions, campaign/department links, preloved placement and demo-to-live route boundaries |
| `npm run test:connected` | 23 passed | Supabase HTTP mocked in process; Auth forms, empty/error states and Instagram Reels/photos/albums, playback, metrics and image fallbacks |
| `npm run test:admin` | 23 passed | Protected studio/account routes and real frontend actions with mocked HTTP; customer denial, saved addresses, review persistence, orders, settings and product form |
| `npm run test:management` | 8 passed | Isolated brand management and Instagram connection UI |
| `npm run test:instagram` | 10 passed | Actual Edge handler with mocked provider; admin permission, token validation, mixed-media sync/cache and credential privacy |
| `npm run build` | Passed | Production Vite compilation and local asset bundle |
| Hosted frontend-service integration | 41 passed | Real GoTrue, PostgREST, Storage and RPC calls with temporary random fixture identities; see `ADMIN_VERIFICATION.json` |

The hosted integration scripts are opt-in. They receive ephemeral credentials only over stdin, never from a committed file or command-line argument. The management connector provisions/removes the exact temporary fixtures. They are intentionally excluded from `npm test`. Final cleanup was verified: zero fixture users, admin memberships, sessions, products, categories or uploads remain. The existing verified owner and two real Auth users remain; there is one administrator, seven categories and eighteen brands. The live catalog has no real products or orders yet.

Production CSS inspection confirmed the light sage admin sidebar, white cards and lime login/account/admin actions. The login uses a local shoe photograph through a normal image element, and the legacy clothing/auth overlay styles were removed. This CSS inspection is not a browser screenshot or layout test.

DOM testing does not render a browser. jsdom records the live-entry reload attempt and accessible fallback href but cannot execute full-document navigation. Real browser screenshots, live-browser checkout, actual Instagram provider authorization and SMTP delivery were not tested. Tests do not establish those outcomes.

The Supabase advisor's private/server-only no-policy INFO entries are deliberate deny-by-default tables. Leaked-password protection remains a Free-plan Auth warning: [Supabase password-security documentation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). No paid-plan change was made. Unused indexes on a new store are retained for their intended query paths: [advisor reference](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).
