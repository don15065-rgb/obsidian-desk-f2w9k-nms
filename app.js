/* ============================================================
   NOMI COMMAND CENTRE — APP.JS
   All logic, state, rendering, PWA setup, and data management
   ============================================================ */

'use strict';

// ── Constants & Config ────────────────────────────────────────
const STORAGE_KEY = 'nomi_command_v1';
const QUOTES = [
  "The obstacle is the way. — Marcus Aurelius",
  "Doing one thing at a time means doing it better than anything else. — Nassim Taleb",
  "The quieter you become, the more you can hear.",
  "Compliance is not a constraint on ambition. It is the architecture of it.",
  "You do not rise to the level of your goals. You fall to the level of your systems. — James Clear",
  "A man who has no patience has no wisdom. — Sindhi proverb",
  "The law is reason free from passion. — Aristotle",
  "Do not confuse motion with action. — Hemingway",
  "The most courageous act is still to think for yourself. Aloud. — Coco Chanel",
  "Transaction monitoring without context is noise. Context without monitoring is negligence.",
  "Either write something worth reading or do something worth writing. — Franklin",
  "The present moment is the only time over which we have dominion.",
];

const CATEGORIES = ['AML', 'Legal', 'Learning', 'Job Hunt', 'Freelance', 'Personal', 'Admin'];
const ENERGY_LEVELS = ['low', 'medium', 'high'];
const URGENCY_LEVELS = ['now', 'today', 'this week', 'someday'];
const TASK_STATUSES = ['not started', 'in progress', 'done'];
const JOB_STATUSES = ['saved', 'applied', 'followed up', 'interview', 'rejected', 'offer'];

const JOB_STATUS_COLORS = {
  'saved': '#4a5568',
  'applied': '#5b9cf6',
  'followed up': '#e8a44a',
  'interview': '#9b7fe8',
  'rejected': '#e05c5c',
  'offer': '#4caf7d'
};

// ── Default / Sample Data ─────────────────────────────────────
const DEFAULT_DATA = {
  mission: "Land a compliance role at a Pakistani fintech and keep building the international practice.",
  tasks: [
    { id: 'T1', title: 'Submit Upwork proposals — AML research and legal counsel roles', category: 'Job Hunt', energy: 'medium', urgency: 'today', status: 'not started', notes: 'Target: 3 proposals today. SadaPay, NayaPay, and fintech-adjacent', deadline: '', reminder: '' },
    { id: 'T2', title: 'Complete SQL JOINs module — INNER, LEFT, RIGHT with AML datasets', category: 'Learning', energy: 'medium', urgency: 'today', status: 'in progress', notes: 'Microsoft SQL Server Certificate program. Cross-reference transactions + customers tables', deadline: '', reminder: '' },
    { id: 'T3', title: 'Post LinkedIn thought leadership on transaction monitoring false positives', category: 'Job Hunt', energy: 'high', urgency: 'this week', status: 'not started', notes: 'Angle: cost of over-reporting vs. regulatory risk. Use FATF typologies reference', deadline: '', reminder: '' },
    { id: 'T4', title: 'Update CV to front-load CAMS certification and dual legal/operational positioning', category: 'Job Hunt', energy: 'medium', urgency: 'today', status: 'in progress', notes: 'Edinburgh dissertation as signal of FCA/PRA expertise. No em-dashes', deadline: '', reminder: '' },
    { id: 'T5', title: 'Follow up with bank contact from last week — compliance team intro', category: 'AML', energy: 'low', urgency: 'this week', status: 'not started', notes: 'Keep it brief. Ask for 15 min call. Not a job ask, a knowledge conversation', deadline: '', reminder: '' },
    { id: 'T6', title: 'Sign up for GLG and AlphaSights expert networks', category: 'Freelance', energy: 'low', urgency: 'this week', status: 'not started', notes: 'Profile angle: CAMS, transaction monitoring, Pakistani fintech regulatory landscape', deadline: '', reminder: '' },
    { id: 'T7', title: 'Practice transaction monitoring scenarios — layering typology set', category: 'Learning', energy: 'medium', urgency: 'this week', status: 'not started', notes: 'Use the ACAMS case study bank. Focus on structuring + smurfing patterns', deadline: '', reminder: '' },
    { id: 'T8', title: 'Read FATF Guidance on Proliferation Financing — sanctions screening relevance', category: 'AML', energy: 'high', urgency: 'this week', status: 'not started', notes: 'Note overlap with PF risk assessment for DNFBP sector', deadline: '', reminder: '' },
    { id: 'T9', title: 'Build next SQL playground module — GROUP BY and aggregate functions', category: 'Learning', energy: 'medium', urgency: 'this week', status: 'not started', notes: 'AML dataset: summarise alert counts by risk category and branch', deadline: '', reminder: '' },
    { id: 'T10', title: 'Cook something ambitious this weekend — proper Pakistani slow cook', category: 'Personal', energy: 'low', urgency: 'someday', status: 'not started', notes: 'You keep putting this off. You will enjoy it.', deadline: '', reminder: '' },
  ],
  brainDump: [
    { id: 'B1', text: 'Write a LinkedIn post about the FCA competitiveness objective and whether it will dilute AML standards', category: '' },
    { id: 'B2', text: 'Consider building a sanctions screening alert tuning case study as a portfolio piece', category: '' },
    { id: 'B3', text: 'Faiz Ahmad Faiz poem worth re-reading — Mujhse Pehli Si Muhabbat', category: '' },
    { id: 'B4', text: 'Look into Estonian e-Residency timeline — when does this become the next logical step?', category: '' },
  ],
  jobs: [
    { id: 'J1', company: 'SadaPay', role: 'AML/Compliance Analyst', platform: 'Direct', dateApplied: '2025-04-10', status: 'applied', contact: 'Careers portal', notes: 'Strong fintech fit. CAMS is a differentiator here.', nextAction: 'Follow up after 2 weeks' },
    { id: 'J2', company: 'NayaPay', role: 'Financial Crime Compliance', platform: 'LinkedIn', dateApplied: '', status: 'saved', contact: '', notes: 'Check for open compliance roles. SBP licensed EMI.', nextAction: 'Find direct contact' },
    { id: 'J3', company: 'Meezan Bank', role: 'Compliance Officer', platform: 'Rozee.pk', dateApplied: '2025-04-08', status: 'applied', contact: 'HR portal', notes: 'Traditional bank — lower preference but good credential builder', nextAction: 'Follow up email to HR' },
    { id: 'J4', company: 'Upwork Client (AML Research)', role: 'AML Regulatory Research', platform: 'Upwork', dateApplied: '2025-04-12', status: 'followed up', contact: 'client profile', notes: 'USD project. FATF methodology knowledge required', nextAction: 'Send revised proposal with Edinburgh dissertation signal' },
    { id: 'J5', company: 'Telenor Microfinance', role: 'AML Analyst', platform: 'LinkedIn', dateApplied: '2025-04-05', status: 'interview', contact: 'Sana Khalid, HR', notes: 'Digital banking arm. Interview scheduled', nextAction: 'Prepare TM/sanctions scenario answers' },
  ],
  learning: [
    { id: 'L1', topic: 'T-SQL for AML Compliance', level: 'Intermediate', nextLesson: 'JOINs: cross-referencing transactions with watch-lists', notes: 'Microsoft SQL Server Certificate program. AML-themed datasets.', pct: 35 },
    { id: 'L2', topic: 'Transaction Monitoring Operations', level: 'Advanced', nextLesson: 'Layering typology — structuring and smurfing detection logic', notes: 'ACAMS case studies + internal scenario building', pct: 68 },
    { id: 'L3', topic: 'Sanctions Screening and Alert Tuning', level: 'Intermediate', nextLesson: 'OFAC SDN list structure — fuzzy name matching logic', notes: 'Goal: niche positioning for international freelance', pct: 42 },
    { id: 'L4', topic: 'Financial Crime Case Studies', level: 'Intermediate', nextLesson: 'FATF Guidance on Proliferation Financing', notes: 'FATF, Egmont Group, Basel AML Index', pct: 50 },
    { id: 'L5', topic: 'RegTech Tools and Platforms', level: 'Beginner', nextLesson: 'Understand Actimize vs Temenos vs Oracle FCCM architecture', notes: 'Vendor cert pathway after SQL certificate', pct: 15 },
    { id: 'L6', topic: 'Spanish — Duolingo', level: 'Beginner', nextLesson: 'Past tense (preterite) — regular verbs', notes: 'Daily streak. Morning only.', pct: 22 },
  ],
  reminders: [],
  moodLog: [],
  weeklyReviews: [],
  quickCaptures: [],
  parkedThoughts: [],
};

