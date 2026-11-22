/*
  BrewCode Hackathon artwork renderer.

  Shared by the CSS fallback canvas and the Three.js screen texture.
  The composition uses Material 3 Expressive principles:
    - dramatic, variable-font typographic hierarchy
    - tonal color roles with confident primary/secondary contrast
    - expressive containment and contrasting shape families
    - a purposeful code symbol as the hero graphic
    - staggered spring typography with variable weight and width
    - independently drifting, rotating decorative shape elements
    - expressive shape morphing with distinct motion rhythms

  Only the event name and organizer attribution are displayed.
  No patnub.ai branding, kickers, slogans, or decorative microcopy.
*/

export const BREWCODE_ARTWORK_WIDTH = 2340;
export const BREWCODE_ARTWORK_HEIGHT = 1080;

export const BREWCODE_COLORS = Object.freeze({
  surface: '#F8F6FC',
  surfaceContainerLow: '#F0EDF6',
  surfaceContainer: '#EAE6F1',
  surfaceContainerHigh: '#E4DFF0',
  onSurface: '#1D1A2A',
  onSurfaceVariant: '#494456',
  outlineVariant: '#C9C2D7',

  primary: '#6247C5',
  primaryStrong: '#4B329F',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E5DAFF',
  onPrimaryContainer: '#24104F',

  secondary: '#385DB0',
  secondaryStrong: '#28488F',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#DCE5FF',
  onSecondaryContainer: '#142B56',

  tertiary: '#006B62',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#BCEDE5',
  onTertiaryContainer: '#00201B'
});

const FONT = '"Roboto Flex", "Roboto", Arial, sans-serif';
const TAU = Math.PI * 2;

function roundedRectPath(ctx, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function fillRoundedRect(ctx, x, y, width, height, radius, color) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = color;
  ctx.fill();
}

function strokeRoundedRect(ctx, x, y, width, height, radius, color, lineWidth = 2) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawShadowedShape(ctx, draw, color, shadow = 'rgba(31, 24, 52, 0.18)') {
  ctx.save();
  ctx.shadowColor = shadow;
  ctx.shadowBlur = 34;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = color;
  draw();
  ctx.restore();
}

