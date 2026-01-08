
const STYLE_ID = 'lexilens-focus-highlight-styles';
const OVERLAY_ID = 'lexilens-selection-overlay';

let isEnabled = false;

// Feature disabled by user request. Functions are now distinct no-ops or cleanup only.

export function enableClickMagnifier() {
  // Force disable if somehow called
  disableClickMagnifier();
  return;
}

export function disableClickMagnifier() {
  isEnabled = false;

  // Cleanup listeners just in case
  const handleMouseUp = () => { };
  const requestUpdate = () => { };

  document.removeEventListener('mouseup', handleMouseUp); // This specific reference won't match, 
  // but we are just ensuring no new listeners are added in 'enable'. 
  // Real cleanup relies on the fact that enable never adds them.

  // Remove elements if they exist
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.remove();

  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
  document.body.classList.remove('lexilens-focus-active');
}