// ── State ─────────────────────────────────────────────────────
let state = {};
let focusInterval = null;
let focusSeconds = 0;
let focusTotalSeconds = 0;
let focusTaskText = '';
let currentEditId = null;
let activeTaskFilter = 'now';

// ── Storage ───────────────────────────────────────────────────
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) { console.warn('Save failed', e); }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = { ...DEFAULT_DATA, ...JSON.parse(raw) };
    } else {
      state = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  } catch(e) {
    state = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function uid() {
  return '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

// ── Navigation ────────────────────────────────────────────────
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  document.querySelectorAll('[data-page="' + pageId + '"]').forEach(t => t.classList.add('active'));
  closeMobileDrawer();
  renderPage(pageId);
}

function renderPage(id) {
  switch(id) {
    case 'today':    renderToday(); break;
    case 'tasks':    renderTasks(); break;
    case 'brain':    renderBrain(); break;
    case 'jobs':     renderJobs(); break;
    case 'learning': renderLearning(); break;
    case 'focus':    renderFocusSetup(); break;
    case 'reminders':renderReminders(); break;
    case 'review':   renderReview(); break;
    case 'mood':     renderMood(); break;
    case 'settings': renderSettings(); break;
  }
}

function closeMobileDrawer() {
  document.getElementById('mobile-drawer').classList.remove('open');
}

// ── TODAY DASHBOARD ───────────────────────────────────────────
function renderToday() {
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('date-display').textContent =
    `${days[now.getDay()]}  /  ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const hour = now.getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting-text').textContent = greet + ', Nomi.';
  document.getElementById('mission-text').textContent = state.mission || 'Set your mission for today.';

  // Day progress
  const totalDayMin = 16 * 60; // 6am to 10pm
  const elapsedMin = Math.max(0, (hour - 6) * 60 + now.getMinutes());
  const pct = Math.min(100, Math.round((elapsedMin / totalDayMin) * 100));
  document.getElementById('day-progress-fill').style.width = pct + '%';
  document.getElementById('day-progress-label-left').textContent = '06:00';
  document.getElementById('day-progress-label-right').textContent = pct + '% through the day';

  // Top 3 priorities (now + today, not done, sorted by urgency)
  const priority = state.tasks
    .filter(t => t.status !== 'done' && (t.urgency === 'now' || t.urgency === 'today'))
    .slice(0, 3);

  const container = document.getElementById('today-priorities');
  if (priority.length === 0) {
    container.innerHTML = '<div class="empty-state">No urgent tasks. Either you are ahead of schedule or behind on planning.</div>';
  } else {
    container.innerHTML = priority.map((t, i) => `
      <div class="priority-item" onclick="openTask('${t.id}')">
        <span class="priority-num">${String(i+1).padStart(2,'0')}</span>
        <div>
          <div class="priority-title">${escHtml(t.title)}</div>
          <div class="priority-meta">
            <span class="tag tag-energy-${t.energy}">${t.energy}</span>
            <span class="tag tag-urgency-${t.urgency.replace(/ /g,'-')}">${t.urgency}</span>
            <span class="tag tag-cat-${t.category.toLowerCase().replace(/ /g,'-')}">${t.category}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Quick captures
  renderQuickCaptures();

  // Focus status
  const fb = document.getElementById('focus-status-badge');
  if (focusInterval) {
    fb.className = 'focus-badge active';
    fb.innerHTML = '<span class="focus-dot pulse"></span>Focus active &mdash; ' + focusTaskText.slice(0,30);
  } else {
    fb.className = 'focus-badge';
    fb.innerHTML = '<span class="focus-dot"></span>No active focus session';
  }
}

function renderQuickCaptures() {
  const list = document.getElementById('quick-capture-list');
  if (!list) return;
  if (!state.quickCaptures || state.quickCaptures.length === 0) {
    list.innerHTML = '';
    return;
  }
  list.innerHTML = state.quickCaptures.slice(-6).reverse().map(c => `
    <div class="dump-item">
      <span class="dump-item-text">${escHtml(c.text)}</span>
      <button class="btn btn-ghost btn-sm" onclick="captureToTask('${c.id}')">task</button>
      <button class="btn btn-ghost btn-sm" onclick="removeCaptureItem('${c.id}')">clear</button>
    </div>
  `).join('');
}

function addQuickCapture() {
  const inp = document.getElementById('quick-capture-input');
  const val = inp.value.trim();
  if (!val) return;
  if (!state.quickCaptures) state.quickCaptures = [];
  state.quickCaptures.push({ id: uid(), text: val, created: Date.now() });
  inp.value = '';
  saveState();
  renderQuickCaptures();
}

function captureToTask(id) {
  const item = (state.quickCaptures || []).find(c => c.id === id);
  if (!item) return;
  state.quickCaptures = state.quickCaptures.filter(c => c.id !== id);
  saveState();
  openNewTaskModal(item.text);
}

function removeCaptureItem(id) {
  state.quickCaptures = (state.quickCaptures || []).filter(c => c.id !== id);
  saveState();
  renderQuickCaptures();
}

function editMission() {
  const txt = document.getElementById('mission-text');
  const inp = document.getElementById('mission-input');
  txt.style.display = 'none';
  inp.style.display = 'block';
  inp.value = state.mission || '';
  inp.focus();
  inp.addEventListener('blur', saveMission, { once: true });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') inp.blur(); });
}

function saveMission() {
  const inp = document.getElementById('mission-input');
  state.mission = inp.value.trim();
  document.getElementById('mission-text').textContent = state.mission || 'Set your mission for today.';
  document.getElementById('mission-text').style.display = '';
  inp.style.display = 'none';
  saveState();
}

// ── TASKS ─────────────────────────────────────────────────────
function renderTasks() {
  const filter = activeTaskFilter;
  let tasks = [...state.tasks];

  if (filter === 'now') tasks = tasks.filter(t => t.urgency === 'now' && t.status !== 'done');
  else if (filter === 'today') tasks = tasks.filter(t => (t.urgency === 'now' || t.urgency === 'today') && t.status !== 'done');
  else if (filter === 'quick') tasks = tasks.filter(t => t.energy === 'low' && t.status !== 'done');
  else if (filter === 'done') tasks = tasks.filter(t => t.status === 'done');
  else if (filter === 'all') {} // all tasks

  const container = document.getElementById('task-list');
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === filter);
  });

  if (tasks.length === 0) {
    container.innerHTML = '<div class="empty-state">No tasks in this view. Well done, or add one.</div>';
    return;
  }

  // Sort: now first, then by status (in progress first)
  tasks.sort((a,b) => {
    const urgOrd = {now:0,today:1,'this week':2,someday:3};
    const statOrd = {'in progress':0,'not started':1,done:2};
    return (urgOrd[a.urgency]||3) - (urgOrd[b.urgency]||3) || (statOrd[a.status]||1) - (statOrd[b.status]||1);
  });

  container.innerHTML = tasks.map(t => `
    <div class="task-item ${t.status === 'done' ? 'done' : ''}" id="task-${t.id}">
      <button class="task-check ${t.status === 'done' ? 'checked' : ''}" onclick="toggleTask('${t.id}')"></button>
      <div class="task-body">
        <div class="task-title">${escHtml(t.title)}</div>
        <div class="task-tags">
          <span class="tag tag-urgency-${t.urgency.replace(/ /g,'-')}">${t.urgency}</span>
          <span class="tag tag-energy-${t.energy}">${t.energy}</span>
          <span class="tag tag-cat-${t.category.toLowerCase().replace(' ','-')}">${t.category}</span>
          <span class="tag tag-status-${t.status.replace(/ /g,'-')}">${t.status}</span>
        </div>
        ${t.notes ? `<div class="task-notes">${escHtml(t.notes)}</div>` : ''}
        ${t.deadline ? `<div class="task-deadline">Deadline: ${t.deadline}</div>` : ''}
      </div>
      <div class="task-actions">
        <button class="btn btn-ghost btn-sm btn-icon" onclick="openTask('${t.id}')" title="Edit">&#9998;</button>
        <button class="btn btn-danger btn-sm btn-icon" onclick="deleteTask('${t.id}')" title="Delete">&#10005;</button>
      </div>
    </div>
  `).join('');
}

