// Uniform mutation widget. A nearly-perfect chromosome is mutated by two
// independent causes, each with its own knob:
//   - mutation rate  → guarantees at least one gene mutates (pick one)
//   - per-gene rate  → additionally, every gene rolls its own die
// Mutated genes are colored by cause so the two knobs stay distinguishable.

const TARGET = "One Ring to rule them all, One Ring to find them";
const PRINTABLE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,'!?-_";

function esc(c: string): string {
  return c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;
}

function randomChar(): string {
  return PRINTABLE[Math.floor(Math.random() * PRINTABLE.length)];
}

function makeBase(): string[] {
  return TARGET.split("").map((c) => (Math.random() < 0.9 ? c : randomChar()));
}

export function mountMutation(root: HTMLElement): () => void {
  const stringEl = root.querySelector<HTMLElement>("[data-string]");
  const rateEl = root.querySelector<HTMLInputElement>("[data-rate]");
  const perGeneEl = root.querySelector<HTMLInputElement>("[data-per-gene]");
  const rateValueEl = root.querySelector<HTMLElement>("[data-rate-value]");
  const perGeneValueEl = root.querySelector<HTMLElement>("[data-per-gene-value]");
  const mutateBtn = root.querySelector<HTMLButtonElement>("[data-mutate]");
  const resetBtn = root.querySelector<HTMLButtonElement>("[data-reset]");
  const infoEl = root.querySelector<HTMLElement>("[data-info]");

  const base = makeBase();
  let current = base.slice();
  let causes = new Map<number, "rate" | "gene">();

  function render() {
    if (!stringEl) return;
    stringEl.innerHTML = current
      .map((c, i) => {
        const cause = causes.get(i);
        return cause === "rate"
          ? `<span class="mu-guaranteed">${esc(c)}</span>`
          : cause === "gene"
            ? `<span class="mu-per-gene">${esc(c)}</span>`
            : esc(c);
      })
      .join("");
  }

  function onRate() {
    if (rateValueEl && rateEl) rateValueEl.textContent = Number(rateEl.value).toFixed(2);
  }

  function onPerGene() {
    if (perGeneValueEl && perGeneEl) {
      perGeneValueEl.textContent = `${Math.round(Number(perGeneEl.value) * 100)}%`;
    }
  }

  function onMutate() {
    const rate = rateEl ? parseFloat(rateEl.value) : 1;
    const perGene = perGeneEl ? parseFloat(perGeneEl.value) : 0.02;

    const next = new Map<number, "rate" | "gene">();
    let guaranteed = 0;

    // mutation rate: guarantee at least one gene mutates.
    if (Math.random() <= rate) {
      next.set(Math.floor(Math.random() * current.length), "rate");
      guaranteed = 1;
    }

    // per-gene rate: additionally roll a die for every gene.
    let rolled = 0;
    current.forEach((_, i) => {
      if (!next.has(i) && Math.random() <= perGene) {
        next.set(i, "gene");
        rolled += 1;
      }
    });

    next.forEach((_, i) => {
      current[i] = randomChar();
    });

    causes = next;
    render();

    if (infoEl) {
      const pct = Math.round(perGene * 100);
      const genes = `${rolled} ${rolled === 1 ? "gene" : "genes"}`;
      infoEl.textContent = guaranteed
        ? `mutation rate ${rate.toFixed(2)} → 1 guaranteed gene · per-gene rate ${pct}% → ${genes}`
        : `mutation rate ${rate.toFixed(2)} → no guaranteed gene · per-gene rate ${pct}% → ${genes}`;
    }
  }

  function onReset() {
    current = base.slice();
    causes = new Map();
    render();
    if (infoEl) infoEl.textContent = "";
  }

  if (rateEl) {
    rateEl.min = "0";
    rateEl.max = "1";
    rateEl.step = "0.05";
    rateEl.value = "1";
  }
  if (perGeneEl) {
    perGeneEl.min = "0";
    perGeneEl.max = "1";
    perGeneEl.step = "0.01";
    perGeneEl.value = "0.02";
  }

  render();
  if (rateValueEl) rateValueEl.textContent = "1.00";
  if (perGeneValueEl) perGeneValueEl.textContent = "2%";

  rateEl?.addEventListener("input", onRate);
  perGeneEl?.addEventListener("input", onPerGene);
  mutateBtn?.addEventListener("click", onMutate);
  resetBtn?.addEventListener("click", onReset);

  return function cleanup() {
    rateEl?.removeEventListener("input", onRate);
    perGeneEl?.removeEventListener("input", onPerGene);
    mutateBtn?.removeEventListener("click", onMutate);
    resetBtn?.removeEventListener("click", onReset);
  };
}
