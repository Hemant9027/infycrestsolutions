# Security Review — InfyCrest Solutions

**Review date:** 2026-10-21  
**Scope:** Read-only review of the accessible repository and locally available checks  
**Production impact:** Not established. Production hosting, environment, DNS, logs, and vendor detection details were unavailable.

## Executive summary

The review found no confirmed malicious payload, active redirect, or reputation-evasion behavior in the accessible source. It did identify a **high-severity, deployment-conditional admin authentication risk**: authentication code has insecure fallback configuration. Live exploitability depends on whether production has explicitly set the relevant secrets and credentials. No production configuration was accessed.

A `localhost` widget script reference appears in the homepage source outside its returned JSX tree. In-memory transpilation indicated that it is not rendered; it is not evidence that visitors load or execute that script.

These results do not establish the safety of the deployed website or explain Gridinsoft/Bitdefender's detection. No files were changed during the investigation; this report was created afterward at the user's request.

## Findings ranked by severity

### 1. Admin authentication can fail open under missing deployment configuration

- **Severity:** High
- **Status:** Confirmed code-level risk; production exploitability is conditional and unverified.
- **Location:** `src/lib/admin/auth.ts`, lines 7, 14–28, 38–43.
- **Evidence:** The code includes a fixed fallback for signing/verifying admin sessions if `ADMIN_SESSION_SECRET` is absent, and fallback admin credentials if the corresponding environment variables are absent. `currentAdmin()` trusts a valid signed, unexpired token without confirming the username maps to an existing admin profile. Admin routes rely on `currentAdmin()` for authorization.
- **Impact:** If production uses the fallback session secret, a party who knows it may be able to forge a session accepted by guarded admin endpoints. Default credentials can also permit login if the relevant production variables are unset. This could expose admin operations and content.
- **Related risk:** Blog content is rendered through HTML sinks in `src/app/blog/[slug]/page.tsx` (lines 121–127, 230–233). The sanitizer in `src/lib/blog.ts` (lines 292–293) does not remove unquoted event-handler attributes. This could increase impact if an attacker obtains content-publishing access. No malicious content or exploitation was established.
- **Recommended remediation:** Remove insecure fallback secrets and credentials. Require strong, unique values and fail closed when missing. Rotate the production admin password and session secret if any fallback or default was used. Replace regex-based HTML sanitization with a maintained allowlist sanitizer and safely serialize data embedded in script elements.
- **Verification:** In authorized staging, verify startup fails when required configuration is absent, default credentials do not work, forged/expired sessions are rejected, and unauthenticated admin requests are denied. Test content sanitization using benign fixtures, including an unquoted event-handler attribute.

### 2. Homepage contains a non-rendered localhost script reference

- **Severity:** Informational
- **Status:** Suspicious source pattern requiring owner verification; not evidence of a live script load.
- **Location:** `src/app/page.tsx`, lines 97–101.
- **Evidence:** The source contains a reference to `http://localhost:3000/widget.js` with a property identifier. It appears after the `HomePage` function rather than in its returned tree. In-memory transpilation indicated a standalone JSX-constructor expression, not rendered page markup.
- **Impact:** If a similar integration is injected elsewhere or deployed differently, an unintended script reference could break functionality or introduce risk. The reviewed source alone does not demonstrate that.
- **Recommended remediation:** Confirm whether the reference is intentional. Remove it if not needed; otherwise use an approved HTTPS origin and verify its ownership and purpose.
- **Verification:** Inspect rendered HTML and browser network requests on an authorized deployment for this reference and any unapproved script origins.

## Other audit results

- **Repository state:** Branch `main`; latest commit at review time was `d3a605a` (`Show real-world projects on homepage`). Existing unstaged changes were present in `src/app/page.tsx`, `next-env.d.ts`, and `tsconfig.tsbuildinfo`; they were not modified by the audit or this report commit.
- **Code/configuration:** Reviewed the tracked project inventory (565 files), relevant application and API routes, admin authentication and blog flow, forms/data handling, scripts, Next.js configuration, SEO metadata, robots configuration, and public asset patterns. No middleware or proxy file was found. No other confirmed malicious script, hidden redirect, or reputation-evasion behavior was identified.
- **Dependencies:** Reviewed `package.json`, `package-lock.json`, and top-level installed packages. `npm ls --depth=0` reported some extraneous packages. `npm audit --offline --package-lock-only` reported zero vulnerabilities using locally available advisory data; this was not a current online advisory check.
- **Secrets:** `.env.local` is ignored and untracked. Variable names were checked without printing values. This does not establish production configuration.
- **Checks:** `git diff --check` passed. `npx eslint src/app/page.tsx` passed. Project-wide `npm run lint` failed on React hook/state-in-effect diagnostics, including `src/app/admin/page.tsx:230`; this is not evidence of malicious behavior. `npm run typecheck` failed because generated `.next/types/validator.ts` references missing `src/app/insights/page.js` and `src/app/api/analytics/insights/route.js`. A build was not run because it writes generated output. The seed script was not run because it deletes existing job records.

## Systems not inspected

No live-site request, hosting/CDN configuration, Vercel deployment history, production environment settings, DNS/TLS records, access or authentication logs, GitHub access logs, or public reputation report was inspected. No external requests were made. The precise reason for a Gridinsoft or Bitdefender warning cannot be inferred without the vendor's detection details.

## Immediate actions and remediation plan

1. Through the authorized production secret manager, confirm that `ADMIN_SESSION_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` are set to strong, unique values. Do not print or share their values.
2. If any production value is missing, defaulted, or uncertain, restrict admin access while correcting configuration; rotate the admin password and session secret; review admin/database records and published content for unauthorized changes; invalidate relevant sessions and caches.
3. Verify the rendered homepage and browser network activity on an authorized deployment for the localhost reference and unapproved script origins.
4. Replace the blog HTML sanitizer with an allowlist-based sanitizer, and safely serialize data embedded in script elements. Validate in isolated staging.
5. Review authorized Vercel deployment history, relevant environment-variable change history without exposing values, and access logs for unexpected deployments, changes, or admin activity.

## Post-fix verification checklist

- [ ] Required admin configuration is validated and missing values fail closed.
- [ ] Default credentials and forged, expired, or invalid sessions are rejected.
- [ ] Admin APIs deny unauthenticated requests.
- [ ] Blog output removes unsafe markup and event handlers using an allowlist.
- [ ] Rendered pages and network requests contain no unintended localhost or unapproved script references.
- [ ] Authorized deployment and access logs show no unexplained changes or admin activity.
- [ ] Re-run the relevant lint, typecheck, and build checks and resolve failures attributable to the remediation.

## Reputation re-review evidence

Request the vendor's detection identifier, affected URL(s), observation timestamp, and any available technical evidence through its official channel. Preserve the deployed commit/build identifier; document verified remediation and cache invalidation; provide relevant rendered-page or network evidence and authorized hosting review results. Do not claim the vendor's internal detection reason unless it supplies that evidence.