function toggleTask(id) {
  const t = state.tasks.find(t => t.id === id);
  if (!t) return;
  t.status = t.status === 'done' ? 'not started' : 'done';
  saveState();
  renderTasks();
  if (document.getElementById('page-today').classList.contains('active')) renderToday();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  saveState();
  renderTasks();
}

function openTask(id) {
  const t = state.tasks.find(t => t.id === id);
  if (!t) return;
  currentEditId = id;
  populateTaskForm(t);
  document.getElementById('task-modal').classList.add('open');
}

function openNewTaskModal(prefill) {
  currentEditId = null;
  populateTaskForm({ title: prefill || '', category: 'AML', energy: 'medium', urgency: 'today', status: 'not started', notes: '', deadline: '', reminder: '' });
  document.getElementById('task-modal').classList.add('open');
}

function populateTaskForm(t) {
  document.getElementById('tf-title').value = t.title || '';
  document.getElementById('tf-category').value = t.category || 'AML';
  document.getElementById('tf-energy').value = t.energy || 'medium';
  document.getElementById('tf-urgency').value = t.urgency || 'today';
  document.getElementById('tf-status').value = t.status || 'not started';
  document.getElementById('tf-notes').value = t.notes || '';
  document.getElementById('tf-deadline').value = t.deadline || '';
  document.getElementById('tf-reminder').value = t.reminder || '';
}

