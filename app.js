// Application Logic for Multi-Case Classified Archive System with Landing Home Page

let allCases = [];
let activeCaseSlug = null;
let allDocuments = [];
let activeDocumentId = null;
let showRedactedText = false;
let isCleanMode = false;

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  setupMobileDrawer();
  loadCasesIndex();
  setupEventListeners();
});

// Real-time Clock
function initClock() {
  const clockEl = document.getElementById('system-clock');
  const updateClock = () => {
    const now = new Date();
    clockEl.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  };
  updateClock();
  setInterval(updateClock, 1000);
}

// Navigation View Switching
function showHomeView() {
  document.getElementById('home-view').classList.remove('hidden');
  document.getElementById('reader-view').classList.add('hidden');
  document.getElementById('nav-home-btn').classList.add('active');
}

function showReaderView(caseSlug) {
  document.getElementById('home-view').classList.add('hidden');
  document.getElementById('reader-view').classList.remove('hidden');
  document.getElementById('nav-home-btn').classList.remove('active');

  if (caseSlug && caseSlug !== activeCaseSlug) {
    selectCase(caseSlug);
  }
}

// Setup Mobile Sidebar Drawer & Backdrop
function setupMobileDrawer() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  const openDrawer = () => {
    sidebar.classList.add('mobile-open');
    backdrop.classList.add('active');
  };

  const closeDrawer = () => {
    sidebar.classList.remove('mobile-open');
    backdrop.classList.remove('active');
  };

  toggleBtn.addEventListener('click', openDrawer);
  backdrop.addEventListener('click', closeDrawer);
}

// Load Cases Index JSON (Multi-Case)
async function loadCasesIndex() {
  const caseSelector = document.getElementById('case-selector');
  try {
    const response = await fetch('cases/cases_index.json');
    if (!response.ok) throw new Error('Multi-case index not found');
    allCases = await response.json();

    // Populate Sidebar Selector
    caseSelector.innerHTML = '';
    allCases.forEach(c => {
      const option = document.createElement('option');
      option.value = c.slug;
      option.textContent = `[${c.id}] ${c.title}`;
      caseSelector.appendChild(option);
    });

    // Populate Home Page Cards Grid
    renderHomeCasesGrid(allCases);

  } catch (err) {
    console.warn('Fallback to single case mode:', err);
    allCases = [{
      id: "CASE-001",
      slug: "krasue_case",
      title: "แฟ้มคดีที่ 001: ปรากฏการณ์พยาธิวิทยากับความเชื่อ (กระสือ)",
      subtitle: "Krasue Pathological & Folklore Case File",
      period: "1978 - 2025",
      status: "OPEN",
      securityLevel: "CONFIDENTIAL",
      totalDocs: 12,
      summary: "การสืบสวนระบาดวิทยาภาวะโลหิตจางฉับพลันในหญิงตั้งครรภ์ และคดีสัตว์เลี้ยงถูกสูบเลือดในเล้าปิดตายนานกว่า 4 ทศวรรษ"
    }];

    caseSelector.innerHTML = '<option value="krasue_case">แฟ้มคดีที่ 001: คดีกระสือ (Krasue Case)</option>';
    renderHomeCasesGrid(allCases);
  }

  caseSelector.addEventListener('change', (e) => {
    selectCase(e.target.value);
  });
}

// Render Case Cards Grid on Home Page
function renderHomeCasesGrid(cases) {
  const gridEl = document.getElementById('cases-cards-grid');
  const countEl = document.getElementById('cases-count');

  if (!gridEl) return;
  countEl.textContent = cases.length;
  gridEl.innerHTML = '';

  cases.forEach(c => {
    const card = document.createElement('div');
    card.className = 'case-card';

    const docBadgeText = c.totalDocs > 0 ? `${c.totalDocs} เอกสารในคดี` : `อยู่ในระหว่างเตรียมแฟ้ม`;

    card.innerHTML = `
      <div>
        <div class="case-card-header">
          <span class="case-card-id">${c.id}</span>
          <span class="case-card-clearance clearance-badge ${c.securityLevel}">${c.securityLevel}</span>
        </div>
        <h3 class="case-card-title">${c.title}</h3>
        <div class="case-card-period"><i class="fa-solid fa-clock-rotate-left"></i> ช่วงเวลา: ${c.period}</div>
        <p class="case-card-summary">${c.summary}</p>
      </div>

      <div class="case-card-footer">
        <span class="doc-count-badge"><i class="fa-solid fa-file-invoice"></i> ${docBadgeText}</span>
        <button class="open-case-btn" data-slug="${c.slug}">
          <i class="fa-solid fa-folder-open"></i> เปิดแฟ้มคดี
        </button>
      </div>
    `;

    // Click event to enter reader view
    card.querySelector('.open-case-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showReaderView(c.slug);
    });

    card.addEventListener('click', () => {
      showReaderView(c.slug);
    });

    gridEl.appendChild(card);
  });
}

