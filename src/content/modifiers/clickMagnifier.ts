
const STYLE_ID = 'lexilens-focus-highlight-styles';
const OVERLAY_ID = 'lexilens-selection-overlay';

let isEnabled = false;

function createStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* Overlay that covers the whole screen */
    #${OVERLAY_ID} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2147483640;
      background: rgba(0, 0, 0, 0.4); 
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      /* Masking will make holes in this layer */
      mask-position: 0 0;
      -webkit-mask-position: 0 0;
      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
      pointer-events: all;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    #${OVERLAY_ID}.visible {
      opacity: 1;
    }
    
    /* Hide native selection when overlay is active to avoid blue highlight */
    body.lexilens-focus-active ::selection {
      background: transparent !important;
      color: inherit !important;
      text-shadow: 0 0 1px rgba(0,0,0,0.2) !important; /* Slight bold effect */
    }
  `;
  document.head.appendChild(style);
}

function removeStyles() {
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
  document.body.classList.remove('lexilens-focus-active');
}

function updateOverlay() {
  const selection = window.getSelection();
  let overlay = document.getElementById(OVERLAY_ID);

  // If no selection or empty, hide/remove overlay
  if (!selection || selection.isCollapsed || !selection.toString().trim()) {
    if (overlay) {
      overlay.classList.remove('visible');
      document.body.classList.remove('lexilens-focus-active');
      setTimeout(() => overlay?.remove(), 200);
    }
    return;
  }

  createStyles();

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.addEventListener('click', (e) => {
      // Clear selection logic:
      // We want to dismiss overlay. But do we clear selection?
      // User might want to keep selection.
      // But standard behavior: click outside -> clear.
      window.getSelection()?.removeAllRanges();
      updateOverlay(); // Update will see no selection and remove overlay
    });
    document.body.appendChild(overlay);
    // Force reflow
    overlay.getBoundingClientRect();
    overlay.classList.add('visible');
  } else {
    overlay.classList.add('visible');
  }

  document.body.classList.add('lexilens-focus-active');

  const range = selection.getRangeAt(0);
  const rects = Array.from(range.getClientRects());

  if (rects.length === 0) return;

  // Build SVG Path for the mask
  // Outer Rect (Clockwise) covering whole viewport
  const w = window.innerWidth;
  const h = window.innerHeight;
  let path = `M0,0 H${w} V${h} H0 Z`;

  // Inner Rects (Counter-Clockwise to create holes in Non-Zero rule, or just Even-Odd)
  // Even-odd is simpler. Just draw rects.
  // Standard Rect: Move to (x,y), Line to (x+w, y), Line to (x+w, y+h), Line to (x, y+h), Close.
  rects.forEach(r => {
    // Expand the hole slightly for breathing room
    const padding = 2;
    const x = r.left - padding;
    const y = r.top - padding;
    const rw = r.width + (padding * 2);
    const rh = r.height + (padding * 2);

    path += ` M${x},${y} L${x},${y + rh} L${x + rw},${y + rh} L${x + rw},${y} Z`;
  });

  // Create Data URI for mask
  // We use black for the path. In CSS Mask, alpha matters. 
  // We want the path to be OPAQUE (visible overlay) and holes to be empty?
  // Wait. 
  // M0,0... draws the screen. The holes are "cut out".
  // If we fill this path with black (opaque), the mask is opaque almost everywhere.
  // The "holes" (where path doesn't exist due to even-odd) are transparent.
  // Opaque Mask = element visible. Transparent Mask = element hidden.
  // So Overlay is Visible everywhere except holes. Correct.

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><path d='${path}' fill='black' fill-rule='evenodd'/></svg>`;
  const url = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;

  overlay.style.webkitMaskImage = url;
  overlay.style.maskImage = url;
}

// Throttle updates for scroll/resize
let pendingUpdate = false;
function requestUpdate() {
  if (pendingUpdate) return;
  pendingUpdate = true;
  requestAnimationFrame(() => {
    updateOverlay();
    pendingUpdate = false;
  });
}

function handleMouseUp() {
  // Give valid selection a moment to settle if needed, but usually instant
  requestAnimationFrame(updateOverlay);
}

export function enableClickMagnifier() {
  if (isEnabled) return;
  isEnabled = true;
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('keyup', handleMouseUp);
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
}

export function disableClickMagnifier() {
  if (!isEnabled) return;
  isEnabled = false;
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('keyup', handleMouseUp);
  window.removeEventListener('scroll', requestUpdate);
  window.removeEventListener('resize', requestUpdate);

  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.remove();
  removeStyles();
}