function saveTaskForm() {
  const title = document.getElementById('tf-title').value.trim();
  if (!title) { showNotif('Task title required.', 'error'); return; }
  const t = {
    title,
    category: document.getElementById('tf-category').value,
    energy:   document.getElementById('tf-energy').value,
    urgency:  document.getElementById('tf-urgency').value,
    status:   document.getElementById('tf-status').value,
    notes:    document.getElementById('tf-notes').value.trim(),
    deadline: document.getElementById('tf-deadline').value,
    reminder: document.getElementById('tf-reminder').value,
  };

  if (currentEditId) {
    const idx = state.tasks.findIndex(x => x.id === currentEditId);
    if (idx > -1) { state.tasks[idx] = { ...state.tasks[idx], ...t }; }
  } else {
    state.tasks.unshift({ id: uid(), ...t });
  }

  // Schedule reminder if set
  if (t.reminder) scheduleReminder(t.title, t.reminder);

  const wasEditing = !!currentEditId;
  saveState();
  closeModal('task-modal');
  renderTasks();
  if (document.getElementById('page-today').classList.contains('active')) renderToday();
  showNotif(wasEditing ? 'Task updated.' : 'Task added.', 'ok');
}

// ── BRAIN DUMP ────────────────────────────────────────────────
function renderBrain() {
  const list = document.getElementById('brain-list');
  if (!state.brainDump || state.brainDump.length === 0) {
    list.innerHTML = '<div class="empty-state">The mind is clear. Enjoy it while it lasts.</div>';
    return;
  }
  list.innerHTML = state.brainDump.map(item => `
    <div class="dump-item" id="dump-${item.id}">
      <span class="dump-item-text">${escHtml(item.text)}</span>
      ${item.category ? `<span class="tag">${escHtml(item.category)}</span>` : ''}
      <button class="btn btn-primary btn-sm" onclick="dumpToTask('${item.id}')">task</button>
      <button class="btn btn-danger btn-sm btn-icon" onclick="deleteDump('${item.id}')">&#10005;</button>
    </div>
  `).join('');
}

function addBrainItem() {
  const inp = document.getElementById('brain-dump-input');
  const raw = inp.value.trim();
  if (!raw) return;
  // Split by line break
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  lines.forEach(line => {
    state.brainDump.push({ id: uid(), text: line, category: '' });
  });
  inp.value = '';
  saveState();
  renderBrain();
}

function deleteDump(id) {
  state.brainDump = state.brainDump.filter(i => i.id !== id);
  saveState();
  renderBrain();
}

function dumpToTask(id) {
  const item = state.brainDump.find(i => i.id === id);
  if (!item) return;
  openNewTaskModal(item.text);
}

