# SOLEFORM — shoe store

A footwear conversion of the supplied React/Vite clothing-store source, with ivory, charcoal and lime styling, an original photographic campaign, a Studio concept feature, animated reveals and a responsive storefront. The new landing design, asset prompts and verification are documented in [docs/LANDING_UPGRADE.md](docs/LANDING_UPGRADE.md).

## Connected release

The frontend uses the new **shoe** Supabase project, reference `ipqcxqsjzkbtxpljvdcy`, in `ap-south-1`. All 29 migrations, seven empty shoe/care categories and 18 editable brand categories are deployed. The newly attached account's default project and the original clothing databases were not modified.

The storefront now opens a clearly labelled demo collection: **60 original shoe concepts, 20 each for Men, Women and Kids**, with different photos, descriptions and PKR prices. Choose **Live store** to browse the real Supabase inventory. `?catalog=demo` and `?catalog=live` are explicit mode links; the choice is remembered for that tab. Demo bags/favourites are isolated and demo checkout is disabled. Live catalog errors never fall back to samples. Account/admin entry points and email callbacks use live Auth on a fresh page load; `/admin?catalog=live` opens real management.

The chosen owner email is `abdulrehmaan.afzal@gmail.com`. Register and verify this email to claim the single owner/admin slot, then open `/admin?catalog=live`. The server ignores client role metadata. There is no default password and no real owner Auth account has been created on your behalf.

**Auth dashboard configuration is still pending:** the dashboard required sign-in and the secure sign-in attempt did not complete. Verify hosted site URL, redirect allowlist, confirmation delivery and password recovery before launch. Exact intended settings are in `docs/SHOE_BACKEND.md`. Live Auth, Data API and object-upload verification is recorded in `TEST_RESULTS.md`. Confirmation/recovery email delivery and hosted redirect configuration still need verification.

## Start from source

Use Node.js 22.12+:

```sh
npm ci
npm run dev
```

Open http://localhost:4173. Build with `npm run build`; serve `dist` with SPA fallback to `index.html`.

`src/config/backend.public.json` contains only the new project's public URL and modern publishable key. Override both through `.env.local` using `.env.example` if needed. Vite embeds these values at build time, so rebuild after changing them. Never put a service-role/secret key here. Set `VITE_STORE_PREVIEW=true` to force the isolated demo, or `false` to default to live browsing. Leave it unset to use the deployed demo default and the catalog switch.

## Footwear additions

- Sixty different original concept shoes, 20 per department; twenty-pair homepage tabs, Shop pages and related collections.
- Original campaign photography and distinct Men/Women/Kids lifestyle collections, with locally bundled WebP assets.
- A homepage product rail with swipe/scroll, Previous/Next, keyboard boundaries, accessible department tabs and reduced-motion support.
- Original studio catalog photography, explicit PKR prices, individual material/colour descriptions and functional size/bag previews.
- Compact horizontal brand checkbox rows fix the supplied screenshot on desktop and mobile.
- Brand directory for Men, Women and Kids, with 18 initial brands including Nike, Gucci, Adidas and New Balance.
- Select four or more brands together on `/brands` or in Shop. Repeated `brand` URL parameters combine those brands; department, size, stock and other filters still apply.
- Admin `/admin/brands` supports adding, renaming, hiding, department assignment and deletion. Renames update linked product labels; deletion keeps products, stock and order history.
- Homepage Instagram moments, actual Reel playback, swipe/next/previous, pause, more pages and optional product links. Connect your own account at `/admin/instagram-reels`; an unconnected store shows a clearly labelled waiting state.
- Secure admin token form and optional account authorization. Tokens stay in the server-only connection table and never enter browser storage or the frontend bundle.
- Gentle scroll reveals, animated hero details and responsive brand cards; reduced-motion preferences disable automatic motion/video playback.
- Brand, category, department, condition, width, price and sale filters; EU, UK, US-M and US-W size labels.
- Exact size/colour stock filtering; adult unisex pairs stay out of kids browsing.
- Condition/fit notes, material, previous price and optional unique SKU per variant.
- Sold-out sizes cannot be bought; preloved stock is limited to one actual pair per variant.
- Guest bag import on sign-in, account favourites, size stock requests and delivered-order size exchanges.
- Admin delivery settings default to PKR 300 delivery, free from PKR 12,000, and a seven-day exchange window.
- Checkout revalidates stock and calculates PKR prices/delivery on the server. Customer request UUIDs prevent duplicate orders.

Retained workflows include registration/login/recovery, profiles and addresses, carts, orders/status history, manual COD payment records, protected admin, product photographs, categories/accessories, inventory, customers, analytics, purchased-only moderated reviews, support conversations and optional Instagram integration.

## Database maintenance

All migration versions match the hosted ledger. Link the CLI to this exact project before applying future changes:

```sh
npx supabase link --project-ref ipqcxqsjzkbtxpljvdcy
npx supabase db push
```

Do not run this fresh-install history against an existing clothing database. `supabase/seed.sql` contains categories only. See `docs/SHOE_BACKEND.md` for owner access, schema and Auth configuration.

## Checks

```sh
npm test
npm run test:db
npm run test:ui
npm run test:connected
npm run test:instagram
npm run test:management
npm run build
```

The local database suite uses PGlite with auth/storage fixtures. Component suites use jsdom; the connected suite mocks all HTTP responses and sends no email. A separate rollback-only SQL suite was run against the hosted shoe database. See `TEST_RESULTS.md` for evidence and verification limits. Browser visual QA was unavailable.

## Launch limits

Customer launch requires real inventory, verified hosted Auth settings/email and a customer checkout through the browser. The site's existing owner-private audience is preserved.

Cash on delivery/manual payment records are supported; no online payment gateway is connected. Stock alerts save requests and show availability, with an admin inbox; automatic alert emails are not enabled. Exchanges require review and do not automatically reserve replacements, refund money or restock returns. Instagram account connection is still required; a supplied valid token enables the feed and starts media sync. Provider authorization/media fetch has not been tested with a real account. See `docs/INSTAGRAM_FEED_SETUP.md`.

Concept imagery and sample listings are for demonstration; the seed never inserts them. Asset sources are documented in `docs/ASSETS.md`.
