# Personal Assistant Agent

Angular-basierte Webapplikation (v17) zur Automatisierung persönlicher Bürokratie: erkennt Rechnungen, Verträge, Mahnungen, Fristen und Versicherungsangelegenheiten aus E-Mails, extrahiert relevante Daten und ordnet sie in eine intelligente Inbox ein.

## Übersicht
- Automatischer E-Mail-Import mit Klassifikation (Rechnung, Vertrag, Mahnung, Versicherung, Termin).
- Extraktion wichtiger Felder: Fälligkeit, Betrag, Absender, Vertragsnummer, Fristen.
- Strukturierte Inbox mit den Spalten **Pending**, **Paid** und **Needs Action**.
- Automatische Antwortvorschläge, die nur bei Entscheidungspflicht nachfragen.
- Dokumentzusammenfassungen und Vertragsanalysen für schnelle Freigaben.

## Entwicklung
1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. Entwicklung starten:
   ```bash
   npm start
   ```
   Der Dev-Server läuft standardmäßig auf `http://localhost:4200`.

## Architektur
Details zur empfohlenen Architektur, Datenmodelle, Pipelines und Sicherheits-/Deployment-Aspekte finden sich in [`docs/architecture.md`](docs/architecture.md).

## UI
Die Angular-UI befindet sich unter `src/` und bildet eine Inbox mit Filterchips, Status-Tab, Spaltenansicht und Detailpanel ab. Die früheren statischen Mockups sind weiterhin im Ordner [`ui-prototype`](ui-prototype) zu finden.
