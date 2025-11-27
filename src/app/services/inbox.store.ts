import { Injectable, computed, signal } from '@angular/core';
import { BureauDocument } from '../shared/models/bureau-document';

@Injectable({ providedIn: 'root' })
export class InboxStore {
  readonly searchTerm = signal('');
  readonly activeStatus = signal<'all' | BureauDocument['status']>('all');
  readonly selectedTags = signal<string[]>([]);
  readonly availableTags = ['steuer', 'versicherung', 'mahnung', 'termin', 'auto', 'mwst', 'it'];

  readonly inbox = signal<BureauDocument[]>([
    {
      id: 1,
      title: 'Rechnung: Workspace GmbH',
      sender: 'Workspace GmbH',
      amount: '1.200,00 €',
      due: 'Fällig in 3 Tagen',
      status: 'pending',
      category: 'Rechnungen',
      tags: ['steuer', 'mwst'],
      summary: 'Dienstleistungsrechnung für Support-Vertrag Q2 inkl. 20% MwSt.'
    },
    {
      id: 2,
      title: 'Vertrag: Versicherung Auto',
      sender: 'SicherDirekt',
      amount: '86,00 € / Monat',
      due: 'Verlängerung in 12 Tagen',
      status: 'needs-action',
      category: 'Verträge',
      tags: ['versicherung', 'auto'],
      summary: 'Vertragsverlängerung mit optionalem Schutzbrief, Kündigungsfrist 4 Wochen.'
    },
    {
      id: 3,
      title: 'Mahnung: Stromlieferant',
      sender: 'GreenGrid',
      amount: '214,90 €',
      due: 'Fällig heute',
      status: 'needs-action',
      category: 'Mahnung',
      tags: ['mahnung', 'strom'],
      summary: 'Mahnstufe 1 für Vertrag #GG-7741, Bitte begleichen oder Einspruch einlegen.'
    },
    {
      id: 4,
      title: 'Bestätigung: Steuerberater Termin',
      sender: 'TaxPilot',
      amount: '—',
      due: 'Termin: 16. Mai, 10:00 Uhr',
      status: 'pending',
      category: 'Fristen',
      tags: ['termin', 'steuer'],
      summary: 'Kickoff für Jahresabschluss. Bitte Agenda bestätigen und Unterlagen bereitstellen.'
    },
    {
      id: 5,
      title: 'Zahlung verbucht: Laptop Leasing',
      sender: 'Leasy GmbH',
      amount: '315,00 €',
      due: 'Bezahlt',
      status: 'paid',
      category: 'Rechnungen',
      tags: ['leasing', 'it'],
      summary: 'März-Rate erfolgreich verbucht. Nächste Rate 15. Mai.'
    }
  ]);

  readonly filteredInbox = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const tags = this.selectedTags();
    const status = this.activeStatus();

    return this.inbox().filter(item => {
      const matchesStatus = status === 'all' || item.status === status;
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.sender.toLowerCase().includes(search) ||
        item.summary.toLowerCase().includes(search);
      const matchesTags = tags.length === 0 || tags.every(tag => item.tags.includes(tag));
      return matchesStatus && matchesSearch && matchesTags;
    });
  });

  readonly pendingItems = computed(() => this.filteredInbox().filter(item => item.status === 'pending'));
  readonly needsActionItems = computed(() => this.filteredInbox().filter(item => item.status === 'needs-action'));
  readonly paidItems = computed(() => this.filteredInbox().filter(item => item.status === 'paid'));

  readonly selectedItem = signal<BureauDocument | null>(null);

  selectItem(item: BureauDocument): void {
    this.selectedItem.set(item);
  }

  setStatus(status: 'all' | BureauDocument['status']): void {
    this.activeStatus.set(status);
  }

  toggleTag(tag: string): void {
    const current = this.selectedTags();
    this.selectedTags.set(current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]);
  }

  setSearch(term: string): void {
    this.searchTerm.set(term);
  }
}
