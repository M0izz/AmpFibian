/**
 * Dev-time UI Audit helper for WCAG accessibility and element IDs.
 * Can be imported or run directly in browser DevTools console.
 */
export function auditUI() {
  const missing = {
    buttonsNoId: Array.from(document.querySelectorAll('button:not([id])')),
    inputsNoId: Array.from(document.querySelectorAll('input:not([id]),select:not([id])')),
    inputsNoLabel: Array.from(document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]),select:not([aria-label]):not([aria-labelledby])')),
    dialogsNoRole: Array.from(document.querySelectorAll('[class*="modal"]:not([role])')),
    buttonsNoAria: Array.from(document.querySelectorAll('button:not([aria-label]):not(:has(*:not(svg)))'))
  };

  console.group('🔍 Roofwise UI Accessibility & Identifier Audit');
  let issuesCount = 0;
  Object.entries(missing).forEach(([k, v]) => {
    if (v.length > 0) {
      issuesCount += v.length;
      console.warn(`[Audit Flag] ${k}: ${v.length} elements`, v);
    }
  });

  if (issuesCount === 0) {
    console.info('✅ All buttons, inputs, and modals satisfy required IDs and ARIA tags.');
  } else {
    console.info(`ℹ️ Found ${issuesCount} elements needing audit refinement.`);
  }
  console.groupEnd();

  return missing;
}

// Automatically expose on window for easy browser console execution
if (typeof window !== 'undefined') {
  (window as unknown as { auditUI: typeof auditUI }).auditUI = auditUI;
}
