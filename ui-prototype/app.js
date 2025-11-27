const inbox = [
  {
    id: 'inv-2024-234',
    title: 'Rechnung: Cloud-Speicher Abo',
    sender: 'Cloudify GmbH',
    amount: 24.99,
    due: '2024-06-30',
    contract: 'ACC-7788',
    status: 'pending',
    type: 'invoice',
    summary: 'Monatliche Cloud-Speicher-Gebühr. Zahlung per SEPA möglich.',
    tags: ['Cloud', 'SEPA'],
  },
  {
    id: 'cnt-2024-102',
    title: 'Vertragsverlängerung Coworking',
    sender: 'Workloft AG',
    amount: 320.0,
    due: '2024-07-10',
    contract: 'CW-2024-07',
    status: 'needs_action',
    type: 'contract',
    summary: 'Jährliche Verlängerung des Coworking-Platzes. Zustimmung oder Kündigung nötig.',
    tags: ['Coworking', 'Kündigungsfrist 4 Wochen'],
  },
  {
    id: 'rem-2024-045',
    title: 'Mahnung: Stromabschlag',
    sender: 'EnergieNord',
    amount: 58.5,
    due: '2024-06-20',
    contract: 'ST-4499',
    status: 'needs_action',
    type: 'reminder',
    summary: 'Mahnung wegen offener Abschlagszahlung. Zahlung innerhalb von 7 Tagen erforderlich.',
    tags: ['Mahnung', 'Abschlag'],
  },
  {
    id: 'ins-2024-021',
    title: 'Versicherung – Police Aktualisierung',
    sender: 'Sichero Versicherung',
    amount: 0,
    due: '2024-06-25',
    contract: 'POL-9931',
    status: 'pending',
    type: 'insurance',
    summary: 'Bitte bestätigen Sie die Aktualisierung der Haftpflicht-Police.',
    tags: ['Versicherung', 'Bestätigung'],
  },
  {
    id: 'inv-2024-301',
    title: 'Rechnung: Steuerberatung Q2',
    sender: 'TaxPerfect',
    amount: 180,
    due: '2024-06-28',
    contract: 'TAX-88-Q2',
    status: 'paid',
    type: 'invoice',
    summary: 'Quartalsrechnung für Steuerberatung. Zahlung ausgeführt.',
    tags: ['Steuer', 'Banking'],
  },
];

const replies = [
  'Bitte senden Sie mir die aktuelle Bilanz.',
  'Bitte bestätigen Sie den vorgeschlagenen Termin.',
  'Ich widerspreche der Rechnung und bitte um Korrektur.',
  'Bestätigung: Bitte Verlängerung zum genannten Preis durchführen.',
];

const listEls = {
  pending: document.querySelector('#list-pending'),
  needs_action: document.querySelector('#list-needs-action'),
  paid: document.querySelector('#list-paid'),
};

const badgeEls = {
  pending: document.querySelector('#badge-pending'),
  needs_action: document.querySelector('#badge-needs-action'),
  paid: document.querySelector('#badge-paid'),
};

const detailPanel = document.querySelector('#detail-panel');
const placeholder = document.querySelector('#placeholder');
const statusSelect = document.querySelector('#status-select');
const replyTemplates = document.querySelector('#reply-templates');
const replyText = document.querySelector('#reply-text');

const state = {
  selectedId: null,
  filterType: '',
  filterStatus: '',
};

function formatCurrency(amount) {
  if (amount === 0) return '–';
  return amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function renderReplies() {
  replyTemplates.innerHTML = '';
  replies.forEach((text) => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = text;
    chip.addEventListener('click', () => {
      replyText.value = text;
    });
    replyTemplates.appendChild(chip);
  });
}

