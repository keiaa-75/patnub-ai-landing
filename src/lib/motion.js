/*
  Material 3 Expressive motion, as GSAP easings.

  Expressive motion uses two kinds of spring:
    - spatial: position, size, rotation, shape. Slightly bouncy, then settles.
    - effects: colour, opacity. Never overshoots.

  Each ease runs over GSAP's 0..1 progress and is exactly 1 at the end.
  Use spatial/effects for time-based animations. Scroll-scrubbed motion
  (the phone's spins and slides) stays on regular eases.
*/

const underdamped = (zeta, omega) => {
  const damped = omega * Math.sqrt(1 - zeta * zeta);

  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    const decay = Math.exp(-zeta * omega * t);

    return 1 - decay * (
      Math.cos(damped * t) +
      ((zeta * omega) / damped) * Math.sin(damped * t)
    );
  };
};

const critical = (omega) => (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  return 1 - (1 + omega * t) * Math.exp(-omega * t);
};

// About 8% overshoot, settled by the end of the tween.
export const spatial = underdamped(0.62, 11);

// Fast and smooth, no overshoot.
export const effects = critical(9);