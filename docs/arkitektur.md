# Arkitektur

## Oversikt

En enkel handleliste i nettleseren. Frontend er React + Vite + TypeScript. Det finnes ingen backend. Kravene står i `docs/krav/handleliste.md` og er delt opp i issues med etiketten `brukstilfelle`.

## Deler

- `frontend/`: appen, med enhetstester ved siden av koden.
- `frontend/e2e/`: Playwright-tester. `royktest.spec.ts` tester appen, og `prototype.spec.ts` tester prototypen. Hvert brukstilfelle har sin egen fil med én test per akseptkriterium, for eksempel `legg-til-vare.spec.ts`, `avvis-tom-vare.spec.ts`, `avvis-duplikat.spec.ts`, `kryss-av.spec.ts`, `handlede-nederst.spec.ts` og `slett-vare.spec.ts`.
- `docs/design/handleliste.html`: godkjent klikkbar prototype (#6). Det er én selvstendig fil uten eksterne ressurser og uten lagring. Ordlyd og utseende i appen hentes herfra.
- `docs/krav/`: brukerhistorier.

## Appen

All tilstand ligger i `App.tsx` som én liste med varer (`id`, `name`, `bought`). Listen finnes bare i minnet mens siden er åpen.

- `src/items.ts`: rene funksjoner som lager en ny liste i stedet for å endre den gamle: `addItem` (trimmer navnet og avviser tomt navn og duplikater), `toggleItem` og `removeItem`. `boughtLast` gir handlede varer under de andre og beholder ellers rekkefølgen. `findByName` finner en vare med samme navn uavhengig av store og små bokstaver og mellomrom rundt (`toLocaleLowerCase('nb')`). Id-en til en ny vare er én høyere enn den høyeste id-en i listen.
- `src/AddItemForm.tsx`: feltet «Vare» og knappen «Legg til». Før en vare sendes, spør skjemaet App om navnet finnes fra før (`findExisting`). Feilmeldinger, både for tomt navn og duplikat, vises i et `role="alert"`-område som alltid står i DOM-en, så skjermlesere leser dem opp.
- `src/ItemList.tsx`: én rad per vare med avkrysningsboks merket med navnet og knappen «Slett» (for skjermlesere «Slett <navn>»). Listen lagres i den rekkefølgen varene ble lagt til, men vises med `boughtLast`, så handlede varer står nederst, grå og gjennomstreket. Når en rad flyttes, beholder avkrysningsboksen fokus fordi raden har en fast `key`. Etter sletting går fokus til feltet, slik prototypen gjør.
- Varenavn vises alltid som tekst. React escaper dem, så et navn med HTML blir ikke tolket.

## Kjøre

Produksjonsgrinden (Required reviewers på miljøet `production`) skal testes.

- Appen startes med `npm --prefix frontend run dev`.
- Prototypen åpnes direkte i nettleseren: `docs/design/handleliste.html`.

## Teste

- Enhetstester (Vitest) kjøres med `npm --prefix frontend test`. Dekningsgrensen står i `frontend/vite.config.ts`.
- E2E (Playwright) kjøres med `npm --prefix frontend run e2e`. Playwright bygger og starter appen selv. Prototypetestene åpner HTML-filen direkte med `file://` og bruker ikke appserveren.

## Feilsøke