function renderCards() {
  Object.values(listEls).forEach((el) => (el.innerHTML = ''));
  const filtered = inbox.filter((item) => {
    const typeOk = state.filterType ? item.type === state.filterType : true;
    const statusOk = state.filterStatus ? item.status === state.filterStatus : true;
    const term = document.querySelector('#search-input').value.trim().toLowerCase();
    const matchesTerm = term
      ? item.title.toLowerCase().includes(term) ||
        item.sender.toLowerCase().includes(term) ||
        item.contract.toLowerCase().includes(term)
      : true;
    return typeOk && statusOk && matchesTerm;
  });

  filtered.forEach((item) => {
    const card = document.createElement('article');
    card.className = `card ${state.selectedId === item.id ? 'active' : ''}`;
    card.innerHTML = `
      <p class="title">${item.title}</p>
      <p class="meta">${item.sender} • ${formatDate(item.due)}</p>
      <div class="tags">
        <span class="tag due">Fällig ${formatDate(item.due)}</span>
        <span class="tag amount">${formatCurrency(item.amount)}</span>
        <span class="tag">${item.contract}</span>
      </div>
    `;
    card.addEventListener('click', () => selectItem(item.id));
    listEls[item.status].appendChild(card);
  });

  badgeEls.pending.textContent = inbox.filter((i) => i.status === 'pending').length;
  badgeEls.needs_action.textContent = inbox.filter((i) => i.status === 'needs_action').length;
  badgeEls.paid.textContent = inbox.filter((i) => i.status === 'paid').length;
}

function selectItem(id) {
  state.selectedId = id;
  const item = inbox.find((i) => i.id === id);
  if (!item) return;

  document.querySelectorAll('.card').forEach((card) => card.classList.remove('active'));
  document
    .querySelectorAll(`[data-status] .card`)
    .forEach((card) => card.classList.toggle('active', card.textContent.includes(item.title)));

  placeholder.hidden = true;
  detailPanel.hidden = false;

  document.querySelector('#detail-type').textContent = item.type;
  document.querySelector('#detail-title').textContent = item.title;
  document.querySelector('#detail-meta').textContent = `${item.id} • ${item.status}`;
  document.querySelector('#detail-sender').textContent = item.sender;
  document.querySelector('#detail-amount').textContent = formatCurrency(item.amount);
  document.querySelector('#detail-due').textContent = formatDate(item.due);
  document.querySelector('#detail-contract').textContent = item.contract;
  document.querySelector('#detail-summary').textContent = item.summary;
  statusSelect.value = item.status;
  replyText.value = '';
}

function updateStatus(newStatus) {
  if (!state.selectedId) return;
  const item = inbox.find((i) => i.id === state.selectedId);
  if (!item) return;
  item.status = newStatus;
  renderCards();
  selectItem(item.id);
}

function wireEvents() {
  statusSelect.addEventListener('change', (e) => updateStatus(e.target.value));
  document.querySelector('#filter-type').addEventListener('change', (e) => {
    state.filterType = e.target.value;
    renderCards();
  });
  document.querySelector('#filter-status').addEventListener('change', (e) => {
    state.filterStatus = e.target.value;
    renderCards();
  });
  document.querySelector('#search-input').addEventListener('input', renderCards);

  document.querySelector('#btn-send-reply').addEventListener('click', () => {
    if (!state.selectedId) return alert('Bitte wähle zuerst einen Eintrag aus.');
    const text = replyText.value.trim() || 'Automatisierte Antwort gesendet.';
    alert(`Antwort gesendet:\n\n${text}`);
  });

  document.querySelector('#btn-ask-confirmation').addEventListener('click', () => {
    if (!state.selectedId) return alert('Bitte wähle zuerst einen Eintrag aus.');
    alert('Der Assistent wird dich nur bei Entscheidungen erneut kontaktieren.');
  });

  document.querySelector('#btn-run-automation').addEventListener('click', () => {
    alert('Simulation: Automationen werden ausgeführt (Parsing, Klassifikation, Antworten).');
  });

  document.querySelector('#btn-add-email').addEventListener('click', () => {
    alert('Simulation: Neue E-Mail wird eingelesen und klassifiziert.');
  });
}

renderReplies();
renderCards();
wireEvents();