// Select Active Case
async function selectCase(caseSlug) {
  activeCaseSlug = caseSlug;
  const currentCase = allCases.find(c => c.slug === caseSlug) || {
    id: "CASE-001",
    slug: "krasue_case",
    title: "แฟ้มคดีกระสือ",
    period: "1978 - 2025",
    securityLevel: "CONFIDENTIAL"
  };

  // Sync Dropdown
  const selector = document.getElementById('case-selector');
  if (selector) selector.value = caseSlug;

  // Update Case Info UI
  document.getElementById('case-badge-id').textContent = currentCase.id;
  document.getElementById('case-period-text').textContent = currentCase.period || '';
  document.getElementById('security-level-display').textContent = `CLEARANCE: ${currentCase.securityLevel || 'LEVEL 4'}`;

  // Load Case Manifest
  try {
    let manifestUrl = `cases/${caseSlug}/manifest.json`;
    let res = await fetch(manifestUrl);
    if (!res.ok) {
      manifestUrl = `documents/manifest.json`;
      res = await fetch(manifestUrl);
    }

    allDocuments = await res.json();
    populateTypeFilter(allDocuments);
    renderDocumentList(allDocuments);

    if (allDocuments.length > 0) {
      selectDocument(allDocuments[0].id);
    }
  } catch (error) {
    console.error(`Failed to load manifest for case ${caseSlug}:`, error);
  }
}

// Populate Type Filter Options Dynamically
function populateTypeFilter(documents) {
  const filterType = document.getElementById('filter-type');
  const types = [...new Set(documents.map(d => d.type))];
  
  filterType.innerHTML = '<option value="ALL">-- ทั้งหมด (ALL TYPES) --</option>';
  types.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    filterType.appendChild(opt);
  });
}

// Render Document List in Sidebar
function renderDocumentList(documents) {
  const listEl = document.getElementById('document-list');
  const countEl = document.getElementById('doc-count');
  
  countEl.textContent = documents.length;
  listEl.innerHTML = '';

  if (documents.length === 0) {
    listEl.innerHTML = '<li style="padding: 16px; color: #888;">ไม่พบเอกสารในแฟ้มนี้</li>';
    return;
  }

  documents.forEach(doc => {
    const li = document.createElement('li');
    li.className = `doc-item ${doc.id === activeDocumentId ? 'active' : ''}`;
    li.onclick = () => {
      selectDocument(doc.id);
      document.getElementById('sidebar').classList.remove('mobile-open');
      document.getElementById('sidebar-backdrop').classList.remove('active');
    };

    li.innerHTML = `
      <div class="doc-item-title">${doc.id}: ${doc.title}</div>
      <div class="doc-item-meta">
        <span>${doc.date}</span>
        <span class="clearance-badge ${doc.clearance}">${doc.clearance}</span>
      </div>
    `;

    listEl.appendChild(li);
  });
}

