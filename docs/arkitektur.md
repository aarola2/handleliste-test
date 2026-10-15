# Arkitektur

## Oversikt

En enkel handleliste i nettleseren. Frontend er React + Vite + TypeScript. Det finnes ingen backend. Kravene står i `docs/krav/handleliste.md` og er delt opp i issues med etiketten `brukstilfelle`.

## Deler

- `frontend/`: appen, med enhetstester ved siden av koden.
- `frontend/e2e/`: Playwright-tester. `royktest.spec.ts` tester appen, og `prototype.spec.ts` tester prototypen.
- `docs/design/handleliste.html`: godkjent klikkbar prototype (#6). Det er én selvstendig fil uten eksterne ressurser og uten lagring. Ordlyd og utseende i appen hentes herfra.
- `docs/krav/`: brukerhistorier.

## Kjøre

Produksjonsgrinden (Required reviewers på miljøet `production`) skal testes.

- Appen startes med `npm --prefix frontend run dev`.
- Prototypen åpnes direkte i nettleseren: `docs/design/handleliste.html`.

## Teste

- Enhetstester (Vitest) kjøres med `npm --prefix frontend test`. Dekningsgrensen står i `frontend/vite.config.ts`.
- E2E (Playwright) kjøres med `npm --prefix frontend run e2e`. Playwright bygger og starter appen selv. Prototypetestene åpner HTML-filen direkte med `file://` og bruker ikke appserveren.

## Feilsøke
