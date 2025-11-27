# Persönlicher Bürokratie-Assistent – Architektur (Angular 20)

Dieses Dokument beschreibt eine empfohlene Architektur für eine Angular-20-Anwendung, die persönliche Bürokratie automatisiert: automatische Erkennung und Verarbeitung von Rechnungen, Verträgen, Mahnungen, Fristen und Versicherungsangelegenheiten aus E-Mails sowie eine strukturierte Inbox mit Automatisierungen und Entscheidungsunterstützung.

## Zielbild
- **Automatisches E-Mail-Ingest**: IMAP/Graph-/Gmail-Anbindung mit webhook-/polling-basiertem Import. Nachrichten werden dedupliziert und mit Anhängen gespeichert.
- **Dokumentklassifizierung & Extraktion**: ML-/LLM-gestützte Klassifizierung (Rechnung, Vertrag, Mahnung, Versicherung, Termin) plus Extraktion relevanter Felder (Absender, Betrag, Fälligkeit, Vertragsnummer, Fristen, Betreff, Begründung).
- **Strukturierte Inbox**: Statusspalten *Pending*, *Paid*, *Needs Action* mit Filtern, Bulk-Aktionen, automatischer Sortierung nach Fälligkeit.
- **Assistenz-Workflows**: Automatische Vorschläge und Antworten (z. B. "Bitte schicken Sie mir die Bilanz", "Bitte bestätigen Sie den Termin", "Ich widerspreche der Rechnung …") nur bei notwendigen Entscheidungen.
- **Zusammenfassungen & Vertragsanalyse**: Kurzfassungen, Risiko-/Termin-Highlighting, Änderungs-Tracker und Hinweis auf fehlende Unterlagen.

## App-Struktur (Angular 20)
- **Standalone Components** mit zonenlosem Rendering, Signals & `inject()`-API.
- **Module-Layering** (Ordnerstruktur):
  - `core/`: Auth, API-Clients, Error-Handling, Logging, Feature-Flags.
  - `shared/`: UI-Atoms (Buttons, Badges, Cards), Pipes (Währung/Datum), Reusable Dialoge.
  - `features/inbox/`: Kanban-Board, Detail-Sidepanel, Filter/Facetten, Bulk-Actions.
  - `features/automation/`: Regeln, Auto-Replies, Vorschlags-Engine, Simulation/Preview.
  - `features/documents/`: Dokument-Viewer, Extraktions-Panel, Summaries, Vertrags-Insights.
  - `features/settings/`: Postfächer, Vorlagen, Benachrichtigungen, Rollen.
  - `state/`: Signal-basierter Store, serverseitiges Caching (TanStack Query analog via `HttpContext`/interceptors), Offline/Retry.

## Kern-Use-Cases & Komponenten
- **InboxBoardComponent**: Drei Spalten (*Pending*, *Paid*, *Needs Action*), Drag & Drop, Fälligkeitsbadges, Warnungen bei überfälligen Beträgen.
- **MessageDetailDrawerComponent**: E-Mail/Document-Preview, extrahierte Felder, automatisierte Vorschläge (Chips), Quick-Actions (Mark as Paid, Snooze, Assign).
- **AutomationRuleBuilderComponent**: Bedingungen (Absender, Betreff, Betrag, Fälligkeit, Vertragsnummer, Dokumenttyp) + Aktionen (Status setzen, Antwortvorlage, Erinnerungen, Webhook).
- **TemplateComposerComponent**: Vorlagen mit Platzhaltern (`{{amount}}`, `{{dueDate}}`, `{{contractId}}`), Mehrsprachigkeit, Tonalitäten.
- **SummaryPanelComponent**: Kurzfassung, Risiken, Fristübersicht; nutzt LLM/ML-Service.

