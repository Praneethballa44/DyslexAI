
const STYLE_ID = 'lexilens-reading-focus-styles';
const CONTAINER_ID = 'lexilens-reading-focus-container';
const MAGNIFIER_ID = 'lexilens-reading-focus-magnifier';

let isEnabled = false;
let anchorRange: Range | null = null;
let activeRange: Range | null = null;
let updateTimer: number | null = null;

// Track the current highlight rect to smooth transitions
let currentRect = { top: 0, left: 0, width: 0, height: 0, set: false };

function createOverlay() {
    if (document.getElementById(CONTAINER_ID)) return;

    const container = document.createElement('div');
    container.id = CONTAINER_ID;

    // Create 4 standard divs to frame the 'hole'
    // using backdrop-filter: blur()
    const directions = ['top', 'bottom', 'left', 'right'];
    directions.forEach(dir => {
        const el = document.createElement('div');
        el.className = `lexilens-focus-blur-panel panel-${dir}`;
        container.appendChild(el);
    });

    // Create Magnifier Overlay within the container
    const magnifier = document.createElement('div');
    magnifier.id = MAGNIFIER_ID;
    container.appendChild(magnifier);

    document.body.appendChild(container);

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
    #${CONTAINER_ID} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none; /* Let clicks pass through */
      z-index: 2147483630; /* Below click magnifier */
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    #${CONTAINER_ID}.active {
      opacity: 1;
    }

    .lexilens-focus-blur-panel {
      position: absolute;
      background: rgba(255, 255, 255, 0.1); 
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      transition: all 0.15s cubic-bezier(0.2, 0, 0.2, 1);
    }
    
    /* Debug colors if needed, otherwise transparent/dimmed */
    .lexilens-focus-blur-panel {
      background: rgba(0, 0, 0, 0.2); 
    }
    
    #${MAGNIFIER_ID} {
      position: absolute;
      background: white; /* Clean background for readability */
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      transform-origin: center center;
      transform: scale(1.05); /* Slight pop effect */
      padding: 4px 8px;
      pointer-events: none;
      /* Inherit font styles dynamically via JS */
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border: 1px solid rgba(0,0,0,0.1);
      transition: all 0.1s linear; 
      color: black;
    }
    
    /* Ensure content inside magnifier wraps correctly if needed, or matches */
    #${MAGNIFIER_ID} * {
        background: transparent !important; /* Strip backgrounds of cloned elements */
    }
  `;
    document.head.appendChild(style);
}

function updateHole(targetRect: DOMRect) {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    const panels = {
        top: container.querySelector('.panel-top') as HTMLElement,
        bottom: container.querySelector('.panel-bottom') as HTMLElement,
        left: container.querySelector('.panel-left') as HTMLElement,
        right: container.querySelector('.panel-right') as HTMLElement,
    };

    if (!panels.top) return;

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    // Apply "Pop" effect and padding
    // Scale 1.1x roughly, or just add padding
    const paddingX = 8;
    const paddingY = 6;

    // We want the hole to be targetRect expanded
    let top = targetRect.top - paddingY;
    let bottom = targetRect.bottom + paddingY;
    let left = targetRect.left - paddingX;
    let right = targetRect.right + paddingX;

    // Clamping
    if (top < 0) top = 0;
    if (left < 0) left = 0;
    if (bottom > winH) bottom = winH;
    if (right > winW) right = winW;

    // Calculate panel dimensions
    panels.top.style.top = '0px';
    panels.top.style.left = '0px';
    panels.top.style.width = '100%';
    panels.top.style.height = `${top}px`;

    panels.bottom.style.top = `${bottom}px`;
    panels.bottom.style.left = '0px';
    panels.bottom.style.width = '100%';
    panels.bottom.style.height = `${Math.max(0, winH - bottom)}px`;

    panels.left.style.top = `${top}px`;
    panels.left.style.left = '0px';
    panels.left.style.width = `${left}px`;
    panels.left.style.height = `${bottom - top}px`;

    panels.right.style.top = `${top}px`;
    panels.right.style.left = `${right}px`;
    panels.right.style.width = `${Math.max(0, winW - right)}px`;
    panels.right.style.height = `${bottom - top}px`;

    // --- Update Magnifier ---
    const magnifier = document.getElementById(MAGNIFIER_ID);
    if (magnifier && activeRange) {
        magnifier.style.top = `${top}px`;
        magnifier.style.left = `${left}px`;
        magnifier.style.width = `${right - left}px`;
        magnifier.style.height = `${bottom - top}px`;

        // Update Content: check if content changed string-wise to avoid re-cloning if unnecessary
        // Actually re-cloning every frame is expensive? 
        // User scans words, so content updates often.
        // But animation frames are 60fps.
        const text = activeRange.toString();
        if (magnifier.dataset.lastText !== text) {
            magnifier.innerHTML = '';
            // We can use textContent for simplicity, or cloneContents for HTML support.
            // cloneContents is better for bold/italic.
            // BUT cloneContents fragments don't have styles computed.
            magnifier.textContent = text;
            magnifier.dataset.lastText = text;

            // Copy fundamental font styles from source
            const sourceNode = activeRange.startContainer.parentElement;
            if (sourceNode) {
                const comp = window.getComputedStyle(sourceNode);
                magnifier.style.fontFamily = comp.fontFamily;
                magnifier.style.fontSize = comp.fontSize; // Might need scaling further? 
                magnifier.style.fontWeight = comp.fontWeight;
                magnifier.style.lineHeight = comp.lineHeight;
                magnifier.style.letterSpacing = comp.letterSpacing;
                // If page is dark mode, text might be white. 
                // Our magnifier bg is white. So force text black?
                // Or detect. Let's simplify: Force black text on white bg for contrast/dyslexia.
                magnifier.style.color = '#000000';
            }
        }
    }

    if (!container.classList.contains('active')) {
        container.classList.add('active');
    }
}

function getWordRangeAtPoint(x: number, y: number): Range | null {
    if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(x, y);
        if (!range || !range.startContainer) return null;
        if (range.startContainer.nodeType !== Node.TEXT_NODE) return null;

        const node = range.startContainer;
        const offset = range.startOffset;
        const text = node.textContent || '';

        // Find word boundaries
        let start = offset;
        while (start > 0 && /\w/.test(text[start - 1])) {
            start--;
        }
        let end = offset;
        while (end < text.length && /\w/.test(text[end])) {
            end++;
        }

        if (start === end) return null; // No word hit

        const wordRange = document.createRange();
        wordRange.setStart(node, start);
        wordRange.setEnd(node, end);
        return wordRange;
    }
    return null;
}

function handleMouseMove(e: MouseEvent) {
    const range = getWordRangeAtPoint(e.clientX, e.clientY);

    if (!range) {
        if (activeRange) {
            if (updateTimer) clearTimeout(updateTimer);
            updateTimer = window.setTimeout(resetFocus, 100);
        }
        return;
    }

    if (updateTimer) {
        clearTimeout(updateTimer);
        updateTimer = null;
    }

    if (!anchorRange) {
        anchorRange = range;
    }

    const compareStart = range.compareBoundaryPoints(Range.START_TO_START, anchorRange);

    const unionRange = document.createRange();

    if (compareStart <= 0) {
        unionRange.setStart(range.startContainer, range.startOffset);
        unionRange.setEnd(anchorRange.endContainer, anchorRange.endOffset);
    } else {
        unionRange.setStart(anchorRange.startContainer, anchorRange.startOffset);
        unionRange.setEnd(range.endContainer, range.endOffset);
    }

    activeRange = unionRange;

    const rect = activeRange.getBoundingClientRect();

    if (rect.width === 0) return;

    requestAnimationFrame(() => updateHole(rect));
}

function resetFocus() {
    anchorRange = null;
    activeRange = null;
    const container = document.getElementById(CONTAINER_ID);
    const magnifier = document.getElementById(MAGNIFIER_ID);
    if (container) {
        container.classList.remove('active');
    }
    if (magnifier) {
        magnifier.innerHTML = '';
        magnifier.dataset.lastText = '';
    }
}

export function enableReadingFocus() {
    if (isEnabled) return;
    isEnabled = true;
    createOverlay();
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
}

export function disableReadingFocus() {
    if (!isEnabled) return;
    isEnabled = false;
    document.removeEventListener('mousemove', handleMouseMove);

    const container = document.getElementById(CONTAINER_ID);
    if (container) container.remove();

    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
}