function organiseChaos() {
  if (!state.brainDump || state.brainDump.length === 0) {
    showNotif('Nothing to organise. Add some chaos first.', 'info');
    return;
  }

  const catMap = {
    'Tasks':      ['do','finish','complete','submit','build','write','update','fix','review','send','call','email','make','create','read','prepare','practice'],
    'Job search': ['apply','application','upwork','linkedin','salary','interview','cv','resume','proposal','sadapay','nayapay','bank','meezan','telenor','freelance','client'],
    'Learning':   ['learn','sql','aml','study','practice','read','understand','research','typology','sanctions','transaction','monitoring','cams','course','certificate'],
    'Ideas':      ['idea','maybe','consider','what if','could','explore','think','wonder','potential','concept'],
    'Worries':    ['worried','concern','problem','issue','stuck','not sure','anxious','stress','afraid','behind'],
  };

  state.brainDump = state.brainDump.map(item => {
    if (item.category) return item;
    const lower = item.text.toLowerCase();
    let assigned = 'Personal';
    for (const [cat, keywords] of Object.entries(catMap)) {
      if (keywords.some(kw => lower.includes(kw))) {
        assigned = cat;
        break;
      }
    }
    return { ...item, category: assigned };
  });

  saveState();
  renderBrain();
  showNotif('Chaos organised. Review the categories and convert to tasks.', 'ok');
}

// ── JOB HUNT ─────────────────────────────────────────────────
function renderJobs() {
  // Pipeline board
  const board = document.getElementById('pipeline-board');
  board.innerHTML = JOB_STATUSES.map(status => {
    const jobs = state.jobs.filter(j => j.status === status);
    const col = `
      <div class="pipeline-col">
        <div class="pipeline-col-head" style="color:${JOB_STATUS_COLORS[status]};background:${JOB_STATUS_COLORS[status]}22">
          ${status} (${jobs.length})
        </div>
        ${jobs.map(j => `
          <div class="pipeline-card" onclick="openJob('${j.id}')">
            <div class="company">${escHtml(j.company)}</div>
            <div class="role">${escHtml(j.role)}</div>
            <div class="platform">${escHtml(j.platform)}</div>
          </div>
        `).join('')}
      </div>
    `;
    return col;
  }).join('');

  // Table
  const tbody = document.getElementById('jobs-tbody');
  tbody.innerHTML = state.jobs.map(j => `
    <tr onclick="openJob('${j.id}')" style="cursor:pointer">
      <td><strong>${escHtml(j.company)}</strong></td>
      <td>${escHtml(j.role)}</td>
      <td>${escHtml(j.platform)}</td>
      <td>${j.dateApplied || '—'}</td>
      <td><span style="color:${JOB_STATUS_COLORS[j.status]};font-family:var(--font-mono);font-size:0.62rem;text-transform:uppercase;letter-spacing:0.08em">${j.status}</span></td>
      <td class="text-muted">${escHtml(j.nextAction || '—')}</td>
    </tr>
  `).join('');
}

function openJob(id) {
  const j = state.jobs.find(j => j.id === id) || {};
  currentEditId = id || null;
  document.getElementById('jf-company').value = j.company || '';
  document.getElementById('jf-role').value = j.role || '';
  document.getElementById('jf-platform').value = j.platform || '';
  document.getElementById('jf-date').value = j.dateApplied || '';
  document.getElementById('jf-status').value = j.status || 'saved';
  document.getElementById('jf-contact').value = j.contact || '';
  document.getElementById('jf-notes').value = j.notes || '';
  document.getElementById('jf-next').value = j.nextAction || '';
  document.getElementById('job-modal').classList.add('open');
}

function openNewJob() {
  currentEditId = null;
  document.querySelectorAll('#job-form input, #job-form textarea, #job-form select').forEach(el => { if (el.tagName === 'SELECT') el.value = 'saved'; else el.value = ''; });
  document.getElementById('job-modal').classList.add('open');
}

function saveJobForm() {
  const company = document.getElementById('jf-company').value.trim();
  if (!company) { showNotif('Company name required.', 'error'); return; }
  const j = {
    company,
    role:        document.getElementById('jf-role').value.trim(),
    platform:    document.getElementById('jf-platform').value.trim(),
    dateApplied: document.getElementById('jf-date').value,
    status:      document.getElementById('jf-status').value,
    contact:     document.getElementById('jf-contact').value.trim(),
    notes:       document.getElementById('jf-notes').value.trim(),
    nextAction:  document.getElementById('jf-next').value.trim(),
  };

  if (currentEditId) {
    const idx = state.jobs.findIndex(x => x.id === currentEditId);
    if (idx > -1) state.jobs[idx] = { ...state.jobs[idx], ...j };
  } else {
    state.jobs.unshift({ id: uid(), ...j });
  }
  const wasEditing = !!currentEditId;
  saveState();
  closeModal('job-modal');
  renderJobs();
  showNotif(wasEditing ? 'Application updated.' : 'Application tracked.', 'ok');
}

function deleteJob() {
  if (!currentEditId) return;
  if (!confirm('Remove this application?')) return;
  state.jobs = state.jobs.filter(j => j.id !== currentEditId);
  saveState();
  closeModal('job-modal');
  renderJobs();
}

// ── LEARNING ─────────────────────────────────────────────────
function renderLearning() {
  const list = document.getElementById('learning-list');
  list.innerHTML = state.learning.map(item => `
    <div class="learning-item">
      <div class="learning-header">
        <div>
          <div class="learning-topic">${escHtml(item.topic)}</div>
          <div class="learning-level">${escHtml(item.level)}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="editLearning('${item.id}')">Edit</button>
        </div>
      </div>
      <div class="learning-pct">${item.pct}%</div>
      <div class="learning-progress-wrap">
        <div class="learning-progress-fill" style="width:${item.pct}%"></div>
      </div>
      <div class="learning-next">
        <span>Next:</span>${escHtml(item.nextLesson)}
      </div>
      ${item.notes ? `<div class="text-muted mt-8">${escHtml(item.notes)}</div>` : ''}
    </div>
  `).join('');
}