// Select and Load Specific Document
async function selectDocument(id) {
  activeDocumentId = id;
  const doc = allDocuments.find(d => d.id === id);
  if (!doc) return;

  // Update active state in sidebar
  document.querySelectorAll('.doc-item').forEach(item => {
    const isTarget = item.querySelector('.doc-item-title').textContent.startsWith(id);
    item.classList.toggle('active', isTarget);
  });

  // Update Header Metadata Bar
  document.getElementById('doc-meta-id').textContent = doc.id;
  document.getElementById('doc-meta-date').textContent = doc.date;
  document.getElementById('doc-meta-clearance').textContent = doc.clearance;
  document.getElementById('doc-meta-author').textContent = doc.author;
  document.getElementById('doc-meta-location').textContent = doc.location;
  document.getElementById('doc-meta-reliability').textContent = '★'.repeat(doc.reliability) + '☆'.repeat(5 - doc.reliability);

  // Update Rubber Stamp
  const stampEl = document.getElementById('stamp-badge');
  stampEl.textContent = doc.clearance;
  stampEl.className = `stamp stamp-${doc.clearance.toLowerCase()} ${doc.clearance}`;

  // Audio Player Handling
  const audioCard = document.getElementById('audio-player-card');
  const audioElement = document.getElementById('doc-audio-element');
  
  if (doc.audio) {
    audioCard.classList.remove('hidden');
    audioElement.src = doc.audio;
  } else {
    audioCard.classList.add('hidden');
    audioElement.removeAttribute('src');
  }

  // Fetch Markdown Content
  const bodyEl = document.getElementById('doc-content-body');
  bodyEl.innerHTML = '<p class="placeholder-text">กำลังโหลดเนื้อหาเอกสารลับ...</p>';

  try {
    let docUrl = `cases/${activeCaseSlug}/${doc.filename}`;
    let res = await fetch(docUrl);
    if (!res.ok) {
      docUrl = `documents/${doc.filename}`;
      res = await fetch(docUrl);
    }

    let rawText = await res.text();

    // Strip Frontmatter if present
    rawText = rawText.replace(/^---[\s\S]*?---/, '').trim();

    // Transform [REDACTED] or [REDACTED text] into HTML tags
    let processedText = rawText.replace(/\[REDACTED(.*?)\]/gi, (match, p1) => {
      const secret = p1 ? p1.trim() : 'CLASSIFIED DATA';
      return `<span class="redacted" title="คลิกเพื่อสลับดูข้อมูลลับ">${secret}</span>`;
    });

    // Parse Markdown using Marked.js if loaded
    if (window.marked) {
      bodyEl.innerHTML = marked.parse(processedText);
    } else {
      bodyEl.innerHTML = `<pre>${processedText}</pre>`;
    }

    // Attach click events to redacted spans
    bodyEl.querySelectorAll('.redacted').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('revealed');
      });
    });

  } catch (err) {
    bodyEl.innerHTML = `<p style="color:red;">[ERROR] ไม่สามารถโหลดไฟล์เนื้อหา ${doc.filename} ได้</p>`;
  }
}

// Setup Filters & Event Listeners
function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  const filterType = document.getElementById('filter-type');
  const chips = document.querySelectorAll('.chip');
  
  let currentClearance = 'ALL';

  const filterDocs = () => {
    const query = searchInput.value.toLowerCase().trim();
    const selectedType = filterType.value;

    const filtered = allDocuments.filter(doc => {
      const matchQuery = doc.title.toLowerCase().includes(query) ||
                         doc.id.toLowerCase().includes(query) ||
                         doc.author.toLowerCase().includes(query) ||
                         (doc.tags && doc.tags.some(t => t.toLowerCase().includes(query)));
      
      const matchType = selectedType === 'ALL' || doc.type === selectedType;
      const matchClearance = currentClearance === 'ALL' || doc.clearance === currentClearance;

      return matchQuery && matchType && matchClearance;
    });

    renderDocumentList(filtered);
  };

  if (searchInput) searchInput.addEventListener('input', filterDocs);
  if (filterType) filterType.addEventListener('change', filterDocs);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentClearance = chip.dataset.clearance;
      filterDocs();
    });
  });

  // Home Navigation Buttons
  document.getElementById('nav-home-btn').addEventListener('click', showHomeView);
  document.getElementById('brand-logo-btn').addEventListener('click', showHomeView);
  document.getElementById('back-to-home-btn').addEventListener('click', showHomeView);

  // Toggle Redact View
  const redactBtn = document.getElementById('toggle-redact');
  redactBtn.addEventListener('click', () => {
    showRedactedText = !showRedactedText;
    document.body.classList.toggle('show-redacted', showRedactedText);
    redactBtn.classList.toggle('active', showRedactedText);
  });

  // Toggle Realistic Paper View vs Clean Reader View
  const viewModeBtn = document.getElementById('toggle-view-mode');
  viewModeBtn.addEventListener('click', () => {
    isCleanMode = !isCleanMode;
    document.body.classList.toggle('clean-mode', isCleanMode);
    
    if (isCleanMode) {
      viewModeBtn.innerHTML = '<i class="fa-solid fa-file-lines"></i> Clean Mode';
      viewModeBtn.classList.remove('active');
    } else {
      viewModeBtn.innerHTML = '<i class="fa-solid fa-scroll"></i> Paper Mode';
      viewModeBtn.classList.add('active');
    }
  });

  // Print Document Button
  document.getElementById('print-doc-btn').addEventListener('click', () => {
    window.print();
  });
}
