# SOLEFORM handoff — 4 October 2026

- Site: `appgprj_6ac2525ed44c81918de66fb730f0ba0e`, https://soleform-shoe-store.drsagheer381.chatgpt.site. Existing owner-private audience preserved.
- New Supabase project: `shoe`, reference `ipqcxqsjzkbtxpljvdcy`, region `ap-south-1`, organization AbdulRehman Afzal. Created in the newly attached account on its free plan.
- All 29 source migrations deployed; filenames match the hosted migration ledger. Seven empty shoe/care categories and 18 editable brands added. No sellable demo products, original customers or orders imported.
- Source and production builds use the new modern publishable key. Privileged keys are never included in the frontend.
- Owner slot reserved for the selected `abdulrehmaan.afzal@gmail.com`. It is claimed only after Auth verifies that email; client metadata cannot grant roles. No real owner Auth user has been created and no default password exists.
- Original commerce/admin/customer/support logic retained. Shoe metadata, numeric sizes, unique SKU, condition grades, server delivery fees, stock requests and exchange requests are deployed.
- `instagram-feed` Edge Function deployed (ACTIVE, version 3), with authenticated token connection and optional OAuth. The homepage includes its ready section, awaiting the user's actual account. No credentials/account connection or real media sync has occurred.
- `/brands` and Shop support multiple selected brands in Men, Women and Kids. `/admin/brands` manages names, departments, display order, visibility and deletion while preserving inventory/order records.
- Added scroll reveals, hero details, brand tiles and Instagram controls. Automatic motion and video respect reduced-motion preferences.
- Support migration preserves message ownership and stops for manual review if duplicate threads exist. API security changes are restricted to eleven named store RPCs; unrelated objects are untouched.
- Live PostgreSQL role/commerce checks passed with rollback-only fixtures. Security advisor reports no WARN/ERROR findings. Performance advisor reports only unused-index information on this new empty store.
- 154 local checks pass across logic, PostgreSQL, preview/connected components, admin forms and the actual Instagram handler with mocked external services. Hosted brand access/save/rename/hide/delete/token-privacy checks also passed with rollback-only fixtures. Browser layout QA remains unavailable.
- **Pending:** hosted Auth URL settings, email delivery/recovery and real storage uploads. Dashboard access required sign-in; secure sign-in did not complete. The private site is connected, but customer launch still requires these checks and real inventory.
- See `README.md`, `docs/SHOE_BACKEND.md` and `TEST_RESULTS.md`.