## Datenmodelle (Beispiele)
```ts
export type InboxStatus = 'pending' | 'paid' | 'needs_action';

export interface ExtractedField {
  key: 'amount' | 'dueDate' | 'sender' | 'contractId' | 'category' | 'priority';
  value: string;
  confidence: number;
  source?: 'body' | 'attachment' | 'header';
}

export interface InboxItem {
  id: string;
  subject: string;
  sender: string;
  receivedAt: string;
  status: InboxStatus;
  dueDate?: string;
  amount?: number;
  currency?: string;
  contractId?: string;
  category?: 'invoice' | 'contract' | 'reminder' | 'insurance' | 'deadline';
  extraction: ExtractedField[];
  attachments: Attachment[];
  requiresDecision: boolean;
  autoReplySuggestion?: ReplySuggestion;
}

export interface ReplySuggestion {
  label: string;
  templateId: string;
  preview: string;
  requiresApproval: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  conditions: Condition[];
  actions: Action[];
  enabled: boolean;
  dryRun?: boolean;
}
```

## Pipeline für E-Mail-Import & Extraktion
1. **Eingang**: IMAP/Gmail/Graph-Connector → Queue (`/api/ingest`).
2. **Vorverarbeitung**: Duplikat-Check (Message-ID/Hash), Virenscan, OCR für PDFs/Bilder.
3. **Klassifizierung**: LLM/ML-Service (`/api/classify`) liefert Dokumenttyp + Konfidenz.
4. **Extraktion**: LLM-/Regelhybrid (`/api/extract`) für Fälligkeit, Betrag, Absender, Vertragsnummer, Fristen.
5. **Normalisierung**: Währung/Datumsnormalisierung, IBAN/VAT/Steuerkennzeichen-Erkennung.
6. **Rule Engine**: Automationsregeln anwenden (Status setzen, Labels, Auto-Replies generieren, Kalendereintrag, Aufgabe).
7. **Persistenz**: Speichern in `inbox`-Collection (z. B. via REST/GraphQL). Indexe: `status`, `dueDate`, `requiresDecision`.
8. **Benachrichtigungen**: Nur bei `requiresDecision=true` Push/Inbox-Badge.

## Automatisierte Antworten & Entscheidungsschleifen
- **Antwortvorlagen**: Versioniert, mehrsprachig; Platzhalter für Extrakte.
- **Generierung**: LLM-Service erzeugt Vorschläge; Benutzer muss freigeben, wenn Konfidenz < Schwelle oder Konflikt erkannt.
- **Beispiele**:
  - "Bitte schicken Sie mir die Bilanz."
  - "Bitte bestätigen Sie den Termin."
  - "Ich widerspreche der Rechnung …" (mit Begründung/Referenznummer).
- **Decision-UI**: Minimalinvasive Banner/Dialoge; Default ist Auto-Weiterverarbeitung.

## Sicherheit & Compliance
- **Auth**: OIDC/OAuth2, optional FIDO2.
- **Datenschutz**: Verschlüsselung at-rest/in-transit, PII-Redaction in Logs, Data Residency.
- **Berechtigungen**: Rollen (Owner, Assistant, Accountant). Mandantentrennung.
- **Auditing**: Jede Automationsaktion protokolliert (wer, wann, welche Regel, alte/ neue Werte).

## Beobachtbarkeit & Qualität
- **Telemetry**: OpenTelemetry Traces/Logs/Metrics; UX-Metriken (LCP/INP) via `@angular-devkit/core` analytics pipeline.
- **Evaluation**: Extraktions- und Klassifikations-Metriken (Precision/Recall), Drift-Detection.
- **UX-Tests**: Storybook für Komponenten, Playwright/E2E, Jest/Karma-Unit-Tests.

## Deployment-Strategie
- **CI/CD**: Lint → Unit → E2E → Build → Containerize → Deploy.
- **Hosting**: Static hosting (S3/CloudFront/Vercel) + Backend/API (Serverless oder Container). Edge Caching für Assets; API über `/api/*` Proxy.
- **Feature Flags**: Remote konfigurierbar, um neue Auto-Reply-/Extraktionsmodelle graduell auszurollen.

## Migrationspfad & MVP
- **MVP**: Inbox-Board, manuelle Labeling-Unterstützung, einfache Regeln (Absender/Betrag/Betreff) und vordefinierte Antwortvorlagen.
- **Phase 2**: LLM-gestützte Extraktion, Summaries, Vertragsanalyse, Kalender-/Task-Sync.
- **Phase 3**: Vollautomatische Zahlungen/Überweisungen mit Banking-API, SLA-basierte Eskalationen.
