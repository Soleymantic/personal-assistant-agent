# Personal Assistant Agent

Entwurf für eine Angular-20-Webapplikation, die persönliche Bürokratie automatisiert: automatische Erkennung von Rechnungen, Verträgen, Mahnungen, Fristen und Versicherungsangelegenheiten aus E-Mails, Extraktion relevanter Daten sowie intelligente Inbox mit Automatisierungen und Entscheidungsunterstützung.

## Übersicht
- Automatischer E-Mail-Import mit Klassifikation (Rechnung, Vertrag, Mahnung, Versicherung, Termin).
- Extraktion wichtiger Felder: Fälligkeit, Betrag, Absender, Vertragsnummer, Fristen.
- Strukturierte Inbox mit den Spalten **Pending**, **Paid** und **Needs Action**.
- Automatische Antwortvorschläge, die nur bei Entscheidungspflicht nachfragen.
- Dokumentzusammenfassungen und Vertragsanalysen für schnelle Freigaben.

## Architektur
Details zur empfohlenen Architektur, Datenmodelle, Pipelines und Sicherheits-/Deployment-Aspekte finden sich in [`docs/architecture.md`](docs/architecture.md).
