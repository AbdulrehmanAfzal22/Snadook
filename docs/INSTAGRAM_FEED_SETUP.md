# Connect your store Instagram

The homepage's “Worn & loved.” portrait rail includes Instagram Reels, photo posts and carousel covers. Until the store account is connected, it shows a clearly labelled waiting section with decorative shoe imagery; these are not fabricated Instagram posts. Real media appears in **Live store**; the sixty-pair demo is isolated from the backend.

The admin route is `/admin/instagram-reels`. Sign in as the verified store owner. No actual Instagram account or credential has been supplied in this release.

## Access-token connection

1. Enter your actual Instagram username and matching profile URL in Feed configuration, for example `your.store` and `https://www.instagram.com/your.store/`.
2. Paste an Instagram API access token for that same eligible Business/Creator account into **Connect with an access token**. This expects an Instagram Login token usable with `graph.instagram.com`, not a Facebook Page token.
3. If you know the provider's expiry, enter it. Otherwise leave it blank. Unknown expiry remains unknown; no invented expiration is stored.
4. Click **Connect token & sync**. The server validates the profile and account match, saves the credential privately, enables the feed and refreshes media. A media-permission failure is reported; it is not shown as a successful sync.
5. Use **Refresh Instagram Feed** to resync. Feed configuration controls enabled state, card counts, cache size and automatic playback interval. Synced moments can link to a product or a collection/shop destination.

The input is masked and cleared after the connection attempt. It is never saved in browser storage or a frontend environment file. The server's connection table has no anonymous/authenticated role access. Replacing or submitting a token requires a verified Auth identity and admin membership before any provider request is made. Provider failures do not echo token values. Do not put tokens in chat, frontend code or source control.

The server automatically refreshes cached media on storefront requests when its one-hour cache expires; there is no scraping. Visitors see only public media fields. Automatic carousel/video playback stops for reduced-motion preferences, paused controls, hidden pages and off-screen sections. Visitors can still explicitly play a video or open its Instagram permalink.

When a manually supplied token has unknown expiry, replace it here if it expires. A valid known-expiry or OAuth connection retains the existing refresh path. Disconnect hides cached moments and disables the feed. If an operator configured the optional `INSTAGRAM_ACCESS_TOKEN` server secret, remove that secret as well when retiring the account; this deployment has no such configured credential.

## Optional Instagram account authorization

Configure `META_APP_ID` and `META_APP_SECRET` as Edge Function secrets for official account authorization. Allow this exact callback in the Meta app:

`https://ipqcxqsjzkbtxpljvdcy.supabase.co/functions/v1/instagram-feed?action=oauth-callback`

The configured username must match the authorized account. The callback checks a stored, expiring state and enables the feed after connecting. Server credentials never enter the frontend.

Consult the provider's current [Instagram Login setup](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/) for token generation, account eligibility, app mode and permissions. The function targets Graph API v25.0 and pins supabase-js 2.57.4.

## Release verification

`instagram-feed` is ACTIVE, version 3, in the new `shoe` Supabase project. Its actual handler passed ten mocked-service checks for unauthorized access, profile mismatch, invalid expiry, private token storage, sanitized errors, mixed Reel/photo/album sync and cached public credential privacy. Card/avatar/caption/metric rendering, image fallbacks, keyboard browsing, explicit playback and paging passed component checks. A real account, token authorization, actual provider media sync and browser playback remain unverified until the store connects its own credential. Metrics appear only when actually returned by Instagram. Carousel cards show the first media image; **View Post** opens the complete album on Instagram.
