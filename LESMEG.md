# Automatisering av KI-prosessen

Seks skills, en `settings.json` og maler. Stack-nøytral: språk og kommandoer står i prosjektets `CLAUDE.md`, ikke i skillene.

## Innhold

| Fil | Hva |
|---|---|
| `.claude/skills/nytt-prosjekt/` | `/nytt-prosjekt <navn> <beskrivelse>`: CLAUDE.md, issue-mal, etikett, mapper, GitHub-sjekkliste |
| `.claude/skills/del-opp-epic/` | `/del-opp-epic <fil>`: brukerhistorie til små issues, riktig rekkefølge |
| `.claude/skills/ta-issue/` | `/ta-issue <nr>`: ett issue fra branch til PR (merge er avansert og av som standard) |
| `.claude/skills/spill/` | `/spill [nr ...]`: bygger flere issues til åpne PR-er uten å vente på deg. Du gjennomgår og merger |
| `.claude/skills/slipp/` | `/slipp <versjon>`: full kontroll, sikkerhetsgjennomgang, release, staging. Produksjon godkjennes av deg på GitHub |
| `.claude/skills/kjor-epic/` | `/kjor-epic [nr ...] [merge]`: flere issues etter hverandre |
| `.claude/settings.json` | Rettigheter: allow / ask / deny |

## Slik tar du det i bruk

1. Opprett en tom mappe og et tomt repo på GitHub (eller la `/nytt-prosjekt` gjøre det). Åpne mappen i VS Code.
2. Kopier mappen `.claude/` fra denne pakken inn i prosjektmappen.
   (Vil du ha skillene i alle prosjekter: kopier `.claude/skills/` til `~/.claude/skills/`. Ikke testet.)
3. Start Claude i prosjektet og kjør `/nytt-prosjekt mitt-prosjekt "Kort beskrivelse"`.
4. Skriv brukerhistorien i `docs/krav/<navn>.md`. Kjør `/del-opp-epic docs/krav/<navn>.md`. Godkjenn utkastene.
5. Kjør `/ta-issue <nr>` på ett issue, eller `/kjor-epic` for flere.

## Arbeidsmåte (etter NAV-modellen: du gjennomgår og merger)

Claude gjør alt det mekaniske: issues, branch, tester, kode, lint, PR og kontroller. Du er mennesket i løkka: du godkjenner planer for viktige issues, leser PR-ene og merger. Merge er av som standard.

1. `/nytt-prosjekt` setter opp rammene (CI, Playwright for UI, Dependabot, CLAUDE.md, issue-mal). Du gjør GitHub-sjekklisten.
2. Skriv brukerhistorien i `docs/krav/<navn>.md`. Kjør `/del-opp-epic`, godkjenn issuene.
3. **Ett issue om gangen:** `/ta-issue <nr>`. Planen vises alltid først, og du godkjenner den før noe endres (uansett nivå).
4. **Flere om gangen:** `/spill` bygger alle issues som kan bygges til åpne PR-er. Rød sone får bare en plan. Issues som avhenger av umerget arbeid venter.
5. Du leser PR-ene (start med «Slik fungerer det» og den uavhengige gjennomgangen), ser skjermbildene for UI, og merger. Kjør `/spill` igjen for å bygge det som ventet.
6. `/slipp v1.0.0` når alt er klart, og godkjenn produksjon på GitHub.

### Portene som hjelper deg å gjennomgå raskere

| Port | Hva den fanger |
|---|---|
| Test først, feilveier med | Krav som ikke er testet |
| Uavhengig subagent-gjennomgang per PR (kommentar på PR-en) | Svake tester, sikkerhetshull, scope-brudd |
| CI: lint, typecheck, test med dekning, build | Vanlige feil |
| CI: avhengighets-, hemmelighets- og kodeanalyse | Sårbarheter og lekkede nøkler |
| CI: Playwright med skjermbilder (UI) | At appen virker i nettleser |
| Rød sone: bare plan, du godkjenner | Auth, penger, persondata, database, CI osv. |
| `/slipp`: sikkerhetsgjennomgang + staging | Det som slipper gjennom per-PR-sjekkene |
| Miljøet `production` med påkrevd godkjenner | Ingenting går live uten at du trykker |
| `docs/arkitektur.md` + «Slik fungerer det» i hver PR | At du forstår det som er bygget |

### Vil du automatisere merge senere?

Gjør det i trinn: først `/spill merge` på små issues uten UI og uten rød sone, med CI og ruleset på plass. Flytt aldri `gh pr merge` fra `ask` til `allow` før du har godt grunnlag. For produksjon med persondata, betaling eller innlogging: behold menneskelig gjennomgang. Rulesets håndheves ikke på privat repo uten betalt plan, så da er det bare Claudes egne regler som hindrer merge ved rød CI.

## Hva som stopper Claude

I `/ta-issue` og `/kjor-epic`: planen venter alltid på din godkjenning, rød sone, manglende akseptkriterier, avvik fra issuet, tre mislykkede forsøk, ubrutte forutsetninger. `/spill` venter ikke på plan for vanlige issues, men bygger aldri rød sone uten godkjent plan, og merger ikke.

## Verifisert mot dokumentasjonen (okt. 2026)

- Frontmatter: `name`, `description`, `disable-model-invocation`, `argument-hint` er gyldige. `$ARGUMENTS` fylles med hele teksten du skriver etter kommandoen.
- Personlige skills ligger i `~/.claude/skills/<navn>/SKILL.md`.
- `permissions` støtter `allow`, `ask` og `deny`; rekkefølge deny, ask, allow. `Bash(git push:*)` og `Bash(git push *)` er likeverdige.
- Skills som har `disable-model-invocation: true` kan ikke lastes av en annen skill, så `kjor-epic` og `spill` leser `ta-issue/SKILL.md` som fil. Det er riktig måte.

## Ikke testet i praksis

Selve flyten er ikke kjørt mot et ekte prosjekt. Test først på et lite prosjekt du kan kaste. `settings.json` har npm-kommandoer; `/nytt-prosjekt` skal bytte dem til stackens egne.


## Versjon 2 – sikker autonomi

Les `.claude/POLICY.md` og `OPPSETT-OG-VERIFISERING.md`. Alle skills er samordnet til nivå 1–4. Det er fortsatt nødvendig å konfigurere og teste GitHub-regler, CI og deploy-godkjenning utenfor ZIP-pakken. Uten verifiserte sperrer: ingen automatisk merge eller produksjonsdeploy.

### Nivåer (kort)

1 analyser, 2 plan og godkjenning før endring, 3 bygg til PR (merger aldri), 4 kan merge ved lav risiko og håndhevede gates. `/ta-issue` og `/kjor-epic` viser alltid planen først. `/spill` bygger autonomt på nivå 3.

### Hvilken GitHub-plan har du?

Rulesets og required reviewers på miljøer er ikke tilgjengelig i private repoer på alle abonnementer. Uten dem: ingen auto-merge og ingen produksjonsjobb i automatiseringen. Flyten er da nivå 3 med manuell merge og manuell produksjonssetting.

`curl` og `wget` krever godkjenning (ligger i `ask`), også for lokale helsesjekker.
