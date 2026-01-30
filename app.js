/**
 * Platform Health Report Dashboard – Charts, Dummy Data & Interactivity
 */

const chartColors = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#a855f7',
  cyan: '#06b6d4',
  muted: '#8b9cb4',
  grid: '#2d3a4d',
};

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: { color: chartColors.muted, font: { size: 11 } },
    },
  },
  scales: {
    x: {
      grid: { color: chartColors.grid },
      ticks: { color: chartColors.muted, maxRotation: 45 },
    },
    y: {
      grid: { color: chartColors.grid },
      ticks: { color: chartColors.muted },
    },
  },
};

// ========== Dummy data (varies by team / subTeam / week) ==========
const TEAMS = ['Revex', 'Payments', 'Identity'];
const SUB_TEAMS = { Revex: ['Communities', 'Feed', 'Moderation'], Payments: ['Checkout', 'Billing', 'Refunds'], Identity: ['Auth', 'SSO', 'MFA'] };
const WEEKS = [30, 31, 32, 33];

function getSnapshotDummyData(team, subTeam, week) {
  const seed = team.length + subTeam.length + week;
  return {
    incidents: {
      status: 'regression',
      summary: 'P0/P1 increased vs last week',
      icon: '⚠️',
      detail: {
        title: 'Incidents',
        rows: [
          { label: 'P0 this week', value: '0', trend: '—' },
          { label: 'P1 this week', value: '2', trend: '+1 vs last week' },
          { label: 'MTTA', value: '6m 12s', trend: '↓ improved' },
          { label: 'MTTR', value: '21m', trend: '↑ 4m longer' },
          { label: 'Unacknowledged', value: '1', trend: 'Alert fatigue risk' },
        ],
        bullets: [
          { text: 'Aug 6: Feed ingestion delay (P1, 18 min)', dot: 'yellow' },
          { text: 'Aug 8: Moderation API latency spike (P1, 23 min)', dot: 'yellow' },
        ],
      },
    },
    performance: {
      status: 'regression',
      summary: 'API latency regressed (2 endpoints)',
      icon: '📈',
      detail: {
        title: 'Performance',
        rows: [
          { label: '/api/feed P95', value: '168 ms', trend: '+24 ms WoW' },
          { label: '/api/posts P95', value: '90 ms', trend: 'Stable' },
          { label: '/api/moderation P95', value: '142 ms', trend: '+18 ms' },
          { label: 'P99 feed', value: '312 ms', trend: 'Above SLO 300 ms' },
        ],
        bullets: [
          { text: 'feed-timeout alert triggered 11× this week', dot: 'red' },
          { text: 'Cache hit rate 87% (target 90%)', dot: 'yellow' },
        ],
      },
    },
    frontend: {
      status: 'stable',
      summary: 'Core Web Vitals stable',
      icon: '🌐',
      detail: {
        title: 'Frontend',
        rows: [
          { label: 'LCP', value: '1.8 s', trend: '✓ Good' },
          { label: 'FID', value: '42 ms', trend: '✓ Good' },
          { label: 'CLS', value: '0.04', trend: '✓ Good' },
          { label: 'JS errors (7d)', value: '12', trend: 'Minor +2' },
        ],
        bullets: [
          { text: 'Communities Web and Mobile Web within targets', dot: 'green' },
        ],
      },
    },
    infrastructure: {
      status: 'warning',
      summary: 'Memory pressure in 1 service',
      icon: '🖥️',
      detail: {
        title: 'Infrastructure',
        rows: [
          { label: 'moderation-worker memory p95', value: '86%', trend: '⚠ Above 85%' },
          { label: 'feed-api CPU', value: '62%', trend: 'Within limits' },
          { label: 'Redis memory', value: '71%', trend: 'OK' },
          { label: 'GKE nodes', value: '12', trend: 'No scaling issues' },
        ],
        bullets: [
          { text: 'OOM risk if traffic spikes on moderation-worker', dot: 'yellow' },
          { text: 'Recommend tuning concurrency and heap', dot: 'yellow' },
        ],
      },
    },
    cost: {
      status: 'regression',
      summary: '+8% WoW (Compute)',
      icon: '💰',
      detail: {
        title: 'Cost',
        rows: [
          { label: 'Total weekly cost', value: '$124,300', trend: '+8% WoW' },
          { label: 'Compute share', value: '41%', trend: 'Top driver' },
          { label: 'Feed-indexer', value: '$18,200', trend: '+12%' },
          { label: 'Moderation-worker', value: '$9,400', trend: '+6%' },
        ],
        bullets: [
          { text: 'Review autoscaling for feed-api + feed-indexer', dot: 'yellow' },
        ],
      },
    },
    testQuality: {
      status: 'critical',
      summary: '1 P0 + 4 P1 failures',
      icon: '🧪',
      detail: {
        title: 'Test Quality',
        rows: [
          { label: 'Pass rate', value: '98.4%', trend: '+1.2% WoW' },
          { label: 'P0 failures', value: '1', trend: 'Feed cache-miss flow' },
          { label: 'P1 failures', value: '4', trend: 'Moderation, reactions' },
          { label: 'P2 stable', value: 'Yes', trend: '—' },
        ],
        bullets: [
          { text: 'P0: feed load under cache-miss – blocks safe release', dot: 'red' },
          { text: 'P1: moderation and async workflows need fixes', dot: 'yellow' },
        ],
      },
    },
  };
}

