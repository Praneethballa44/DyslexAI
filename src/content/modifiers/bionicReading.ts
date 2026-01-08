
import { BionicReadingSettings } from '@/types';

const PROCESSED_CLASS = 'lexilens-bionic-processed';
const STYLE_ID = 'lexilens-bionic-styles';

let isEnabled = false;
let lastPercentage = 50;
let observer: MutationObserver | null = null;
let processingJob: number | null = null;

function injectStyles() {
  // Ensure styles are always present when enabled
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `
    .${PROCESSED_CLASS} {
        position: relative; /* Maintain layout */
    }
    .${PROCESSED_CLASS} b {
        font-weight: 800 !important;
        color: inherit !important;
        background: transparent !important;
    }
    `;
}

function removeStyles() {
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
}

function getBionicWord(word: string, boldPercentage: number): string {
  const len = word.length;
  if (len < 1) return word;

  // Calculate split
  let splitPoint = Math.ceil(len * (boldPercentage / 100));
  if (splitPoint < 1) splitPoint = 1;
  if (len > 15) splitPoint = Math.min(splitPoint, Math.ceil(len * 0.4));

  const boldPart = word.slice(0, splitPoint);
  const restPart = word.slice(splitPoint);

  return `<b>${boldPart}</b>${restPart}`;
}

function processNode(textNode: Text, boldPercentage: number) {
  if (!textNode.isConnected) return;
  const val = textNode.nodeValue;
  if (!val || !val.trim()) return;

  const parent = textNode.parentElement;
  if (!parent) return;

  // Filter restricted tags
  const tag = parent.tagName;
  if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'SVG', 'IMG', 'CANVAS', 'VIDEO', 'AUDIO', 'IFRAME'].includes(tag)) return;
  if (parent.isContentEditable) return;
  // Skip if already processed or inside our UI
  if (parent.classList.contains(PROCESSED_CLASS)) return;
  if (parent.closest('[data-lexilens]') || parent.closest('.lexilens-widget')) return;

  // Filter non-word content
  if (!/[a-zA-Z\u00C0-\u00FF]/.test(val)) return;

  const parts = val.split(/(\s+)/);
  const fragment = document.createDocumentFragment();
  let hasWork = false;

  for (const part of parts) {
    if (!part.trim() || !/[a-zA-Z\u00C0-\u00FF]/.test(part)) {
      fragment.appendChild(document.createTextNode(part));
      continue;
    }

    hasWork = true;
    const span = document.createElement('span');
    span.className = PROCESSED_CLASS;
    span.innerHTML = getBionicWord(part, boldPercentage);
    fragment.appendChild(span);
  }

  if (hasWork) {
    textNode.replaceWith(fragment);
  }
}

// Global function to start observing AFTER initial batch
function enableObserver(boldPercentage: number) {
  if (observer) observer.disconnect();

  observer = new MutationObserver((mutations) => {
    // Stop observing briefly to prevent loop
    observer?.disconnect();

    const nodes: Text[] = [];
    mutations.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.nodeType === Node.TEXT_NODE) nodes.push(n as Text);
        else if (n.nodeType === Node.ELEMENT_NODE) {
          const el = n as HTMLElement;
          if (el.classList.contains(PROCESSED_CLASS)) return; // Ignore our own nodes

          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) nodes.push(walker.currentNode as Text);
        }
      });
    });

    // Fast process
    nodes.forEach(n => processNode(n, boldPercentage));

    // Resume
    if (isEnabled) {
      observer?.observe(document.body, { childList: true, subtree: true });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function processPage(boldPercentage: number) {
  // 1. Collect all valid text nodes
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
      if (p.closest && (p.closest('[data-lexilens]') || p.closest('.lexilens-widget'))) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  console.log(`[LexiLens] Processing ${nodes.length} text nodes...`);

  // 2. Process in chunks without observer interference
  let index = 0;
  const processChunk = () => {
    if (!isEnabled) return; // Cancel if disabled during processing

    const start = performance.now();
    // Budget 12ms
    while (index < nodes.length && performance.now() - start < 12) {
      processNode(nodes[index++], boldPercentage);
    }

    if (index < nodes.length) {
      processingJob = requestAnimationFrame(processChunk);
    } else {
      console.log('[LexiLens] Initial processing complete. Enabling observer.');
      processingJob = null;
      enableObserver(boldPercentage);
    }
  };

  processingJob = requestAnimationFrame(processChunk);
}

function revertChanges() {
  if (observer) observer.disconnect();
  if (processingJob) {
    cancelAnimationFrame(processingJob);
    processingJob = null;
  }

  const processed = document.querySelectorAll(`.${PROCESSED_CLASS}`);
  processed.forEach(span => {
    // Fast unwrap
    const parent = span.parentNode;
    if (parent) {
      const txt = document.createTextNode(span.textContent || '');
      parent.replaceChild(txt, span);
      parent.normalize();
    }
  });
}

export function enableBionicReading(settings: BionicReadingSettings): void {
  const percentage = settings.boldPercentage;
  injectStyles();

  if (isEnabled) {
    if (percentage !== lastPercentage) {
      updateBionicReading(settings);
    }
    return;
  }

  isEnabled = true;
  lastPercentage = percentage;

  // Important: Revert first to ensure clean slab if we had partial state
  // revertChanges(); // Actually no, that might flash. Just process.

  processPage(percentage);
}

export function disableBionicReading(): void {
  if (!isEnabled) return;
  isEnabled = false;
  revertChanges();
  removeStyles();
}

export function updateBionicReading(settings: BionicReadingSettings): void {
  if (!isEnabled) return;

  // For slider updates, we MUST revert old bolding first to apply new percentage
  revertChanges();
  lastPercentage = settings.boldPercentage;
  injectStyles(); // Ensure style exists

  // Wait for next frame to avoid jank
  requestAnimationFrame(() => {
    if (isEnabled) {
      processPage(settings.boldPercentage);
    }
  });
}

export function isBionicReadingActive(): boolean {
  return isEnabled;
}
