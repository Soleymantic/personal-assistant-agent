import { Injectable, computed, signal } from '@angular/core';
import { BureauDocument } from '../core/models/bureau-document.model';
import { DocumentStatus } from '../core/models/document-status.enum';
import { Tag } from '../core/models/tag.model';

@Injectable({ providedIn: 'root' })
export class InboxStore {
  readonly searchTerm = signal('');
  readonly activeStatus = signal<'all' | DocumentStatus>('all');
  readonly selectedTags = signal<string[]>([]);

  readonly availableTags = ['steuer', 'versicherung', 'mahnung', 'termin', 'auto', 'mwst', 'it', 'strom', 'leasing'];

  private readonly tagMap: Tag[] = this.availableTags.map((name, index) => ({ id: index + 1, name }));

  readonly inbox = signal<BureauDocument[]>([
    {
      id: '1',
      title: 'Rechnung: Workspace GmbH',
      sender: 'Workspace GmbH',
      amount: 1200,
      due: this.daysFromNowIso(3),
      status: DocumentStatus.PENDING,
      category: 'Rechnungen',
      tags: this.tagsFor(['steuer', 'mwst']),
      summary: 'Dienstleistungsrechnung für Support-Vertrag Q2 inkl. 20% MwSt.',
      createdAt: this.daysFromNowIso(-6),
      updatedAt: this.daysFromNowIso(-2)
    },
    {
      id: '2',
      title: 'Vertrag: Versicherung Auto',
      sender: 'SicherDirekt',
      amount: 86,
      due: this.daysFromNowIso(12),
      status: DocumentStatus.NEEDS_ACTION,
      category: 'Verträge',
      tags: this.tagsFor(['versicherung', 'auto']),
      summary: 'Vertragsverlängerung mit optionalem Schutzbrief, Kündigungsfrist 4 Wochen.',
      createdAt: this.daysFromNowIso(-14),
      updatedAt: this.daysFromNowIso(-1)
    },
    {
      id: '3',
      title: 'Mahnung: Stromlieferant',
      sender: 'GreenGrid',
      amount: 214.9,
      due: this.daysFromNowIso(0),
      status: DocumentStatus.NEEDS_ACTION,
      category: 'Mahnung',
      tags: this.tagsFor(['mahnung', 'strom']),
      summary: 'Mahnstufe 1 für Vertrag #GG-7741, Bitte begleichen oder Einspruch einlegen.',
      createdAt: this.daysFromNowIso(-10),
      updatedAt: this.daysFromNowIso(0)
    },
    {
      id: '4',
      title: 'Bestätigung: Steuerberater Termin',
      sender: 'TaxPilot',
      amount: 0,
      due: this.daysFromNowIso(5),
      status: DocumentStatus.PENDING,
      category: 'Fristen',
      tags: this.tagsFor(['termin', 'steuer']),
      summary: 'Kickoff für Jahresabschluss. Bitte Agenda bestätigen und Unterlagen bereitstellen.',
      createdAt: this.daysFromNowIso(-8),
      updatedAt: this.daysFromNowIso(-2)
    },
    {
      id: '5',
      title: 'Zahlung verbucht: Laptop Leasing',
      sender: 'Leasy GmbH',
      amount: 315,
      due: null,
      status: DocumentStatus.PAID,
      category: 'Rechnungen',
      tags: this.tagsFor(['leasing', 'it']),
      summary: 'März-Rate erfolgreich verbucht. Nächste Rate 15. Mai.',
      createdAt: this.daysFromNowIso(-20),
      updatedAt: this.daysFromNowIso(-7)
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
      const matchesTags = tags.length === 0 || tags.every(tag => item.tags.some(t => t.name === tag));
      return matchesStatus && matchesSearch && matchesTags;
    });
  });

  readonly pendingItems = computed(() => this.filteredInbox().filter(item => item.status === DocumentStatus.PENDING));
  readonly needsActionItems = computed(() => this.filteredInbox().filter(item => item.status === DocumentStatus.NEEDS_ACTION));
  readonly paidItems = computed(() => this.filteredInbox().filter(item => item.status === DocumentStatus.PAID));

  readonly selectedItem = signal<BureauDocument | null>(null);

  selectItem(item: BureauDocument): void {
    this.selectedItem.set(item);
  }

  setStatus(status: 'all' | DocumentStatus): void {
    this.activeStatus.set(status);
  }

  toggleTag(tag: string): void {
    const current = this.selectedTags();
    this.selectedTags.set(current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]);
  }

  setSearch(term: string): void {
    this.searchTerm.set(term);
  }

  private daysFromNowIso(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  private tagsFor(names: string[]): Tag[] {
    return names.map(name => this.tagMap.find(tag => tag.name === name)).filter((tag): tag is Tag => !!tag);
  }
}