function editLearning(id) {
  const item = state.learning.find(l => l.id === id);
  if (!item) return;
  currentEditId = id;
  document.getElementById('lf-topic').value = item.topic;
  document.getElementById('lf-level').value = item.level;
  document.getElementById('lf-next').value = item.nextLesson;
  document.getElementById('lf-notes').value = item.notes || '';
  document.getElementById('lf-pct').value = item.pct;
  document.getElementById('learning-modal').classList.add('open');
}

function openNewLearning() {
  currentEditId = null;
  document.querySelectorAll('#learning-form input, #learning-form textarea').forEach(el => el.value = '');
  document.getElementById('lf-pct').value = 0;
  document.getElementById('learning-modal').classList.add('open');
}

function saveLearningForm() {
  const topic = document.getElementById('lf-topic').value.trim();
  if (!topic) { showNotif('Topic required.', 'error'); return; }
  const item = {
    topic,
    level:      document.getElementById('lf-level').value.trim(),
    nextLesson: document.getElementById('lf-next').value.trim(),
    notes:      document.getElementById('lf-notes').value.trim(),
    pct:        parseInt(document.getElementById('lf-pct').value) || 0,
  };
  if (currentEditId) {
    const idx = state.learning.findIndex(l => l.id === currentEditId);
    if (idx > -1) state.learning[idx] = { ...state.learning[idx], ...item };
  } else {
    state.learning.push({ id: uid(), ...item });
  }
  saveState();
  closeModal('learning-modal');
  renderLearning();
  showNotif('Learning tracker updated.', 'ok');
}

// ── FOCUS MODE ────────────────────────────────────────────────
let selectedDuration = 25;
let selectedTaskForFocus = '';

function renderFocusSetup() {
  // Populate task picker
  const sel = document.getElementById('focus-task-picker');
  const activeTasks = state.tasks.filter(t => t.status !== 'done');
  sel.innerHTML = '<option value="">— Choose a task to focus on —</option>' +
    activeTasks.map(t => `<option value="${escHtml(t.title)}">${escHtml(t.title)}</option>`).join('');

  // Parked thoughts
  const parkedList = document.getElementById('parked-list');
  const thoughts = state.parkedThoughts || [];
  if (thoughts.length === 0) {
    parkedList.innerHTML = '<div class="text-muted" style="font-family:var(--font-mono);font-size:0.7rem">Thoughts parked during focus sessions appear here and in Brain Dump.</div>';
  } else {
    parkedList.innerHTML = thoughts.slice().reverse().map(p => `
      <div class="dump-item">
        <span class="dump-item-text">${escHtml(p.text)}</span>
        <button class="btn btn-ghost btn-sm" onclick="parkedToTask('${p.id}')">task</button>
        <button class="btn btn-danger btn-sm btn-icon" onclick="removeParked('${p.id}')">&#10005;</button>
      </div>
    `).join('');
  }
}

function parkedToTask(id) {
  const item = (state.parkedThoughts || []).find(p => p.id === id);
  if (!item) return;
  state.parkedThoughts = state.parkedThoughts.filter(p => p.id !== id);
  saveState();
  openNewTaskModal(item.text);
}

function removeParked(id) {
  state.parkedThoughts = (state.parkedThoughts || []).filter(p => p.id !== id);
  saveState();
  renderFocusSetup();
}

function selectDuration(mins, btn) {
  selectedDuration = mins;
  document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
}

