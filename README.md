# Tobias Franzl – Website

Statische Website (nur HTML, CSS, JavaScript). Kein Build, keine Abhängigkeiten.
Läuft kostenlos auf GitHub Pages, Cloudflare Pages, Netlify oder Vercel.

## Dateien

```
index.html      → die Seite (Struktur & Inhalt)
styles.css      → das Design
script.js       → kleine Interaktionen (Menü, Formular, Animation)
favicon.svg     → Icon im Browser-Tab
images/         → portrait.png (Hero) und about.png (Über mich)
netlify.toml    → Konfiguration für Netlify
robots.txt      → für Suchmaschinen
sitemap.xml     → für Suchmaschinen
```

Zum Ansehen genügt ein Doppelklick auf `index.html`.

---

## 1) Code in GitHub speichern (kostenlos)

1. Auf https://github.com anmelden bzw. kostenloses Konto erstellen.
2. Oben rechts **„+" → „New repository"**.
3. Repository-Name: **`tobiasfranzl.com`** (oder frei wählbar), auf **Public** lassen,
   **kein** README hinzufügen (haben wir schon). Auf **„Create repository"** klicken.
4. Auf der nächsten Seite **„uploading an existing file"** anklicken.
5. **Alle Dateien und den Ordner `images`** aus diesem ZIP in das Fenster ziehen.
6. Unten **„Commit changes"** klicken. Fertig – der Code liegt jetzt in GitHub.

> Tipp: Später etwas ändern? Datei im Repository öffnen → Stift-Symbol → bearbeiten →
> „Commit changes". Das Hosting aktualisiert sich automatisch.

---

## 2) Hosting wählen und Domain verbinden

Alle vier Varianten sind kostenlos. **Empfehlung: Netlify oder Cloudflare Pages**,
weil dort das Kontaktformular ohne Extra-Dienst funktioniert.

### Variante A – Netlify (empfohlen, Formular inklusive)

1. Auf https://netlify.com mit GitHub anmelden.
2. **„Add new site" → „Import an existing project" → GitHub** → dein Repository wählen.
3. Build-Einstellungen leer lassen (Publish directory: `.`) → **„Deploy"**.
4. Die Seite ist sofort unter einer `*.netlify.app`-Adresse online.
5. Domain verbinden: **„Domain settings" → „Add a domain" → `tobiasfranzl.com`**.
   Netlify zeigt dir die DNS-Einträge, die du beim Domain-Anbieter eintragen musst
   (meist ein `A`-Record und/oder `CNAME`). HTTPS wird automatisch eingerichtet.

### Variante B – Cloudflare Pages

1. Auf https://pages.cloudflare.com mit GitHub anmelden.
2. **„Create application" → „Pages" → „Connect to Git"** → Repository wählen.
3. Framework preset: **None**, Build command **leer**, Output directory: `/` → **„Save and Deploy"**.
4. Domain: **„Custom domains" → `tobiasfranzl.com`** hinzufügen und DNS eintragen.
   (Am einfachsten, wenn die Domain ohnehin bei Cloudflare liegt.)

### Variante C – Vercel

1. Auf https://vercel.com mit GitHub anmelden → **„Add New… → Project"** → Repository importieren.
2. Framework Preset: **Other**, alles leer lassen → **„Deploy"**.
3. **„Settings → Domains" → `tobiasfranzl.com`** hinzufügen und DNS eintragen.

### Variante D – GitHub Pages

1. Im Repository: **„Settings" → „Pages"**.
2. Source: **„Deploy from a branch"**, Branch: **`main`**, Ordner: **`/root`** → **Save**.
3. Nach kurzer Zeit ist die Seite unter `https://DEINNAME.github.io/...` online.
4. Domain: unter **„Custom domain"** `tobiasfranzl.com` eintragen.
   Beim Domain-Anbieter die `A`-Records auf die GitHub-Pages-IPs setzen
   (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) bzw. einen `CNAME` auf
   `DEINNAME.github.io`.
   **Hinweis:** GitHub Pages hat **kein** Formular-Backend – siehe Abschnitt „Kontaktformular".

---

## 3) Domain kaufen / DNS

Falls `tobiasfranzl.com` noch nicht dir gehört: bei einem Anbieter registrieren
(z. B. Cloudflare, Namecheap, Porkbun, GoDaddy). Danach die DNS-Einträge setzen,
die dir dein gewählter Host (oben) anzeigt. Nach dem Speichern kann die Umstellung
einige Minuten bis wenige Stunden dauern.

---

## 4) Kontaktformular – E-Mail-Weiterleitung an hello@tobiasfranzl.com

Das Formular ist bereits für **Netlify Forms** vorbereitet
(`data-netlify="true"` in `index.html`).

**Auf Netlify (empfohlen):**
1. Nach dem ersten Deploy erkennt Netlify das Formular automatisch.
2. Im Netlify-Dashboard: **„Forms"** → dort landen alle Nachrichten.
3. Für E-Mail-Benachrichtigung: **„Forms" → „Settings & notifications" →
   „Add notification" → „Email notification"** → `hello@tobiasfranzl.com` eintragen.
   Ab dann wird jede Nachricht dorthin geschickt.

**Auf Cloudflare Pages / Vercel / GitHub Pages:**
Diese Hosts haben kein eingebautes Formular-Postfach. Zwei Optionen:
- **Empfohlen:** kostenlosen Formular-Dienst nutzen, z. B. [Formspree](https://formspree.io)
  oder [Web3Forms](https://web3forms.com). Dort ein Formular anlegen, die erhaltene
  Adresse kopieren und in `index.html` im `<form>`-Tag als `action="…"` eintragen
  (das Attribut `data-netlify` kann dann entfernt werden).
- **Ohne Anmeldung:** Das Formular fällt automatisch auf einen **E-Mail-Link** zurück –
  beim Absenden öffnet sich das E-Mail-Programm des Besuchers mit vorausgefüllter
  Nachricht an `hello@tobiasfranzl.com`.

---

## 5) Inhalte später ändern

- **Texte:** in `index.html` direkt bearbeiten.
- **Fotos:** Dateien im Ordner `images/` durch eigene ersetzen
  (gleiche Dateinamen `portrait.png` / `about.png` verwenden – dann muss nichts weiter geändert werden).
- **Farben/Schrift:** ganz oben in `styles.css` im Abschnitt `:root`.
- **E-Mail-Adresse:** in `index.html` und `script.js` nach `hello@tobiasfranzl.com` suchen und ersetzen.

Viel Erfolg!
