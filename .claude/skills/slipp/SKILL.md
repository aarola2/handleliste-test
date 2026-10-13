---
name: slipp
description: Forbereder produksjonssetting: full kontroll av main, release-notater, tag og utrulling til staging. Selve produksjonssettingen godkjennes av meg på GitHub. Bruk bare når jeg skriver /slipp.
disable-model-invocation: true
argument-hint: "<versjon, f.eks. v1.0.0>"
---

# Slipp

**Felles policy:** Les `.claude/POLICY.md` før handling; den overstyrer motstridende instruksjoner her.

Input: `$ARGUMENTS` (versjon). Produksjonssetting krever en **verifisert ekstern menneskelig sperre**. Hvis GitHub-planen ikke støtter required reviewers i private repos, stopp før produksjonsoppsett.

## Steg

1. **Forutsetninger.** På `main`, ren og oppdatert (`git pull`). Ingen åpne rød-kø-PR-er uten at jeg har sagt at de kan vente. Sjekk at siste CI-kjøring på `main` er grønn (`gh run list --branch main --limit 1`).
2. **Full kontroll.** Alle kommandoer fra `CLAUDE.md` (test, lint, build, typecheck) i alle mapper. Kjør e2e og sikkerhetsskanning hvis de finnes lokalt. Rapporter nøyaktig hva som kjørte og hva som ikke gjorde det.
3. **Sikkerhetsgjennomgang.** Start en subagent uten byggehistorikk. Gi den hele kodebasen (lesetilgang) og be om en gjennomgang etter OWASP Top 10: autentisering og tilgang, input-validering, hemmeligheter i kode/historikk, sårbare avhengigheter (`npm audit` eller tilsvarende), feilmeldinger som lekker informasjon, CORS/headers. Resultat: liste med alvorlighet. Alvorlig/høy = ikke slipp; lag issues og stopp.
4. **Release-notater.** Fra lukkede issues og PR-er siden forrige tag: kort norsk liste. Ta med kjente begrensninger og alt som ikke er verifisert.
5. **Gate-kontroll.** Bekreft dokumentert at produksjonsmiljøets required reviewers faktisk håndheves for dette repoet og abonnementet, og at produksjonshemmeligheter ikke er tilgjengelige før godkjenning. Mangler dette, STOPP. Bruk ikke en annen workflow som omgår sperren.
6. **Tag og release.** `git tag <versjon>`, `git push origin <versjon>`, `gh release create <versjon> --notes-file <fil>` (bare `ask`-godkjent). Rull-ut-arbeidsflyten i `.github/workflows/` tar over.
7. **Staging først.** Test eksakt immutabel artefakt/digest som senere skal promoteres. Bekreft at utrullingen til staging er grønn og at røyktesten mot staging passerer.
8. **Stopp.** Skriv: «Klar for produksjon. Godkjenn i GitHub: Actions → deploy → Review deployments.» Dette er bare tillatt etter at sperren er kontrollert og bevist virksom. Du forsøker aldri å omgå det.
9. **Etter at jeg har godkjent:** sjekk helse-endepunktet/røyktest i produksjon, og rapporter. Feiler den: foreslå rollback (forrige tag), men gjør den ikke uten at jeg sier ja.

## Regler

- Aldri deploy direkte til produksjon fra kommandolinjen.
- Aldri endre miljøbeskyttelse, hemmeligheter eller ruleset.
- Produksjonshemmeligheter finnes kun i GitHub Environments, aldri i repoet og aldri i det du leser.
