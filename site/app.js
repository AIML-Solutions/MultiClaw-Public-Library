const state = {
  docs: [],
  filteredDocs: [],
  selectedDoc: null,
  tasks: [],
  taskState: {},
};

const els = {
  tabMdv: document.getElementById("tab-mdv"),
  tabTeb: document.getElementById("tab-teb"),
  panelMdv: document.getElementById("panel-mdv"),
  panelTeb: document.getElementById("panel-teb"),

  docSearch: document.getElementById("doc-search"),
  docRepoFilter: document.getElementById("doc-repo-filter"),
  docList: document.getElementById("doc-list"),
  docRender: document.getElementById("doc-render"),
  docStatus: document.getElementById("doc-status"),
  openGithub: document.getElementById("open-github"),
  openRaw: document.getElementById("open-raw"),
  copyDocLink: document.getElementById("copy-doc-link"),

  taskStatusFilter: document.getElementById("task-status-filter"),
  taskLaneFilter: document.getElementById("task-lane-filter"),
  resetBoard: document.getElementById("reset-board"),
  taskList: document.getElementById("task-list"),

  countTotal: document.getElementById("count-total"),
  countDone: document.getElementById("count-done"),
  countIp: document.getElementById("count-ip"),
  countBlocked: document.getElementById("count-blocked"),

  generateSummary: document.getElementById("generate-summary"),
  summaryOutput: document.getElementById("summary-output"),
  copySummary: document.getElementById("copy-summary"),
  copyStatus: document.getElementById("copy-status"),
};

const STORAGE_KEY = "multiclaw-teb-state-v1";

function loadTaskState() {
  try {
    state.taskState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    state.taskState = {};
  }
}

function saveTaskState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.taskState));
}

function setTab(tab) {
  const mdv = tab === "mdv";
  els.tabMdv.classList.toggle("active", mdv);
  els.tabTeb.classList.toggle("active", !mdv);
  els.panelMdv.classList.toggle("hidden", !mdv);
  els.panelTeb.classList.toggle("hidden", mdv);
}

function statusLabel(s) {
  return s === "in-progress" ? "In Progress" : s === "todo" ? "To Do" : s === "blocked" ? "Blocked" : "Done";
}

function getTaskRecord(task) {
  return state.taskState[task.id] || { status: task.status, checked: task.status === "done", note: "" };
}

function updateTaskRecord(taskId, patch) {
  const current = state.taskState[taskId] || {};
  state.taskState[taskId] = { ...current, ...patch };
  saveTaskState();
  renderTasks();
}

function fillRepoFilter() {
  const repos = [...new Set(state.docs.map((d) => d.repo))].sort();
  repos.forEach((repo) => {
    const opt = document.createElement("option");
    opt.value = repo;
    opt.textContent = repo;
    els.docRepoFilter.appendChild(opt);
  });
}

function filterDocs() {
  const q = els.docSearch.value.trim().toLowerCase();
  const repo = els.docRepoFilter.value;

  state.filteredDocs = state.docs.filter((d) => {
    const inRepo = repo === "all" || d.repo === repo;
    const hay = [d.title, d.repo, d.lane, ...(d.tags || [])].join(" ").toLowerCase();
    const inSearch = !q || hay.includes(q);
    return inRepo && inSearch;
  });

  renderDocList();
}

function renderDocList() {
  els.docList.innerHTML = "";
  if (!state.filteredDocs.length) {
    const div = document.createElement("div");
    div.className = "doc-item";
    div.textContent = "No docs match current filters.";
    els.docList.appendChild(div);
    return;
  }

  state.filteredDocs.forEach((doc) => {
    const item = document.createElement("div");
    item.className = `doc-item ${state.selectedDoc?.id === doc.id ? "active" : ""}`;
    item.innerHTML = `<div class="title">${doc.title}</div><div class="meta">${doc.repo} · ${doc.lane}</div>`;
    item.onclick = () => selectDoc(doc);
    els.docList.appendChild(item);
  });
}