function startFocus() {
  const task = document.getElementById('focus-task-picker').value || 'Deep work session';
  const customVal = document.getElementById('focus-custom-mins').value;
  const mins = customVal ? parseInt(customVal) : selectedDuration;
  if (!mins || mins < 1) { showNotif('Select a duration first.', 'error'); return; }

  focusTotalSeconds = mins * 60;
  focusSeconds = focusTotalSeconds;
  focusTaskText = task;
  selectedTaskForFocus = task;

  document.getElementById('focus-task-display').textContent = task;
  document.getElementById('focus-phase-label').textContent =
    mins <= 25 ? 'Sprint' : mins <= 45 ? 'Deep work' : 'Hyperfocus block';
  document.getElementById('focus-quote').textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById('focus-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';

  updateFocusDisplay();
  clearInterval(focusInterval);
  focusInterval = setInterval(() => {
    focusSeconds--;
    updateFocusDisplay();
    if (focusSeconds <= 0) {
      clearInterval(focusInterval);
      focusInterval = null;
      endFocus(true);
    }
  }, 1000);

  if (document.getElementById('page-today').classList.contains('active')) {
    document.getElementById('focus-status-badge').className = 'focus-badge active';
    document.getElementById('focus-status-badge').innerHTML = '<span class="focus-dot pulse"></span>Focus active';
  }
}

function updateFocusDisplay() {
  const m = Math.floor(focusSeconds / 60);
  const s = focusSeconds % 60;
  document.getElementById('focus-timer').textContent =
    String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');

  const pct = 1 - (focusSeconds / focusTotalSeconds);
  const circ = document.getElementById('focus-ring-circle');
  if (circ) {
    const r = 140;
    const circumference = 2 * Math.PI * r;
    circ.style.strokeDashoffset = circumference * (1 - pct);
  }
}

function endFocus(completed) {
  clearInterval(focusInterval);
  focusInterval = null;
  document.getElementById('focus-overlay').classList.remove('active');
  document.body.style.overflow = '';
  if (completed) {
    showNotif('Focus session complete. Well done.', 'ok');
    // Mark task in progress if found
    const t = state.tasks.find(t => t.title === focusTaskText && t.status === 'not started');
    if (t) { t.status = 'in progress'; saveState(); }
  }
  if (document.getElementById('page-today').classList.contains('active')) renderToday();
}

function parkDistraction() {
  const inp = document.getElementById('focus-park-input');
  const val = inp.value.trim();
  if (!val) return;
  if (!state.parkedThoughts) state.parkedThoughts = [];
  state.parkedThoughts.push({ id: uid(), text: val, created: Date.now() });
  state.brainDump.push({ id: uid(), text: val, category: '' });
  inp.value = '';
  saveState();
  showNotif('Thought parked. Back to work.', 'ok');
}

// ── REMINDERS ─────────────────────────────────────────────────
function renderReminders() {
  if ('Notification' in window && Notification.permission === 'default') {
    document.getElementById('notif-request').style.display = 'block';
  } else {
    document.getElementById('notif-request').style.display = 'none';
  }
  const list = document.getElementById('reminder-list');
  if (!state.reminders || state.reminders.length === 0) {
    list.innerHTML = '<div class="empty-state">No reminders set.</div>';
    return;
  }
  const now = Date.now();
  list.innerHTML = state.reminders.map(r => `
    <div class="reminder-item">
      <div class="reminder-time">${r.time || '—'}</div>
      <div class="reminder-text">${escHtml(r.text)}</div>
      <div class="reminder-status-dot ${r.timestamp > now ? 'upcoming' : ''}"></div>
      <button class="btn btn-danger btn-sm btn-icon" onclick="deleteReminder('${r.id}')">&#10005;</button>
    </div>
  `).join('');
}

function addReminder() {
  const text = document.getElementById('reminder-text-input').value.trim();
  const time = document.getElementById('reminder-time-input').value;
  if (!text || !time) { showNotif('Enter reminder text and time.', 'error'); return; }

  const timestamp = new Date(time).getTime();
  const r = { id: uid(), text, time, timestamp };
  state.reminders.push(r);
  saveState();
  scheduleReminder(text, time, r.id);
  document.getElementById('reminder-text-input').value = '';
  document.getElementById('reminder-time-input').value = '';
  renderReminders();
  showNotif('Reminder set.', 'ok');
}

function deleteReminder(id) {
  state.reminders = state.reminders.filter(r => r.id !== id);
  saveState();
  renderReminders();
}

function scheduleReminder(text, timeStr, id) {
  const target = new Date(timeStr).getTime();
  const now = Date.now();
  const delay = target - now;
  if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nomi Command Centre', { body: text, icon: 'icons/icon-192.png' });
      }
      showNotif(text, 'reminder');
    }, delay);
  }
}

function requestNotifPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(p => {
      if (p === 'granted') showNotif('Notifications enabled.', 'ok');
      renderReminders();
    });
  }
}

// ── MOOD ─────────────────────────────────────────────────────
let todayMood = { mood: 0, energy: 0, stress: 0, notes: '' };

function renderMood() {
  renderMoodChart();
}

