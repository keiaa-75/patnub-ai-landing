/*
  Responsive geometry for the scroll story.

  Hero.svelte asks this module for the phone size and the horizontal /
  vertical anchor points for each layout mode, so the tablet tuning lives
  in one place.

  Units
  -----
  deviceHeight   Rendered phone height in px at scale 1 (portrait pose).
  *X             Fractions of the stage width, measured from its centre
                 (what the timeline calls xVw).
  *Y             Fractions of the stage height, measured from its centre
                 (yVh).
  margin, colW   Pixel values shared with the CSS (--col-m, --col-w).

  Modes
  -----
  desktop           Unchanged from the original composition.
  tablet-landscape  Mirrored two-column grid. The phone is centred in the
                    column opposite the copy, so the hero (copy left, phone
                    right) and the features (phone left, copy right) are
                    symmetrical, and both fill the screen evenly.
  tablet-portrait   One vertical group (phone + copy). Hero.svelte centres
                    that group in the viewport once it has measured the
                    copy, so the values here are only starting points.
*/

export const PHONE_ASPECT = 9 / 19.5;

const clamp = (min, max, value) => Math.min(max, Math.max(min, value));

export function computeLayout(mode, width, height) {
  if (mode === 'tablet-landscape') {
    const margin = clamp(32, 72, width * 0.06);
    const gap = clamp(24, 56, width * 0.04);
    const colW = Math.max(240, (width - margin * 2 - gap) / 2);

    const leftCenter = margin + colW / 2;
    const rightCenter = width - margin - colW / 2;

    // Mostly height-driven. The column term only stops the phone from
    // crowding the copy on unusually wide, short windows.
    const deviceHeight = Math.min(
      height * 0.68,
      (colW * 0.62) / PHONE_ASPECT,
      580
    );

    return {
      mode,
      deviceHeight,
      margin,
      colW,

      restX: rightCenter / width - 0.5,
      featureX: leftCenter / width - 0.5,
      restY: 0,

      enterX: -0.68,
      enterScale: 0.9,
      restScale: 1,

      finalScale: 0.9,
      finalY: 0.12,

      pitch: 3
    };
  }

  if (mode === 'tablet-portrait') {
    const deviceHeight = Math.min(
      height * 0.52,
      width * 0.74,
      640
    );

    return {
      mode,
      deviceHeight,
      margin: width * 0.07,
      colW: width * 0.86,

      restX: 0,
      featureX: 0,
      restY: 0,

      enterX: -0.72,
      enterScale: 0.9,
      restScale: 1,

      finalScale: 0.9,
      finalY: -0.1,

      pitch: 3
    };
  }

  // Desktop (and the pre-mount fallback). Values match the original.
  return {
    mode: 'desktop',
    deviceHeight: Math.min(height * 0.72, width * 0.78, 680),
    margin: width * 0.08,
    colW: Math.min(width * 0.39, 520),

    restX: 0.22,
    featureX: -0.22,
    restY: 0,

    enterX: -0.66,
    enterScale: 0.9,
    restScale: 1,

    finalScale: 1.08,
    finalY: height <= 680 ? 0.2 : 0.23,

    pitch: 4
  };
}