/*
  BrewCode Hackathon artwork renderer.

  Shared by the CSS fallback canvas and the Three.js screen texture.
  The composition uses Material 3 Expressive principles:
    - dramatic, variable-font typographic hierarchy
    - tonal color roles with confident primary/secondary contrast
    - expressive containment and contrasting shape families
    - a purposeful code symbol as the hero graphic
    - restrained spring motion and shape morphing

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

function drawCodeMark(ctx, cx, cy, scale, color, cursorVisible, pulse = 0) {
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

  if (cursorVisible) {
    ctx.fillStyle = color;
    roundedRectPath(ctx, 310, -30, 14, 78, 7);
    ctx.fill();
  }

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
  const lift = Math.max(0, pulse) * 3;

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

  const titlePulse = animated ? springPulse(t, 0.05) : 0;
  const shapePulse = animated ? springPulse(t, 0.35) : 0;
  const dotPulseA = animated ? springPulse(t, 1.05) : 0;
  const dotPulseB = animated ? springPulse(t, 1.4) : 0;

  const positiveTitlePulse = Math.max(0, titlePulse);
  const positiveShapePulse = Math.max(0, shapePulse);

  ctx.save();
  ctx.clearRect(0, 0, BREWCODE_ARTWORK_WIDTH, BREWCODE_ARTWORK_HEIGHT);

  // A single, quiet surface lets the event title and expressive shapes lead.
  ctx.fillStyle = c.surface;
  ctx.fillRect(0, 0, BREWCODE_ARTWORK_WIDTH, BREWCODE_ARTWORK_HEIGHT);

  // Main event name: dramatic hierarchy, no kicker or supporting slogan.
  const titleWeight = 835 + positiveTitlePulse * 135;
  const titleWidth = 96 + positiveTitlePulse * 4.5;
  const titleSize = 222;

  const brewWidth = drawFlexText(
    ctx,
    'Brew',
    148,
    388,
    titleSize,
    titleWeight,
    titleWidth,
    c.onSurface
  );

  drawFlexText(
    ctx,
    'Code',
    148 + brewWidth + 13,
    388,
    titleSize,
    Math.min(1000, titleWeight + 25),
    Math.max(92, titleWidth - 1.5),
    c.primary
  );

  drawFlexText(
    ctx,
    'Hackathon',
    146,
    635,
    226,
    900 + positiveTitlePulse * 100,
    94 + positiveTitlePulse * 3.5,
    c.secondary
  );

  // Organizer credit is intentionally the only supporting text.
  drawOrganizerCredit(ctx, t, animated);

  /*
    Right-side hero moment:
    a solid tonal backing shape and a large morphing Cookie-4 silhouette.
    These act as containment for the instantly recognizable code mark.
  */
  const heroX = 1840;
  const heroY = 525 + shapePulse * 7;
  const heroRotation = -0.045 + shapePulse * 0.022;
  const heroScale = 1 + positiveShapePulse * 0.027;

  // Secondary tonal backing: asymmetrical rounded rectangle, no gradient.
  ctx.save();
  ctx.translate(heroX - 28, heroY + 26);
  ctx.rotate(-0.105);
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
    !animated || Math.floor(t * 1.1) % 2 === 0,
    shapePulse
  );

  ctx.restore();

  // A contained tertiary accent overlaps the main shape edge.
  const accentX = 2132 + dotPulseA * 8;
  const accentY = 276 - dotPulseA * 9;
  const accentSize = 116 + Math.max(0, dotPulseA) * 10;

  ctx.save();
  ctx.translate(accentX, accentY);
  ctx.rotate(0.18 + dotPulseA * 0.12);
  drawShadowedShape(
    ctx,
    () => fillRoundedRect(ctx, -accentSize / 2, -accentSize / 2, accentSize, accentSize, 38 + Math.max(0, dotPulseA) * 25, c.tertiaryContainer),
    c.tertiaryContainer,
    'rgba(0, 73, 66, 0.12)'
  );
  drawFourPointStar(ctx, 0, 0, 32 + Math.max(0, dotPulseA) * 5, dotPulseA * 0.14, c.tertiary);
  ctx.restore();

  // A small blue circle balances the composition without adding more text.
  const orbitX = 1514;
  const orbitY = 760 + dotPulseB * 10;
  drawCircle(ctx, orbitX, orbitY, 29 + Math.max(0, dotPulseB) * 5, c.secondary);
  drawCircle(ctx, orbitX + 53, orbitY + 22, 13, c.primary);
  drawCircle(ctx, orbitX + 30, orbitY + 63, 9, c.tertiary);

  // Four-dot shape cluster: each dot responds with a staggered spring.
  const clusterX = 2075;
  const clusterY = 850;
  const dots = [
    { x: 0, y: 0, r: 16, color: c.primary, phase: 0.2 },
    { x: 48, y: 0, r: 22, color: c.secondary, phase: 0.5 },
    { x: 96, y: 0, r: 14, color: c.tertiary, phase: 0.8 },
    { x: 48, y: 47, r: 10, color: c.primary, phase: 1.1 }
  ];

  for (const dot of dots) {
    const pulse = animated ? springPulse(t, dot.phase) : 0;
    const radius = dot.r * (1 + Math.max(0, pulse) * 0.17);
    drawCircle(ctx, clusterX + dot.x, clusterY + dot.y - pulse * 5, radius, dot.color);
  }

  // A final sparkle is a single expressive punctuation mark, not a label.
  drawFourPointStar(
    ctx,
    1480,
    238 + shapePulse * 5,
    25 + positiveShapePulse * 7,
    -0.25 + shapePulse * 0.16,
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