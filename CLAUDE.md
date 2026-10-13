# handleliste-test

Enkel handleliste: legg til, kryss av og slett varer

## Stack

- Frontend: React + Vite + TypeScript (Node 24)
- Backend: ingen
- Test: Vitest + Testing Library (jsdom), Playwright for e2e
- Lint: ESLint + typescript-eslint

## Kommandoer

Kjøres fra mappen som står i overskriften. Fra rotmappen: `npm --prefix frontend run <script>`.

### frontend/
- Start: `npm run dev`
- Test: `npm test` (med dekning: `npm test -- --coverage`)
- Lint: `npm run lint`
- Build: `npm run build`
- Typecheck: `npm run typecheck`
- E2E (Playwright): `npm run e2e`

## Mappestruktur

```
frontend/           kode og tester (tester ved siden av koden)
frontend/e2e/       Playwright-tester
docs/krav/          brukerhistorier
docs/design/        wireframe / klikkbar prototype
.github/            issue-mal, CI og deploy
.claude/            rettigheter og skills
```

## Kodestandard

- Strengeste typesjekk stacken tilbyr.
- Navn i koden på engelsk. Meldinger til brukeren på norsk.
- Hver ny funksjon har en test. Tester ligger ved siden av koden.
- Små funksjoner. Ingen død kode.
- E2E-tester (Playwright): velg elementer med `getByRole`/`getByLabel`/`getByText`, aldri CSS-klasser. Ingen faste ventetider. Én test per akseptkriterium i UI-issues. Skjermbilder lagres i testrapporten.

## Arbeidsmåte

- Ett issue = én branch (`feature/<nr>-<navn>`) = én PR med `Closes #<nr>`.
- Aldri push til `main`. Aldri force push. Aldri `git add .`.
- Se `.claude/POLICY.md`: nivå 1–2 krever forhåndsgodkjenning, nivå 3 gir autonom PR (men `/ta-issue` og `/kjor-epic` viser alltid planen først), nivå 4 muliggjør autonom merge bare for lav risiko med eksterne gates.
- Avviker ønsket fra issuet: oppdater issuet først.
- Et issue er ferdig først når PR-en er merget.
- Kjør test, lint og build før commit. Rapporter hva som ikke er verifisert.

## Utrulling

- Hosting er GitHub Pages. Pages har én adresse per repo, så den er **produksjon**. Det finnes ikke noe staging-miljø.
- `.github/workflows/deploy.yml` bygger én artefakt etter grønn CI på `main`, røyktester nøyaktig den artefakten i runneren (`forhandstest`), og ruller den ut uendret i jobben `produksjon` (miljøet `production`).
- `produksjon` er stengt til repo-variabelen `PRODUKSJON_GODKJENNING_VERIFISERT` er `true`. Bare eieren setter den, etter at Required reviewers på `production` er testet.

## Felles styring

Les `.claude/POLICY.md` først. KI-review er rådgivende; CI, branch protection og produksjonssperrer må håndheves utenfor agenten.

## Grønn sone (kan gjøres selvstendig)

Små funksjoner med tester, UI-detaljer ut fra godkjent wireframe, dokumentasjon, tester.

## Rød sone (plan og godkjenning alltid)

Autentisering, penger, personopplysninger, database og migreringer, sikkerhet, mappestruktur, CI og hemmeligheter, nye pakker.

## Ikke rør

- `.env` og andre hemmeligheter
- `.claude/settings.json` uten at jeg ber om det
- Alt under «Utenfor scope» i issuet

## Forklaringer

Når du lager noe jeg ikke selv kunne forklart for en kollega, legg ved en kort forklaring på norsk i planen eller rapporten.
