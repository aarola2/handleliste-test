---
name: del-opp-epic
description: Deler en brukerhistorie (epic) opp i små GitHub-issues etter brukstilfelle-malen, i riktig rekkefølge. Bruk når jeg skriver /del-opp-epic.
disable-model-invocation: true
argument-hint: "<filsti til brukerhistorie, eller tekst>"
---

# Del opp epic

**Felles policy:** Les `.claude/POLICY.md` før handling; den overstyrer motstridende instruksjoner her.

Input: `$ARGUMENTS` (en filsti, f.eks. `docs/krav/<navn>.md`, eller selve teksten).

Mål: små, uavhengig verifiserbare issues som `/ta-issue` kan løse ett og ett. Ingenting opprettes på GitHub før jeg har godkjent utkastene.

## Steg

1. **Les** brukerhistorien, `CLAUDE.md` og `.github/ISSUE_TEMPLATE/brukstilfelle.md`. Er historien uklar eller mangler akseptkriterier, still maks tre korte spørsmål først.
2. **Størrelse.** Hvert issue skal kunne gjøres i én økt, røre få filer, og ha 2–5 testbare akseptkriterier. Er noe større, del det.
3. **Rekkefølge.** Bruk alltid denne:
   1. Skjelett (ett issue per del: backend, frontend, osv.), med test og lint.
   2. CI, så tidlig som mulig, rett etter første skjelett.
   3. Wireframe som klikkbar prototype (én selvstendig HTML-fil i `docs/design/`).
   4. Funksjon, ett brukstilfelle om gangen, minst mulig avhengigheter.
   5. Feil- og tomtilstander som egne issues.
4. **Fyll malen** for hvert issue: Aktør, Mål, Forutsetninger (med issue-numre), Hovedflyt, Alternative flyter og feil, Akseptkriterier (avkrysningsliste), Utenfor scope (alltid fylt ut), Design, Autonominivå, Rød sone?
   - Autonominivå: 3 (autonom utvikling til PR) som standard. 4 bare for dokumentert lav risiko med fungerende eksterne sperrer. Høyrisiko får maks 2.
   - Rød sone og klassifisering følger `.claude/POLICY.md`. Kartlegg tillitsgrenser, aktører, sensitive data, misbruksscenarier og nødvendig sikkerhetstesting.
5. **Vis utkastene** som en tabell (nr, tittel, nivå, rød sone, avhenger av) og selve teksten. **Stopp og vent på godkjenning.**
6. **Etter godkjenning:** sørg for at etiketten finnes (`gh label create brukstilfelle` hvis den mangler), og opprett issues i rekkefølge med `gh issue create --title ... --label brukstilfelle --body-file <fil>`. Lagre brødtekst i midlertidige filer, ikke i repoet. Forutsetninger må vise til faktiske nummer; opprett derfor i rekkefølge og fyll inn nummer underveis (`gh issue edit`).
7. **Rapporter** en liste med nummer, tittel og lenke, og foreslå neste kommando: `/ta-issue <første nr>` eller `/kjor-epic`.

## Regler

- Én ting per issue. Hører to ting ikke sammen, blir det to issues.
- Ingen implementasjonsdetaljer i issuene som ikke trengs for å verifisere dem.
- Aldri finn på krav som ikke står i historien. Er noe gjetning, skriv det under «Forutsetninger» og merk det.