async function selectDoc(doc) {
  state.selectedDoc = doc;
  renderDocList();
  els.openGithub.disabled = false;
  els.openRaw.disabled = false;
  els.copyDocLink.disabled = false;

  els.docStatus.textContent = `Loading ${doc.title}...`;
  els.docRender.textContent = "Loading...";

  try {
    const res = await fetch(doc.rawUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();
    const html = marked.parse(md);
    els.docRender.innerHTML = DOMPurify.sanitize(html);
    els.docStatus.textContent = `Loaded ${doc.title}`;
  } catch (err) {
    els.docRender.textContent = `Failed to load markdown: ${err.message}`;
    els.docStatus.textContent = `Load failed for ${doc.title}`;
  }
}

function renderTasks() {
  const statusFilter = els.taskStatusFilter.value;
  const laneFilter = els.taskLaneFilter.value;

  els.taskList.innerHTML = "";

  const tasks = state.tasks.filter((t) => {
    const rec = getTaskRecord(t);
    const status = rec.status || t.status;
    const statusOk = statusFilter === "all" || status === statusFilter;
    const laneOk = laneFilter === "all" || t.lane === laneFilter;
    return statusOk && laneOk;
  });

  const all = state.tasks.map((t) => ({ ...t, _s: getTaskRecord(t).status || t.status }));
  els.countTotal.textContent = String(all.length);
  els.countDone.textContent = String(all.filter((t) => t._s === "done").length);
  els.countIp.textContent = String(all.filter((t) => t._s === "in-progress").length);
  els.countBlocked.textContent = String(all.filter((t) => t._s === "blocked").length);

  tasks.forEach((task) => {
    const rec = getTaskRecord(task);
    const status = rec.status || task.status;

    const card = document.createElement("article");
    card.className = "task";
    card.innerHTML = `
      <div class="task-top">
        <label><input type="checkbox" ${rec.checked ? "checked" : ""}/> Mark done</label>
        <span class="pill ${status}">${statusLabel(status)}</span>
      </div>
      <h4>${task.title}</h4>
      <p>${task.description}</p>
      <div class="meta"><b>${task.lane}</b> · ${task.priority} · owner: ${task.owner}</div>
      <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
        <select class="status-select">
          ${["todo", "in-progress", "blocked", "done"]
            .map((s) => `<option value="${s}" ${s === status ? "selected" : ""}>${statusLabel(s)}</option>`)
            .join("")}
        </select>
        <input class="note" type="text" placeholder="Note" value="${(rec.note || "").replace(/"/g, "&quot;")}" />
      </div>
      <div class="links"></div>
    `;

    const checkbox = card.querySelector("input[type='checkbox']");
    const statusSelect = card.querySelector(".status-select");
    const noteInput = card.querySelector(".note");
    const linksDiv = card.querySelector(".links");

    checkbox.addEventListener("change", () => {
      const checked = checkbox.checked;
      updateTaskRecord(task.id, { checked, status: checked ? "done" : statusSelect.value });
    });

    statusSelect.addEventListener("change", () => {
      updateTaskRecord(task.id, { status: statusSelect.value, checked: statusSelect.value === "done" });
    });

    noteInput.addEventListener("change", () => {
      updateTaskRecord(task.id, { note: noteInput.value.trim() });
    });

    (task.links || []).forEach((l) => {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = l.label;
      linksDiv.appendChild(a);
    });

    els.taskList.appendChild(card);
  });
}

function fillLaneFilter() {
  const lanes = [...new Set(state.tasks.map((t) => t.lane))].sort();
  lanes.forEach((lane) => {
    const opt = document.createElement("option");
    opt.value = lane;
    opt.textContent = lane;
    els.taskLaneFilter.appendChild(opt);
  });
}

function generateSummaryText() {
  const all = state.tasks.map((t) => ({ ...t, _s: getTaskRecord(t).status || t.status, _note: getTaskRecord(t).note || "" }));
  const done = all.filter((t) => t._s === "done");
  const ip = all.filter((t) => t._s === "in-progress");
  const blocked = all.filter((t) => t._s === "blocked");
  const todo = all.filter((t) => t._s === "todo");

  const lines = [];
  lines.push(`# MultiClaw TEB Summary (${new Date().toISOString()})`);
  lines.push("");
  lines.push(`- Total tasks: ${all.length}`);
  lines.push(`- Done: ${done.length}`);
  lines.push(`- In Progress: ${ip.length}`);
  lines.push(`- Blocked: ${blocked.length}`);
  lines.push(`- To Do: ${todo.length}`);
  lines.push("");

  const printGroup = (title, arr) => {
    lines.push(`## ${title}`);
    if (!arr.length) {
      lines.push(`- (none)`);
    } else {
      arr.forEach((t) => {
        const note = t._note ? ` — note: ${t._note}` : "";
        lines.push(`- [${t.lane}] ${t.title}${note}`);
      });
    }
    lines.push("");
  };

  printGroup("In Progress", ip);
  printGroup("Blocked", blocked);
  printGroup("Next Up", todo);

  els.summaryOutput.value = lines.join("\n");
}

async function init() {
  try {
    const [docsRes, tasksRes] = await Promise.all([
      fetch("./data/docs-catalog.json"),
      fetch("./data/teb-tasks.json"),
    ]);

    state.docs = await docsRes.json();
    state.tasks = await tasksRes.json();

    loadTaskState();
    fillRepoFilter();
    fillLaneFilter();

    filterDocs();
    renderTasks();

    if (state.filteredDocs[0]) selectDoc(state.filteredDocs[0]);
  } catch (err) {
    els.docStatus.textContent = `Initialization failed: ${err.message}`;
  }
}

els.tabMdv.addEventListener("click", () => setTab("mdv"));
els.tabTeb.addEventListener("click", () => setTab("teb"));

els.docSearch.addEventListener("input", filterDocs);
els.docRepoFilter.addEventListener("change", filterDocs);

els.openGithub.addEventListener("click", () => state.selectedDoc && window.open(state.selectedDoc.githubUrl, "_blank"));
els.openRaw.addEventListener("click", () => state.selectedDoc && window.open(state.selectedDoc.rawUrl, "_blank"));
els.copyDocLink.addEventListener("click", async () => {
  if (!state.selectedDoc) return;
  await navigator.clipboard.writeText(state.selectedDoc.githubUrl);
  els.docStatus.textContent = `Copied link for ${state.selectedDoc.title}`;
});

els.taskStatusFilter.addEventListener("change", renderTasks);
els.taskLaneFilter.addEventListener("change", renderTasks);
els.resetBoard.addEventListener("click", () => {
  if (!confirm("Reset all local task states and notes?")) return;
  state.taskState = {};
  saveTaskState();
  renderTasks();
});

els.generateSummary.addEventListener("click", generateSummaryText);
els.copySummary.addEventListener("click", async () => {
  if (!els.summaryOutput.value.trim()) {
    els.copyStatus.textContent = "Nothing to copy yet.";
    return;
  }
  await navigator.clipboard.writeText(els.summaryOutput.value);
  els.copyStatus.textContent = "Copied summary.";
  setTimeout(() => (els.copyStatus.textContent = ""), 1400);
});

init();
