/*
  Shared document scroll lock.

  A reference count lets independent modal surfaces hold a lock
  at the same time without accidentally unlocking one another.
*/

let activeLocks = 0;
let originalStyles = null;

export function acquireScrollLock() {
  if (typeof document === 'undefined') {
    return () => {};
  }

  const root = document.documentElement;
  const body = document.body;

  if (activeLocks === 0) {
    const scrollbarWidth = Math.max(
      0,
      window.innerWidth - root.clientWidth
    );

    originalStyles = {
      rootOverflow: root.style.overflow,
      rootOverscrollBehavior: root.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyPaddingRight: body.style.paddingRight
    };

    root.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(
        window.getComputedStyle(body).paddingRight
      ) || 0;

      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
  }

  activeLocks += 1;

  let released = false;

  return () => {
    if (released) return;

    released = true;
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks !== 0 || !originalStyles) return;

    root.style.overflow = originalStyles.rootOverflow;
    root.style.overscrollBehavior = originalStyles.rootOverscrollBehavior;
    body.style.overflow = originalStyles.bodyOverflow;
    body.style.overscrollBehavior = originalStyles.bodyOverscrollBehavior;
    body.style.paddingRight = originalStyles.bodyPaddingRight;

    originalStyles = null;
  };
}