/*
  Apply Roboto Flex's variable width axis when Canvas 2D supports it.
  A horizontal scale is used as a graceful fallback in older browsers.
*/
function drawFlexText(ctx, text, x, baseline, size, weight, width, color) {
  ctx.save();
  ctx.font = `${Math.round(weight)} ${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  if ('fontStretch' in ctx) {
    ctx.fontStretch = `${width}%`;
    const measured = ctx.measureText(text).width;
    ctx.fillText(text, x, baseline);
    ctx.restore();
    return measured;
  }

  ctx.translate(x, 0);
  ctx.scale(width / 100, 1);
  const measured = ctx.measureText(text).width;
  ctx.fillText(text, 0, baseline);
  ctx.restore();
  return measured * width / 100;
}

/*
  Each title line gets its own damped spring response. The pulse affects
  vertical position, size, weight and variable width together, creating a
  more tactile M3E-style typographic entrance without distorting the words.
*/
function drawSpringText(
  ctx,
  text,
  x,
  baseline,
  size,
  weight,
  width,
  color,
  pulse,
  {
    lift = 16,
    sizeResponse = 0.055,
    weightResponse = 180,
    widthResponse = 7.5
  } = {}
) {
  const animatedSize = size * (1 + pulse * sizeResponse);
  const animatedWeight = Math.max(
    100,
    Math.min(1000, weight + pulse * weightResponse)
  );
  const animatedWidth = Math.max(
    88,
    Math.min(108, width + pulse * widthResponse)
  );
  const animatedBaseline = baseline - pulse * lift;

  return drawFlexText(
    ctx,
    text,
    x,
    animatedBaseline,
    animatedSize,
    animatedWeight,
    animatedWidth,
    color
  );
}

function drawFourPointStar(ctx, x, y, size, rotation, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(size * 0.13, -size * 0.18, size * 0.18, -size * 0.13, size, 0);
  ctx.bezierCurveTo(size * 0.18, size * 0.13, size * 0.13, size * 0.18, 0, size);
  ctx.bezierCurveTo(-size * 0.13, size * 0.18, -size * 0.18, size * 0.13, -size, 0);
  ctx.bezierCurveTo(-size * 0.18, -size * 0.13, -size * 0.13, -size * 0.18, 0, -size);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fillStyle = color;
  ctx.fill();
}

/*
  A rounded-square-to-Cookie-4 morph. Cookie/clover-like forms are part
  of the expressive shape language; the interpolation is the hero
  motion, not a decorative background ribbon.
*/
function morphShapePath(ctx, cx, cy, size, morph, rotation = 0) {
  const half = size / 2;
  const steps = 180;
  const superellipsePower = 4.2;
  const amount = Math.max(0, Math.min(1, morph));

  ctx.beginPath();

  for (let index = 0; index <= steps; index += 1) {
    const angle = (index / steps) * TAU;
    const rotated = angle + rotation;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const absCos = Math.abs(cos);
    const absSin = Math.abs(sin);

    const squareRadius = half / Math.pow(
      Math.pow(absCos, superellipsePower) + Math.pow(absSin, superellipsePower),
      1 / superellipsePower
    );

    const cookieRadius = half * (0.765 + 0.235 * Math.cos(4 * angle));
    const radius = squareRadius + (cookieRadius - squareRadius) * amount;
    const px = cx + Math.cos(rotated) * radius;
    const py = cy + Math.sin(rotated) * radius;

    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.closePath();
}

function drawCodeMark(ctx, cx, cy, scale, color, pulse = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale * (1 + Math.max(0, pulse) * 0.025), scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 35;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Opening bracket.
  ctx.beginPath();
  ctx.moveTo(-184, -112);
  ctx.lineTo(-284, 0);
  ctx.lineTo(-184, 112);
  ctx.stroke();

  // Slash.
  ctx.beginPath();
  ctx.moveTo(-38, 142);
  ctx.lineTo(38, -142);
  ctx.stroke();

  // Closing bracket.
  ctx.beginPath();
  ctx.moveTo(184, -112);
  ctx.lineTo(284, 0);
  ctx.lineTo(184, 112);
  ctx.stroke();

  ctx.restore();
}

function springPulse(time, phase = 0, period = 5.1) {
  const local = ((time + phase) % period + period) % period;
  if (local > 1.25) return 0;
  return Math.sin(local * 11.5) * Math.exp(-local * 3.55);
}

function drawOrganizerCredit(ctx, time, animated) {
  const c = BREWCODE_COLORS;
  const pulse = animated ? springPulse(time, 0.9) : 0;
  const lift = pulse * 7;

  // One contained attribution surface; no kicker or secondary slogan.
  ctx.save();
  ctx.shadowColor = 'rgba(34, 27, 54, 0.08)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 7;
  fillRoundedRect(ctx, 148, 832 + lift, 1210, 126, 34, c.surfaceContainerLow);
  ctx.restore();

  strokeRoundedRect(
    ctx,
    148,
    832 + lift,
    1210,
    126,
    34,
    c.outlineVariant,
    2
  );

  // A small expressive mark is purely decorative, not an invented ELITS logo.
  morphShapePath(ctx, 218, 895 + lift, 52, 0.7 + Math.max(0, pulse) * 0.12, -0.12);
  ctx.fillStyle = c.tertiaryContainer;
  ctx.fill();
  drawFourPointStar(ctx, 218, 895 + lift, 14, pulse * 0.2, c.tertiary);

  drawFlexText(
    ctx,
    'Cavite State University  •  Elite League of IT Students (ELITS)',
    270,
    908 + lift,
    34,
    620,
    98,
    c.onSurfaceVariant
  );
}

/**
 * Draw the landscape artwork into an already configured 2D context.
 * The context may be unrotated (CSS fallback) or rotated (WebGL texture).
 */
export function drawBrewCodeArtwork(ctx, time = 0, animated = true) {
  if (!ctx) return;

  const c = BREWCODE_COLORS;
  const t = animated ? Math.max(0, time) : 0;

  const brewPulse = animated ? springPulse(t, 0.02, 4.65) : 0;
  const codePulse = animated ? springPulse(t, 0.17, 4.65) : 0;
  const hackathonPulse = animated ? springPulse(t, 0.39, 4.9) : 0;
  const shapePulse = animated ? springPulse(t, 0.35, 5.2) : 0;
  const dotPulseA = animated ? springPulse(t, 1.05, 4.7) : 0;
  const dotPulseB = animated ? springPulse(t, 1.4, 5.0) : 0;

  const positiveShapePulse = Math.max(0, shapePulse);

  ctx.save();
  ctx.clearRect(0, 0, BREWCODE_ARTWORK_WIDTH, BREWCODE_ARTWORK_HEIGHT);

  // A single, quiet surface lets the event title and expressive shapes lead.
  ctx.fillStyle = c.surface;
  ctx.fillRect(0, 0, BREWCODE_ARTWORK_WIDTH, BREWCODE_ARTWORK_HEIGHT);

  // Main event name: each line gets a slightly staggered spring response.
  const titleSize = 222;
  const brewWidth = drawSpringText(
    ctx,
    'Brew',
    148,
    388,
    titleSize,
    835,
    96,
    c.onSurface,
    brewPulse,
    { lift: 17, sizeResponse: 0.06, widthResponse: 8, weightResponse: 190 }
  );

  drawSpringText(
    ctx,
    'Code',
    148 + brewWidth + 13,
    388,
    titleSize,
    860,
    94.5,
    c.primary,
    codePulse,
    { lift: 14, sizeResponse: 0.055, widthResponse: 7, weightResponse: 165 }
  );

  drawSpringText(
    ctx,
    'Hackathon',
    146,
    635,
    226,
    900,
    94,
    c.secondary,
    hackathonPulse,
    { lift: 20, sizeResponse: 0.052, widthResponse: 6.5, weightResponse: 145 }
  );

  // Organizer credit is intentionally the only supporting text.
  drawOrganizerCredit(ctx, t, animated);

  /*
    Right-side hero moment:
    a solid tonal backing shape and a large morphing Cookie-4 silhouette.
    These act as containment for the instantly recognizable code mark.
  */
  const heroDriftX = animated ? Math.sin(t * 0.68 + 0.35) * 24 : 0;
  const heroDriftY = animated ? Math.sin(t * 0.92 + 0.8) * 18 : 0;
  const heroX = 1840 + heroDriftX;
  const heroY = 525 + heroDriftY + shapePulse * 10;
  const heroRotation =
    -0.045 +
    shapePulse * 0.022 +
    (animated ? Math.sin(t * 0.58) * 0.055 : 0);
  const heroScale =
    1 +
    positiveShapePulse * 0.035 +
    (animated ? Math.sin(t * 0.82 + 0.4) * 0.012 : 0);

  // Secondary tonal backing floats on a slower, independent path.
  const backingX = animated ? Math.sin(t * 0.48 + 0.9) * 32 : 0;
  const backingY = animated ? Math.cos(t * 0.62 + 0.2) * 22 : 0;
  const backingRotation =
    -0.105 + (animated ? Math.sin(t * 0.44 + 0.5) * 0.045 : 0);
  ctx.save();
  ctx.translate(heroX - 28 + backingX, heroY + 26 + backingY);
  ctx.rotate(backingRotation);
  drawShadowedShape(
    ctx,
    () => fillRoundedRect(ctx, -300, -300, 600, 600, 112, c.secondaryContainer),
    c.secondaryContainer,
    'rgba(34, 49, 97, 0.12)'
  );
  strokeRoundedRect(ctx, -300, -300, 600, 600, 112, 'rgba(56, 93, 176, 0.22)', 3);
  ctx.restore();

  // Primary clover-like shape changes silhouette with a spring pulse.
  ctx.save();
  ctx.translate(heroX, heroY);
  ctx.rotate(heroRotation);
  ctx.scale(heroScale, heroScale);

  morphShapePath(
    ctx,
    0,
    0,
    585,
    0.43 + positiveShapePulse * 0.47,
    0
  );

  ctx.shadowColor = 'rgba(49, 33, 105, 0.23)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = c.primary;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(39, 23, 93, 0.24)';
  ctx.stroke();

  // Strong contrast keeps the code mark legible at phone-screen scale.
  drawCodeMark(
    ctx,
    0,
    0,
    0.72,
    c.onPrimary,
    shapePulse
  );

  ctx.restore();

  // A contained tertiary accent travels on its own small elliptical orbit.
  const accentPhase = t * 0.76 + 0.65;
  const accentX =
    2132 + (animated ? Math.sin(accentPhase) * 27 : 0) + dotPulseA * 8;
  const accentY =
    276 + (animated ? Math.cos(accentPhase * 0.86) * 34 : 0) - dotPulseA * 9;
  const accentSize =
    116 + Math.max(0, dotPulseA) * 12 + (animated ? Math.sin(t * 1.15) * 4 : 0);

  ctx.save();
  ctx.translate(accentX, accentY);
  ctx.rotate(0.18 + dotPulseA * 0.12 + (animated ? Math.sin(t * 0.7) * 0.16 : 0));
  drawShadowedShape(
    ctx,
    () => fillRoundedRect(
      ctx,
      -accentSize / 2,
      -accentSize / 2,
      accentSize,
      accentSize,
      38 + Math.max(0, dotPulseA) * 25,
      c.tertiaryContainer
    ),
    c.tertiaryContainer,
    'rgba(0, 73, 66, 0.12)'
  );
  drawFourPointStar(
    ctx,
    0,
    0,
    32 + Math.max(0, dotPulseA) * 5,
    dotPulseA * 0.14 + (animated ? t * 0.22 : 0),
    c.tertiary
  );
  ctx.restore();

  // A small three-dot orbit balances the composition without adding text.
  const orbitPhase = t * 0.58 + 0.4;
  const orbitX = 1514 + (animated ? Math.cos(orbitPhase) * 42 : 0);
  const orbitY =
    760 + (animated ? Math.sin(orbitPhase) * 25 : 0) + dotPulseB * 10;
  ctx.save();
  ctx.translate(orbitX, orbitY);
  ctx.rotate(animated ? Math.sin(t * 0.42) * 0.16 : 0);
  drawCircle(ctx, 0, 0, 29 + Math.max(0, dotPulseB) * 5, c.secondary);
  drawCircle(ctx, 53, 22, 13, c.primary);
  drawCircle(ctx, 30, 63, 9, c.tertiary);
  ctx.restore();

  // Four-dot shape cluster: the group drifts and turns while its dots spring in sequence.
  const clusterX =
    2075 + (animated ? Math.sin(t * 0.51 + 1.2) * 31 : 0);
  const clusterY =
    850 + (animated ? Math.cos(t * 0.67 + 0.2) * 22 : 0);
  const dots = [
    { x: 0, y: 0, r: 16, color: c.primary, phase: 0.2 },
    { x: 48, y: 0, r: 22, color: c.secondary, phase: 0.5 },
    { x: 96, y: 0, r: 14, color: c.tertiary, phase: 0.8 },
    { x: 48, y: 47, r: 10, color: c.primary, phase: 1.1 }
  ];

  ctx.save();
  ctx.translate(clusterX, clusterY);
  ctx.rotate(animated ? Math.sin(t * 0.46 + 0.9) * 0.14 : 0);
  for (const dot of dots) {
    const pulse = animated ? springPulse(t, dot.phase, 4.8) : 0;
    const radius = dot.r * (1 + Math.max(0, pulse) * 0.2);
    const drift = animated ? Math.sin(t * 0.78 + dot.phase) * 7 : 0;
    drawCircle(ctx, dot.x + drift, dot.y - pulse * 7, radius, dot.color);
  }
  ctx.restore();

  // A final sparkle gently wanders and rotates like the page's M3E accents.
  drawFourPointStar(
    ctx,
    1480 + (animated ? Math.sin(t * 0.72 + 0.8) * 34 : 0),
    238 + (animated ? Math.cos(t * 0.61 + 0.4) * 23 : 0) + shapePulse * 5,
    25 + positiveShapePulse * 7,
    -0.25 + shapePulse * 0.16 + (animated ? t * 0.12 : 0),
    c.tertiary
  );

  ctx.restore();
}

/**
 * Configure one shared artwork canvas.
 *
 * For the DOM fallback, use the default landscape canvas dimensions.
 * For Three.js, request portraitTexture so the same landscape drawing
 * is rotated into the portrait texture expected by the phone display UVs.
 */
export function createBrewCodeArtworkSurface(
  canvas = null,
  { portraitTexture = false } = {}
) {
  const target = canvas || document.createElement('canvas');

  target.width = portraitTexture ? 1080 : BREWCODE_ARTWORK_WIDTH;
  target.height = portraitTexture ? 2340 : BREWCODE_ARTWORK_HEIGHT;

  const context = target.getContext('2d', {
    alpha: false,
    desynchronized: true
  });

  if (!context) {
    throw new Error('Could not create the BrewCode artwork canvas context.');
  }

  if (portraitTexture) {
    context.translate(1080, 0);
    context.rotate(Math.PI / 2);
  }

  return {
    canvas: target,
    draw(time = 0, animated = true) {
      drawBrewCodeArtwork(context, time, animated);
    }
  };
}

export async function waitForBrewCodeArtworkFonts() {
  if (typeof document === 'undefined' || !document.fonts?.load) return;

  await Promise.all([
    document.fonts.load(`900 222px ${FONT}`),
    document.fonts.load(`900 226px ${FONT}`),
    document.fonts.load(`620 34px ${FONT}`)
  ]).catch(() => {});
}