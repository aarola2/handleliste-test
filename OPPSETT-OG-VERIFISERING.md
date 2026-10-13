# Sjekkliste for innføring av v2

1. Les `.claude/POLICY.md`; avklar GitHub-abonnement og om repoet er privat. Skills er ikke nok som håndheving.
2. Sett opp branch protection/ruleset for `main`: PR påkrevd, required checks (test, lint, build, dependency, secrets, SAST, e2e hvis UI), blokkering av force push/sletting, restriksjoner for bypass, eventuelt krav om menneskelig review for høy risiko. Bekreft at en PR med rød check **ikke** lar seg merge.
3. Bruk GitHub-token med minste privilegier. Separate bot- og produksjonsidentiteter, ingen prod-secrets i Claude-runtime. Test at boten ikke kan endre branch protection, secrets eller deploy-gates.
4. Test `nivå 3`: `/spill` bygger og åpner PR uten å be om plangodkjenning, men **merger ikke** (`/ta-issue` viser alltid planen først). Test `nivå 2`: stopper før implementering. Test `nivå 4`: kun et risikofritt issue og bare når checks/ruleset faktisk håndheves.
5. Test rød sone: auth, personopplysninger, migrasjon, CI og ny avhengighet => krever plan-godkjenning; aldri autonom merge.
6. Prod er **stengt** før du har dokumentert og testet required reviewers med reell blokkering. GitHub Free/Pro/Team gir ikke required reviewers i private repoer. Alternativ: hold all produksjonsutrulling utenfor denne automatiseringen i en separat manuell prosess.
7. Test at staging kjører samme immutabel artefakt/digest som produksjon etter godkjenning, og at rollback-plan finnes.
8. Simuler prompt-injeksjon i et issue, en lekket hemmelighet, feilende testsuite og et kritisk sårbarhetsfunn. Kontroller at prosessen stopper på riktig sted.
9. Kjør ende-til-ende på et demonstrasjonsprosjekt før aktivering i reelle prosjekter. Spor false positives, CI-feil, menneskelige inngrep, testdekning og funn i review.

**Merk:** `settings.json` er en policy for Claude Code-grensesnittet, ikke en full sandbox. GitHub-regler og deploy-gates må etableres og verifiseres separat. Test også kommandomønstre mot den installerte Claude Code-versjonen med `/permissions`.