function getOverallStatusDummyData(team, subTeam, week) {
  return {
    status: 'watch', // 'good' | 'watch' | 'critical'
    label: '🟡 Watch',
    breakdown: [
      'P1 incidents up vs last week',
      'API latency regressed on 2 endpoints',
      'Memory pressure in moderation-worker',
      '1 P0 integration test failure',
      'Cost +8% WoW',
    ],
  };
}

// When week/team changes, we could vary the status for demo
function getOverallForFilters(team, subTeam, week) {
  const d = getOverallStatusDummyData(team, subTeam, week);
  if (week === 33) {
    return { ...d, status: 'good', label: '🟢 Good', breakdown: ['All metrics within targets this week.'] };
  }
  if (week === 30) {
    return { ...d, status: 'critical', label: '🔴 Critical', breakdown: ['P1 outage; MTTR > 30m; 2 P0 test failures.'] };
  }
  return d;
}

// ========== App state ==========
let state = {
  team: 'Revex',
  subTeam: 'Communities',
  week: 32,
};
let chartInstances = {};

// ========== DOM helpers ==========
function getSnapshotData() {
  return getSnapshotDummyData(state.team, state.subTeam, state.week);
}

function renderHeader() {
  const teamSelect = document.getElementById('filterTeam');
  const subTeamSelect = document.getElementById('filterSubTeam');
  const weekSelect = document.getElementById('filterWeek');
  const overallBtn = document.getElementById('btnOverallStatus');
  const overallText = document.getElementById('overallStatusText');

  if (teamSelect) teamSelect.value = state.team;
  if (weekSelect) weekSelect.value = String(state.week);

  if (subTeamSelect) {
    subTeamSelect.innerHTML = (SUB_TEAMS[state.team] || []).map(st => `<option value="${st}" ${st === state.subTeam ? 'selected' : ''}>${st}</option>`).join('');
  }

  const overall = getOverallForFilters(state.team, state.subTeam, state.week);
  if (overallBtn && overallText) {
    overallText.textContent = overall.label;
    overallBtn.className = 'status-badge ' + overall.status;
    overallBtn.setAttribute('aria-expanded', 'false');
  }

  const breakdownList = document.getElementById('statusBreakdownList');
  const breakdownPanel = document.getElementById('statusBreakdown');
  if (breakdownList && breakdownPanel) {
    breakdownList.innerHTML = overall.breakdown.map(b => `<li>${b}</li>`).join('');
    breakdownPanel.classList.add('hidden');
    breakdownPanel.hidden = true;
  }
}

