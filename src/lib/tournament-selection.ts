// Tournament selection widget. A population ranked by fitness is shown as a
// bar chart; the reader picks the tournament size and runs tournaments to see
// wins concentrate on the fittest individuals as the size grows.

const FITNESS = [1, 2, 3, 5, 7, 9, 12, 16, 21, 27, 35, 45, 58, 75, 95];
const N = FITNESS.length;
const MAX = FITNESS[N - 1];
const BAR_PX = 120;

function pickContestants(k: number): number[] {
  const idx = Array.from({ length: N }, (_, i) => i);
  for (let i = 0; i < k; i++) {
    const j = i + Math.floor(Math.random() * (N - i));
    const tmp = idx[i];
    idx[i] = idx[j];
    idx[j] = tmp;
  }
  return idx.slice(0, k);
}

function winnerOf(contestants: number[]): number {
  return contestants.reduce((best, i) => (FITNESS[i] > FITNESS[best] ? i : best), contestants[0]);
}

export function mountTournamentSelection(root: HTMLElement): () => void {
  const barsEl = root.querySelector<HTMLElement>("[data-bars]");
  const sizeEl = root.querySelector<HTMLInputElement>("[data-size]");
  const sizeValueEl = root.querySelector<HTMLElement>("[data-size-value]");
  const runBtn = root.querySelector<HTMLButtonElement>("[data-run]");
  const runManyBtn = root.querySelector<HTMLButtonElement>("[data-run-many]");
  const resetBtn = root.querySelector<HTMLButtonElement>("[data-reset]");
  const statusEl = root.querySelector<HTMLElement>("[data-status]");

  const wins = Array<number>(N).fill(0);
  const indEls: HTMLElement[] = [];
  const winsEls: HTMLElement[] = [];

  function size(): number {
    return sizeEl ? parseInt(sizeEl.value, 10) : 5;
  }

  function renderBars() {
    if (!barsEl) return;
    barsEl.innerHTML = "";
    indEls.length = 0;
    winsEls.length = 0;

    FITNESS.forEach((f, i) => {
      const ind = document.createElement("div");
      ind.className = "ts-individual";

      const fitness = document.createElement("span");
      fitness.className = "ts-fitness";
      fitness.textContent = String(f);

      const bar = document.createElement("div");
      bar.className = "ts-bar";
      bar.style.height = `${Math.round((f / MAX) * BAR_PX)}px`;

      const meta = document.createElement("span");
      meta.className = "ts-meta";
      const index = document.createElement("span");
      index.className = "ts-meta-index";
      index.textContent = `#${i + 1}`;
      const winCount = document.createElement("span");
      winCount.className = "ts-meta-wins";
      winCount.textContent = "0";
      meta.append(index, winCount);

      ind.append(fitness, bar, meta);
      barsEl.appendChild(ind);
      indEls.push(ind);
      winsEls.push(winCount);
    });
  }

  function clearHighlights() {
    indEls.forEach((el) => el.classList.remove("ts-contestant", "ts-winner"));
  }

  function renderTally() {
    winsEls.forEach((el, i) => {
      el.textContent = String(wins[i]);
    });
  }

  function setStatus(text: string) {
    if (statusEl) statusEl.textContent = text;
  }

  function runOnce(animate: boolean) {
    const k = size();
    const contestants = pickContestants(k);
    const winner = winnerOf(contestants);
    wins[winner] += 1;

    if (animate) {
      clearHighlights();
      contestants.forEach((i) => indEls[i].classList.add("ts-contestant"));
      indEls[winner].classList.add("ts-winner");
      setStatus(`tournament of ${k}: fitness ${FITNESS[winner]} won`);
    }
  }

  function onRun() {
    runOnce(true);
    renderTally();
  }

  function onRunMany() {
    clearHighlights();
    const k = size();
    const before = wins.slice();
    for (let n = 0; n < 100; n++) runOnce(false);
    renderTally();

    let topIdx = 0;
    for (let i = 1; i < N; i++) if (wins[i] > wins[topIdx]) topIdx = i;

    setStatus(
      `100 tournaments of ${k}: #${topIdx + 1} (fitness ${FITNESS[topIdx]}) won ${wins[topIdx] - before[topIdx]}`,
    );
  }

  function onReset() {
    wins.fill(0);
    clearHighlights();
    renderTally();
    setStatus("");
  }

  function onSize() {
    if (sizeValueEl) sizeValueEl.textContent = String(size());
  }

  if (sizeEl) {
    sizeEl.min = "1";
    sizeEl.max = String(N);
    sizeEl.value = "5";
  }

  renderBars();
  if (sizeValueEl) sizeValueEl.textContent = "5";

  sizeEl?.addEventListener("input", onSize);
  runBtn?.addEventListener("click", onRun);
  runManyBtn?.addEventListener("click", onRunMany);
  resetBtn?.addEventListener("click", onReset);

  return function cleanup() {
    sizeEl?.removeEventListener("input", onSize);
    runBtn?.removeEventListener("click", onRun);
    runManyBtn?.removeEventListener("click", onRunMany);
    resetBtn?.removeEventListener("click", onReset);
  };
}
