// Two-point crossover widget. Shows two parents cut at two shared positions
// with the middle segment swapped, so the reader sees where each child's
// characters came from. Cut positions are sliders; "new parents" re-rolls
// the parents from the target fragment.

const TARGET = "One Ring to rule them all, One Ring to find them";
const PRINTABLE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,'!?-_";

function esc(c: string): string {
  return c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;
}

function randomChar(): string {
  return PRINTABLE[Math.floor(Math.random() * PRINTABLE.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// A parent is the target with a light sprinkling of noise, so it reads as a
// nearly-perfect string. The reader can focus on where the swapped fragment
// lands instead of decoding gibberish.
function makeParent(): string[] {
  return TARGET.split("").map((c) => (Math.random() < 0.9 ? c : randomChar()));
}

function genesHtml(segments: { chars: string[]; tint: "p1" | "p2" }[]): string {
  return segments
    .map((seg) =>
      seg.chars.map((c) => `<span class="co-char-${seg.tint}">${esc(c)}</span>`).join(""),
    )
    .join('<span class="co-cut"></span>');
}

export function mountTwoPointCrossover(root: HTMLElement): () => void {
  const rowP1 = root.querySelector<HTMLElement>('[data-row="p1"]');
  const rowP2 = root.querySelector<HTMLElement>('[data-row="p2"]');
  const rowC1 = root.querySelector<HTMLElement>('[data-row="c1"]');
  const rowC2 = root.querySelector<HTMLElement>('[data-row="c2"]');
  const cut1El = root.querySelector<HTMLInputElement>('[data-cut="1"]');
  const cut2El = root.querySelector<HTMLInputElement>('[data-cut="2"]');
  const shuffleBtn = root.querySelector<HTMLButtonElement>("[data-shuffle]");

  const len = TARGET.length;
  let p1 = makeParent();
  let p2 = makeParent();
  let c1 = randomInt(Math.floor(len * 0.25), Math.floor(len * 0.45));
  let c2 = randomInt(Math.floor(len * 0.6), Math.floor(len * 0.75));

  // Cut boundaries mirror Petri's two_point: it picks two distinct indices
  // a < b in 0..(n-1) with the middle inclusive (a..b). As boundaries, cut 1
  // sits at a in [0, n-2] (before the first char when 0) and cut 2 at b+1 in
  // [2, n] (after the last char when n); the middle is always >= 2 genes.
  if (cut1El) {
    cut1El.min = "0";
    cut1El.max = String(len - 2);
  }
  if (cut2El) {
    cut2El.min = "2";
    cut2El.max = String(len);
  }

  function render() {
    if (!rowP1 || !rowP2 || !rowC1 || !rowC2) return;
    rowP1.innerHTML = genesHtml([
      { chars: p1.slice(0, c1), tint: "p1" },
      { chars: p1.slice(c1, c2), tint: "p1" },
      { chars: p1.slice(c2), tint: "p1" },
    ]);
    rowP2.innerHTML = genesHtml([
      { chars: p2.slice(0, c1), tint: "p2" },
      { chars: p2.slice(c1, c2), tint: "p2" },
      { chars: p2.slice(c2), tint: "p2" },
    ]);
    rowC1.innerHTML = genesHtml([
      { chars: p1.slice(0, c1), tint: "p1" },
      { chars: p2.slice(c1, c2), tint: "p2" },
      { chars: p1.slice(c2), tint: "p1" },
    ]);
    rowC2.innerHTML = genesHtml([
      { chars: p2.slice(0, c1), tint: "p2" },
      { chars: p1.slice(c1, c2), tint: "p1" },
      { chars: p2.slice(c2), tint: "p2" },
    ]);
    if (cut1El) cut1El.value = String(c1);
    if (cut2El) cut2El.value = String(c2);
  }

  function onCut1() {
    if (!cut1El || !cut2El) return;
    c1 = parseInt(cut1El.value, 10);
    if (c2 < c1 + 2) {
      c2 = c1 + 2;
      cut2El.value = String(c2);
    }
    render();
  }

  function onCut2() {
    if (!cut1El || !cut2El) return;
    c2 = parseInt(cut2El.value, 10);
    if (c1 > c2 - 2) {
      c1 = c2 - 2;
      cut1El.value = String(c1);
    }
    render();
  }

  function onShuffle() {
    p1 = makeParent();
    p2 = makeParent();
    render();
  }

  cut1El?.addEventListener("input", onCut1);
  cut2El?.addEventListener("input", onCut2);
  shuffleBtn?.addEventListener("click", onShuffle);
  render();

  return function cleanup() {
    cut1El?.removeEventListener("input", onCut1);
    cut2El?.removeEventListener("input", onCut2);
    shuffleBtn?.removeEventListener("click", onShuffle);
  };
}
