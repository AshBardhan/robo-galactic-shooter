type Theme = 'day' | 'night';

/**
 * Checks if the current local time falls within night hours (6 PM to 6 AM)
 */
function isNightTime(): boolean {
  const currentHour = new Date().getHours();
  return currentHour >= 18 || currentHour <= 5;
}

/**
 * Applies the specified theme to the document
 * @param theme - The theme to apply ('day' or 'night')
 * @param withTransition - Whether to animate the theme change
 */
function applyTheme(theme: Theme, withTransition = false): void {
  const htmlElement = document.documentElement;

  if (theme === 'night') {
    htmlElement.classList.add('night-mode');
  } else {
    htmlElement.classList.remove('night-mode');
  }

  if (withTransition) {
    htmlElement.classList.add('theme-transition');
    requestAnimationFrame(() => {
      htmlElement.classList.remove('theme-transition');
    });
  }
}

/**
 * Initializes the theme system on page load
 * - Checks localStorage for previously saved theme
 * - Determines current theme based on local time
 * - Applies theme instantly if it matches stored theme (prevents flash)
 * - Animates transition if stored theme differs from current time
 */
export function initTheme(): void {
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  const actualTheme = isNightTime() ? 'night' : 'day';
  const themesMatch = storedTheme === actualTheme;

  localStorage.setItem('theme', actualTheme);

  if (themesMatch) {
    // Current time matches stored theme - apply instantly
    applyTheme(actualTheme, false);
  } else if (storedTheme) {
    // Time has changed - show previous theme, then animate to current
    applyTheme(storedTheme, false);
    requestAnimationFrame(() => applyTheme(actualTheme, true));
  } else {
    // First visit - apply current theme instantly
    applyTheme(actualTheme, false);
  }
}