function renderSnapshotCards() {
  const data = getSnapshotData();
  const cards = document.querySelectorAll('.snapshot-grid .metric-card[data-metric]');
  cards.forEach(card => {
    const key = card.getAttribute('data-metric');
    const m = data[key];
    if (!m) return;
    const valueEl = card.querySelector('[data-value]');
    if (valueEl) valueEl.textContent = m.summary;
    card.className = 'metric-card ' + m.status + ' ' + (card.className.includes('metric-card') ? '' : '');
    card.className = 'metric-card ' + m.status;
  });
}

function openModal(metricKey) {
  const data = getSnapshotData()[metricKey];
  if (!data || !data.detail) return;
  const modal = document.getElementById('snapshotModal');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');
  if (!modal || !titleEl || !bodyEl) return;

  const d = data.detail;
  titleEl.textContent = d.title;
  let html = '';
  if (d.rows && d.rows.length) {
    html += '<table class="detail-table"><tbody>';
    d.rows.forEach(r => {
      html += `<tr><th>${r.label}</th><td>${r.value} <span class="trend">${r.trend}</span></td></tr>`;
    });
    html += '</tbody></table>';
  }
  if (d.bullets && d.bullets.length) {
    html += '<ul class="detail-list">';
    d.bullets.forEach(b => {
      html += `<li><span class="dot ${b.dot}"></span>${b.text}</li>`;
    });
    html += '</ul>';
  }
  bodyEl.innerHTML = html;
  modal.hidden = false;
  modal.removeAttribute('hidden');
}

function closeModal() {
  const modal = document.getElementById('snapshotModal');
  if (modal) {
    modal.hidden = true;
    modal.setAttribute('hidden', '');
  }
}

function setupHeaderFilters() {
  const teamSelect = document.getElementById('filterTeam');
  const subTeamSelect = document.getElementById('filterSubTeam');
  const weekSelect = document.getElementById('filterWeek');

  if (teamSelect) {
    teamSelect.addEventListener('change', () => {
      state.team = teamSelect.value;
      state.subTeam = (SUB_TEAMS[state.team] || [])[0] || state.subTeam;
      renderHeader();
      renderSnapshotCards();
    });
  }

  if (subTeamSelect) {
    subTeamSelect.addEventListener('change', () => {
      state.subTeam = subTeamSelect.value;
      renderHeader();
      renderSnapshotCards();
    });
  }

  if (weekSelect) {
    weekSelect.addEventListener('change', () => {
      state.week = Number(weekSelect.value);
      renderHeader();
      renderSnapshotCards();
    });
  }
}

function setupStatusBreakdown() {
  const btn = document.getElementById('btnOverallStatus');
  const panel = document.getElementById('statusBreakdown');
  const closeBtn = document.getElementById('closeStatusBreakdown');

  if (btn && panel) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.getAttribute('hidden') === null;
      if (isOpen) {
        panel.setAttribute('hidden', '');
        panel.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        panel.removeAttribute('hidden');
        panel.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  if (closeBtn && panel) {
    closeBtn.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      panel.classList.add('hidden');
      panel.hidden = true;
    });
  }

  document.addEventListener('click', (e) => {
    if (panel && !panel.hasAttribute('hidden') && !panel.contains(e.target) && e.target !== btn) {
      panel.setAttribute('hidden', '');
      panel.classList.add('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupSnapshotCards() {
  document.querySelectorAll('.snapshot-grid .metric-card[data-metric]').forEach(card => {
    card.addEventListener('click', () => openModal(card.getAttribute('data-metric')));
  });
}

function setupModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');
  const modal = document.getElementById('snapshotModal');

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// ========== Charts (unchanged logic, store instances) ==========
function initLatencyChart() {
  const ctx = document.getElementById('latencyChart');
  if (!ctx) return;
  chartInstances.latency = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        { label: '/api/feed (P95 ms)', data: [142, 148, 155, 166, 168, 162, 158], borderColor: chartColors.red, backgroundColor: 'rgba(239, 68, 68, 0.15)', fill: true, tension: 0.3 },
        { label: '/api/posts (P95 ms)', data: [88, 92, 90, 91, 89, 87, 90], borderColor: chartColors.green, backgroundColor: 'rgba(34, 197, 94, 0.1)', fill: true, tension: 0.3 },
      ],
    },
    options: { ...defaultOptions, plugins: { ...defaultOptions.plugins, legend: { position: 'bottom' } } },
  });
}

