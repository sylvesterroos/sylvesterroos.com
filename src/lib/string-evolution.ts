// Shared implementation of the StringEvolution widget. Both the Astro
// component and the MDX editor mount this onto a root element, so the
// animation behaves identically in the post and in the editor.
//
// The root must contain the widget skeleton (see StringEvolution.astro):
// #evo-string, #evo-bar, #evo-slider, #evo-play, #evo-info, plus a
// data-url attribute pointing at the snapshots JSON.

type Snapshot = { string: string; fitness: number; generation: number };
type SnapshotsData = { snapshots: Snapshot[]; target: string; max_fitness: number };

const ICON_PLAY = "\u25b6";
const ICON_PAUSE = "\u23f8";
const ICON_REWIND = "\u21ba";

// Reproduce the fitness function from the post:
// character_score + 2 * bigram_score, where a bigram is an overlapping pair
// of adjacent characters that both match the target. Unprintable bytes are
// stored as "\u00b7" in the data, which never matches a target char, so
// computing on the JSON string yields the same scores as the original run.
function scoreSnapshot(s: string, t: string): { chars: number; bigrams: number } {
  let chars = 0;
  let bigrams = 0;
  const n = Math.min(s.length, t.length);
  for (let i = 0; i < n; i++) if (s[i] === t[i]) chars++;
  for (let i = 0; i + 1 < n; i++) if (s[i] === t[i] && s[i + 1] === t[i + 1]) bigrams++;
  return { chars, bigrams };
}

export function mountStringEvolution(root: HTMLElement): () => void {
  const dataUrl = root.dataset.url;
  const strEl = root.querySelector<HTMLElement>("#evo-string");
  const barEl = root.querySelector<HTMLElement>("#evo-bar");
  const slider = root.querySelector<HTMLInputElement>("#evo-slider");
  const playBtn = root.querySelector<HTMLButtonElement>("#evo-play");
  const infoEl = root.querySelector<HTMLElement>("#evo-info");
  const fitEl = root.querySelector<HTMLElement>("#evo-fitness");

  let snapshots: Snapshot[] = [];
  let target = "";
  let max = 0;
  let split = 0;
  let playing = false;
  let finished = false;
  let timer: ReturnType<typeof setInterval> | null = null;
  let disposed = false;

  function stopPlaying(icon: string) {
    playing = false;
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    if (playBtn) {
      playBtn.textContent = icon;
      playBtn.setAttribute("aria-label", icon === ICON_REWIND ? "Rewind" : "Play");
    }
  }

  function startPlaying() {
    playing = true;
    if (playBtn) {
      playBtn.textContent = ICON_PAUSE;
      playBtn.setAttribute("aria-label", "Pause");
    }
    timer = setInterval(() => {
      if (disposed) return;
      let next = parseInt(slider?.value ?? "0", 10) + 1;
      if (next >= snapshots.length) {
        next = snapshots.length - 1;
        finished = true;
        stopPlaying(ICON_REWIND);
      }
      render(next);
    }, 50);
  }

  function computeSplit() {
    if (!strEl || !target) return;
    const fs = getComputedStyle(strEl);
    const probe = document.createElement("canvas").getContext("2d");
    if (!probe) return;
    probe.font = fs.font;
    const charW = probe.measureText("M").width + parseFloat(fs.letterSpacing || "0");
    const perLine = Math.floor(strEl.clientWidth / charW);
    const sp = target.lastIndexOf(" ", perLine - 1);
    split = sp >= 0 ? sp + 1 : perLine;
  }

  function render(idx: number) {
    if (disposed || !snapshots.length || !strEl || !barEl || !slider || !infoEl) return;
    const snap = snapshots[idx];
    const s = snap.string;
    let html = "";
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      const tgt = i < target.length ? target[i] : "";
      let cls: string;
      if (c === "\u00b7") cls = "unprint";
      else if (c === tgt) cls = "correct";
      else cls = "wrong";
      const esc = c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;
      if (i === split) html += "<br>";
      html += `<span class="${cls}">${esc}</span>`;
    }
    strEl.innerHTML = html;

    const pct = (snap.fitness / max) * 100;
    barEl.style.width = pct + "%";

    slider.value = String(idx);
    infoEl.textContent = `gen ${snap.generation} \u00b7 fitness ${snap.fitness} / ${max}`;
    if (fitEl) {
      const { chars, bigrams } = scoreSnapshot(s, target);
      fitEl.textContent = `fitness = ${chars} chars + 2 \u00d7 ${bigrams} bigrams = ${snap.fitness}`;
    }
  }

  function onSliderInput() {
    if (disposed || !slider) return;
    const idx = parseInt(slider.value, 10);
    finished = idx >= snapshots.length - 1;
    stopPlaying(finished ? ICON_REWIND : ICON_PLAY);
    render(idx);
  }

  function onPlayClick() {
    if (disposed) return;
    if (playing) {
      stopPlaying(ICON_PLAY);
    } else if (finished) {
      finished = false;
      render(0);
      startPlaying();
    } else {
      startPlaying();
    }
  }

  function onResize() {
    if (disposed) return;
    computeSplit();
    render(parseInt(slider?.value ?? "0", 10));
  }

  slider?.addEventListener("input", onSliderInput);
  playBtn?.addEventListener("click", onPlayClick);

  if (dataUrl) {
    fetch(dataUrl)
      .then((r) => r.json())
      .then((data: SnapshotsData) => {
        if (disposed) return;
        snapshots = data.snapshots;
        target = data.target;
        max = data.max_fitness;
        if (slider) slider.max = String(snapshots.length - 1);
        computeSplit();
        window.addEventListener("resize", onResize);
        render(0);
      })
      .catch(() => {
        if (!disposed && strEl) strEl.textContent = "Failed to load evolution data.";
      });
  }

  return function cleanup() {
    disposed = true;
    stopPlaying(ICON_PLAY);
    slider?.removeEventListener("input", onSliderInput);
    playBtn?.removeEventListener("click", onPlayClick);
    window.removeEventListener("resize", onResize);
  };
}