function selectMoodBtn(group, value) {
  document.querySelectorAll(`[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
  document.querySelectorAll(`[data-group="${group}"][data-value="${value}"]`).forEach(b => b.classList.add('selected'));
  todayMood[group] = value;
}

function saveMoodEntry() {
  todayMood.notes = document.getElementById('mood-notes').value.trim();
  todayMood.date = new Date().toLocaleDateString('en-GB');
  todayMood.ts = Date.now();
  if (!state.moodLog) state.moodLog = [];
  const today = new Date().toDateString();
  const existing = state.moodLog.findIndex(m => new Date(m.ts).toDateString() === today);
  if (existing > -1) state.moodLog[existing] = { ...todayMood };
  else state.moodLog.push({ ...todayMood });
  saveState();
  renderMoodChart();
  showNotif('Check-in saved.', 'ok');
}

function renderMoodChart() {
  const chart = document.getElementById('mood-chart');
  if (!state.moodLog || state.moodLog.length === 0) {
    chart.innerHTML = '<div class="empty-state">No check-ins yet. Patterns emerge with consistency.</div>';
    return;
  }
  const last14 = state.moodLog.slice(-14);
  chart.innerHTML = `
    <div class="section-label">Mood — last ${last14.length} entries</div>
    <div class="mood-chart-row">
      ${last14.map(m => `
        <div class="mood-bar" style="height:${(m.mood/5)*100}%;background:var(--gold-dim)" data-tip="${m.date}: ${m.mood}/5"></div>
      `).join('')}
    </div>
    <div style="margin-top:12px" class="section-label">Energy</div>
    <div class="mood-chart-row">
      ${last14.map(m => `
        <div class="mood-bar" style="height:${(m.energy/5)*100}%;background:var(--cyan-dim)" data-tip="${m.date}: ${m.energy}/5"></div>
      `).join('')}
    </div>
  `;
}

// ── WEEKLY REVIEW ─────────────────────────────────────────────
function renderReview() {
  const doneTasks = state.tasks.filter(t => t.status === 'done').length;
  const jobApps = state.jobs.filter(j => j.dateApplied).length;
  const learningAvgPct = state.learning.length ? Math.round(state.learning.reduce((s,l) => s + l.pct, 0) / state.learning.length) : 0;
  document.getElementById('review-done-count').textContent = doneTasks;
  document.getElementById('review-job-count').textContent = jobApps;
  document.getElementById('review-learning-pct').textContent = learningAvgPct + '%';

  // Load saved review if exists
  const weekReview = state.weeklyReviews && state.weeklyReviews[0];
  if (weekReview) {
    document.getElementById('review-wins').value = weekReview.wins || '';
    document.getElementById('review-mission-next').value = weekReview.nextMission || '';
    const level = weekReview.chaosLevel;
    if (level) {
      document.querySelectorAll('.chaos-dot').forEach(d => {
        d.classList.toggle('selected', d.dataset.level == level);
      });
    }
  }
}

function selectChaos(level) {
  document.querySelectorAll('.chaos-dot').forEach(d => {
    d.classList.toggle('selected', d.dataset.level == level);
  });
}

function saveWeeklyReview() {
  const chaosEl = document.querySelector('.chaos-dot.selected');
  const review = {
    date: new Date().toLocaleDateString('en-GB'),
    ts: Date.now(),
    wins: document.getElementById('review-wins').value.trim(),
    nextMission: document.getElementById('review-mission-next').value.trim(),
    chaosLevel: chaosEl ? parseInt(chaosEl.dataset.level) : 3,
    doneTasks: state.tasks.filter(t => t.status === 'done').length,
    jobApps: state.jobs.filter(j => j.dateApplied).length,
  };
  if (!state.weeklyReviews) state.weeklyReviews = [];
  state.weeklyReviews.unshift(review);
  saveState();
  showNotif('Weekly review saved.', 'ok');
}

// ── SETTINGS / EXPORT ─────────────────────────────────────────
function renderSettings() {}

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nomi-command-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showNotif('Data exported as JSON.', 'ok');
}

function exportCSV() {
  const headers = 'Title,Category,Energy,Urgency,Status,Deadline,Notes\n';
  const rows = state.tasks.map(t =>
    [t.title, t.category, t.energy, t.urgency, t.status, t.deadline, t.notes]
      .map(v => `"${(v||'').replace(/"/g,'""')}"`)
      .join(',')
  ).join('\n');
  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nomi-tasks-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  showNotif('Tasks exported as CSV.', 'ok');
}

function triggerImport() {
  document.getElementById('import-file').click();
}

function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const imported = JSON.parse(ev.target.result);
      state = { ...DEFAULT_DATA, ...imported };
      saveState();
      showNotif('Backup restored.', 'ok');
      renderPage(document.querySelector('.page.active')?.id?.replace('page-','') || 'today');
    } catch(err) {
      showNotif('Import failed — invalid file.', 'error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function clearAllData() {
  if (!confirm('This will delete all your data and reset to defaults. Are you sure?')) return;
  state = JSON.parse(JSON.stringify(DEFAULT_DATA));
  saveState();
  showNotif('All data cleared. Defaults restored.', 'ok');
  navigate('today');
}

// ── NOTIFICATION BANNER ───────────────────────────────────────
let notifTimeout;
function showNotif(msg, type = 'info') {
  const b = document.getElementById('notif-banner');
  const icon = type === 'ok' ? '&#10003;' : type === 'error' ? '&#10005;' : type === 'reminder' ? '&#9654;' : '&#9432;';
  b.innerHTML = `<strong>${icon} Command Centre</strong>${msg}`;
  b.classList.add('show');
  clearTimeout(notifTimeout);
  notifTimeout = setTimeout(() => b.classList.remove('show'), 3400);
}

// ── MODAL UTILS ───────────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  currentEditId = null;
}

// ── HELPERS ───────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ── PWA / SERVICE WORKER ──────────────────────────────────────
function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .catch(e => console.warn('SW registration failed', e));
    });
  }
}

// ── INIT ──────────────────────────────────────────────────────
function init() {
  loadState();
  registerSW();

  // Build nav event listeners
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => navigate(tab.dataset.page));
  });

  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-drawer').classList.toggle('open');
  });

  // Quick capture enter key
  document.getElementById('quick-capture-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addQuickCapture();
  });

  // Brain dump enter key (Shift+Enter for new line, Enter to add)
  document.getElementById('brain-dump-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addBrainItem(); }
  });

  // Task filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTaskFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Chaos rating
  document.querySelectorAll('.chaos-dot').forEach(dot => {
    dot.addEventListener('click', () => selectChaos(dot.dataset.level));
  });

  // Mood buttons
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => selectMoodBtn(btn.dataset.group, parseInt(btn.dataset.value)));
  });

  // Duration buttons
  document.querySelectorAll('.duration-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const m = parseInt(this.dataset.mins);
      selectDuration(m, this);
    });
  });

  // Mission click to edit
  document.getElementById('mission-text').addEventListener('click', editMission);

  // Focus park input enter
  document.getElementById('focus-park-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') parkDistraction();
  });

  // Import file
  document.getElementById('import-file').addEventListener('change', importJSON);

  // Reschedule any future reminders
  if (state.reminders) {
    state.reminders.forEach(r => {
      if (r.timestamp > Date.now()) scheduleReminder(r.text, r.time, r.id);
    });
  }

  // Start on today
  navigate('today');
}

document.addEventListener('DOMContentLoaded', init);