function initCostChart() {
  const ctx = document.getElementById('costChart');
  if (!ctx) return;
  chartInstances.cost = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Week 28', 'Week 29', 'Week 30', 'Week 31', 'Week 32'],
      datasets: [{ label: 'Weekly Cost ($)', data: [105000, 108200, 112400, 115100, 124300], backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(239, 68, 68, 0.7)'], borderColor: [chartColors.blue, chartColors.blue, chartColors.blue, chartColors.blue, chartColors.red], borderWidth: 1 }],
    },
    options: { ...defaultOptions, scales: { ...defaultOptions.scales, y: { ...defaultOptions.scales.y, beginAtZero: true } } },
  });
}

function initIncidentsChart() {
  const ctx = document.getElementById('incidentsChart');
  if (!ctx) return;
  chartInstances.incidents = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['P0', 'P1', 'P2'],
      datasets: [{ data: [0, 2, 4], backgroundColor: [chartColors.red, chartColors.yellow, chartColors.blue], borderColor: '#1e2a3a', borderWidth: 2 }],
    },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { color: chartColors.muted } } } },
  });
}

function initErrorsChart() {
  const ctx = document.getElementById('errorsChart');
  if (!ctx) return;
  chartInstances.errors = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ label: '5xx Error Rate (%)', data: [0.42, 0.38, 0.35, 0.31, 0.29, 0.28, 0.28], borderColor: chartColors.green, backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: true, tension: 0.3 }],
    },
    options: { ...defaultOptions, scales: { ...defaultOptions.scales, y: { ...defaultOptions.scales.y, min: 0, max: 0.5 } } },
  });
}

function initAlertsChart() {
  const ctx = document.getElementById('alertsChart');
  if (!ctx) return;
  chartInstances.alerts = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        { label: 'Total Alerts', data: [22, 28, 31, 29, 35, 21, 20], backgroundColor: 'rgba(234, 179, 8, 0.6)', borderColor: chartColors.yellow, borderWidth: 1 },
        { label: 'Auto-resolved', data: [8, 10, 12, 11, 14, 9, 10], backgroundColor: 'rgba(34, 197, 94, 0.5)', borderColor: chartColors.green, borderWidth: 1 },
      ],
    },
    options: { ...defaultOptions, scales: { ...defaultOptions.scales, y: { ...defaultOptions.scales.y, beginAtZero: true } } },
  });
}

function initTestsChart() {
  const ctx = document.getElementById('testsChart');
  if (!ctx) return;
  chartInstances.tests = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 28', 'Week 29', 'Week 30', 'Week 31', 'Week 32'],
      datasets: [{ label: 'Test Pass Rate (%)', data: [96.2, 96.8, 97.2, 97.2, 98.4], borderColor: chartColors.green, backgroundColor: 'rgba(34, 197, 94, 0.2)', fill: true, tension: 0.3 }],
    },
    options: { ...defaultOptions, scales: { ...defaultOptions.scales, y: { ...defaultOptions.scales.y, min: 94, max: 100 } } },
  });
}

// ========== Init ==========
function init() {
  renderHeader();
  renderSnapshotCards();
  setupHeaderFilters();
  setupStatusBreakdown();
  setupSnapshotCards();
  setupModal();
  initLatencyChart();
  initCostChart();
  initIncidentsChart();
  initErrorsChart();
  initAlertsChart();
  initTestsChart();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
