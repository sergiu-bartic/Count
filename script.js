const candidateData = [
  "AUR", "PSD + PNL + UDMR", "USR", "PNCR", "PUSL",
  "Independent", "PNR", "PLAN",
  "Independent", "Independent", "Independent"
];

const candidateDescriptions = [
  "George Simion", "Crin Antonescu", "Elena Lasconi", "Cristian Terches", "Lavinia Sandru",
  "Victor Ponta", "Sebastian Popescu", "Silviu Predoiu",
  "Ion Banu", "Daniel Funeriu", "Nicusor Dan"
];

const bodyContainer = document.getElementById("bodyContainer");
const selectSubmenu = document.getElementById("selectSubmenu");
const confirmationDialog = document.getElementById("confirmationDialog");

let sortMode = "position";
let candidates = [];

let pendingCandidate = null;
let pendingDelta = 0;

function createCandidate(index) {
  return {
    id: `candidate-${index}`,
    index,
    name: candidateData[index],
    description: candidateDescriptions[index],
    count: 0,
    active: true
  };
}

function renderCandidates() {
  bodyContainer.innerHTML = "";

  let displayList = candidates.filter(c => c.active);
  if (sortMode === "votes") {
    displayList.sort((a, b) => b.count - a.count);
  } else {
    displayList.sort((a, b) => a.index - b.index);
  }

  for (const c of displayList) {
    const el = document.createElement("div");
    el.className = "body-item";
    el.dataset.id = c.id;
    el.innerHTML = `
      <button class="vote-btn minus"><i class="fa-solid fa-minus"></i></button>
      <img src="assets/candidate${c.index + 1}.png" />
      <div class="body-text">
        <b>${c.name}</b>
        <p>${c.description}</p>
        <b class="count">${c.count}</b>
      </div>
      <button class="vote-btn plus"><i class="fa-solid fa-plus"></i></button>
    `;
    el.querySelector(".plus").addEventListener("click", () => showConfirmation(c, 1));
    el.querySelector(".minus").addEventListener("click", () => showConfirmation(c, -1));
    bodyContainer.appendChild(el);
  }
}

function renderSelectButtons() {
  selectSubmenu.innerHTML = "";
  candidates.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.className = `select-option active`;
    btn.dataset.index = i;
    btn.innerHTML = `<i class="fa-solid fa-circle-check icon"></i> ${c.name}`;
    btn.addEventListener("click", () => toggleCandidate(i, btn));
    selectSubmenu.appendChild(btn);
  });
}

function toggleCandidate(index, btn) {
  const candidate = candidates[index];
  candidate.active = !candidate.active;
  btn.classList.toggle("active", candidate.active);
  const icon = btn.querySelector(".icon");
  icon.className = candidate.active ? "fa-solid fa-circle-check icon" : "fa-regular fa-circle icon";
  renderCandidates();
}

function showConfirmation(candidate, delta) {
  pendingCandidate = candidate;
  pendingDelta = delta;

  // Remove any existing tints
  confirmationDialog.classList.remove("red-tint", "green-tint");

  // Determine button and dialog styles
  const yesBtnColor = delta > 0 ? "#4CAF50" : "#f44336";
  const tintClass = delta > 0 ? "green-tint" : "red-tint";

  confirmationDialog.classList.add(tintClass);
  confirmationDialog.classList.remove("hidden");
  confirmationDialog.style.display = "flex";

  confirmationDialog.innerHTML = `
    <img src="assets/candidate${candidate.index + 1}.png" />
    <div>
      <b>${candidate.name}</b>
      <p>${candidate.description}</p>
      <b>${candidate.count} <span style="font-size:1.2em;">${delta > 0 ? "+1" : "-1"}</span></b>
    </div>
    <div class="dialog-buttons">
      <button class="dialog-btn cancel-btn">Cancel</button>
      <button class="dialog-btn yes-btn" style="background-color: ${yesBtnColor}; color: white;">Yes</button>
    </div>
  `;

  confirmationDialog.querySelector(".cancel-btn").addEventListener("click", () => {
    confirmationDialog.classList.add("hidden");
    confirmationDialog.style.display = "none";
    pendingCandidate = null;
    pendingDelta = 0;
  });

  confirmationDialog.querySelector(".yes-btn").addEventListener("click", () => {
    if (pendingCandidate) {
      pendingCandidate.count += pendingDelta;
    }
    confirmationDialog.classList.add("hidden");
    confirmationDialog.style.display = "none";
    pendingCandidate = null;
    pendingDelta = 0;
    renderCandidates();
  });
}

document.querySelectorAll(".sort-option").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sort-option").forEach(b => {
      b.classList.remove("active");
      b.querySelector(".icon").className = "fa-regular fa-circle icon";
    });
    btn.classList.add("active");
    btn.querySelector(".icon").className = "fa-solid fa-circle-check icon";
    sortMode = btn.dataset.sort;
    renderCandidates();
  });
});

document.getElementById("restartBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to restart all counters?")) {
    candidates.forEach(c => c.count = 0);
    renderCandidates();
  }
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainMenu").classList.toggle("show");
});

function init() {
  candidates = candidateData.map((_, i) => createCandidate(i));
  renderSelectButtons();
  renderCandidates();
}

init();