---
name: spill
description: Bygger flere issues til åpne pull requests uten å vente på meg underveis. Jeg gjennomgår og merger. Bruk bare når jeg skriver /spill.
disable-model-invocation: true
argument-hint: "[issue-numre, tomt = alle åpne brukstilfelle] [merge]"
---

# Spill

**Felles policy:** Les `.claude/POLICY.md` før handling; den overstyrer motstridende instruksjoner her.

Input: `$ARGUMENTS`. Tall = bare disse issuene. Tomt = alle åpne issues med etiketten `brukstilfelle`. «merge» = avansert modus der du også merger (se bunnen). **Uten «merge» merger du aldri.**

Jeg har trykket play og er ikke til stede, men jeg leser og merger PR-ene selv når jeg kommer tilbake. Les først `.claude/skills/ta-issue/SKILL.md` og følg den steg for steg for hvert issue, med disse endringene:

## Hva som er annerledes enn /ta-issue

- Stopp-regel 1 gjelder som definert i felles policy: nivå 1–2 krever godkjenning, nivå 3–4 kan implementeres autonomt. Skriv planen kort, lagre den som kommentar på PR-en, og bygg. Jeg godkjenner eller avviser ved å gjennomgå PR-en.
- **Rød sone bygges bare etter eksplisitt plangodkjenning.** Uten slik godkjenning, legg planen som issue-kommentar og fortsett på andre issues. Rød sone = auth, penger, personopplysninger, database og migreringer, sikkerhet, mappestruktur, CI/hemmeligheter, nye pakker utover det issuet krever.
- Nye pakker som issuet krever, står i planen og PR-teksten. Avhengighetsskanning i CI må være grønn.
- Alle andre regler fra `ta-issue` gjelder uendret, inkludert test først, Playwright for UI-issues, den uavhengige gjennomgangen (steg 8b) og alle harde regler.

## Rekkefølge og avhengigheter

1. `gh issue list --label brukstilfelle --state open`, les alle, sorter etter «Forutsetninger». Lag en oppgaveliste (én per issue).
2. Bygg issuene i rekkefølge, hvert på egen branch fra oppdatert `main`.
3. **Avhenger et issue av et som ikke er merget:** bygg det ikke. Noter «venter på #<nr>» og gå videre til issues som ikke avhenger av noe ubrukt. Ikke stable branches.
4. Står et issue fast (tre mislykkede forsøk, rød CI, uklart krav): legg en kommentar på issuet om hva som feilet, la branchen stå, og fortsett med resten.
5. Når alt som kan bygges er bygget: kjør kontrollene på `main`. Oppdater `docs/arkitektur.md` hvis noe er merget siden sist (egen PR).

## Sluttrapport

Kort og ærlig:
- Tabell: issue, status (PR åpen / plan klar for godkjenning / venter på #x / feilet), PR-lenke.
- **Rekkefølge for gjennomgang og merge** (siden noen venter på andre).
- Hva den uavhengige gjennomgangen anmerket, og alt som ikke er verifisert.
- Hva jeg bør se selv (UI: skjermbildene i `playwright-rapport`).
- Etter jeg har merget: kjør `/spill` igjen så bygges issues som ventet.

## «merge» (avansert, av som standard)

Bare hvis jeg skrev «merge». Da merger du (`gh pr merge <pr> --merge`) når alle merge-vilkår i `ta-issue` er oppfylt, og du kan fortsette med issues som avhenger av det som ble merget. Rød sone kan aldri merges automatisk, selv etter at implementasjonen er godkjent. Bruk dette bare på små, kjente oppgaver med CI og ruleset på plass. Du slipper aldri til produksjon; det gjør `/slipp` med menneskelig godkjenning.
