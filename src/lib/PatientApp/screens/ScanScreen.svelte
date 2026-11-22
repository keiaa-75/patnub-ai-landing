<script>
  /*
    Set to false to leave the viewfinder empty, as in the app before a code is
    in view. The code below is decorative only. It is not a real credential.
  */
  const SHOW_SAMPLE_CODE = true;

  const qrRows = [
    '11111110110111101111000111110001101111111',
    '10000010001010001001011010010110101000001',
    '10111010110111101100001111000011101011101',
    '10111010000111110001101000011010001011101',
    '10111010011011001101111101011111001011101',
    '10000010100100100110100101101001001000001',
    '11111110101010101010101010101010101111111',
    '00000000000101011010000110100011100000000',
    '10100011000011101101111001110010000100101',
    '10001100111001100111000011101010010001000',
    '10011010100111101001111100001110000011000',
    '10111001100110000100001111001011001001101',
    '01010010100011000100111001001110000110000',
    '11110001000000011000111000001110000111010',
    '00010110000101110110100101101001011101111',
    '00001000000101001011110000111100011111010',
    '00100010100011011110010111100101111001111',
    '00100100001111101110000011100000100101100',
    '10010111100110101001011010010110111111011',
    '10001001000111011100001111000011110101111',
    '01111011100101110101111001011110011011111',
    '01101101010011010100111000001110010000000',
    '00000110011010111010100101001101000010100',
    '10110100101000101101101000111110001000010',
    '01101011001010000100110110000001100110101',
    '11011001010101110011011110101100000110110',
    '00011111110111000110100111100000111101011',
    '10110101110000111011110110111100110111010',
    '00010010010011111111010111110100111111011',
    '01011000110010100110000011100000110001000',
    '11110110010100011001011010010110110110100',
    '00000000000110110100001111000011101010001',
    '11101011001110100101111001011110111110000',
    '00000000110001111000111000001111100010011',
    '11111110110011000110100101101001101010101',
    '10000010010000110011110000111100100010000',
    '10111010010110011110010111100101111110111',
    '10111010001100101010000010100101001101110',
    '10111010100000010101010010110111111011011',
    '10000010011011000100001111000110011101101',
    '11111110110100100111011000011000010111111'
  ];
  const qrPath = qrRows.map((row, y) => {
    let path = '';
    for (let x = 0; x < row.length;) {
      if (row[x] !== '1') { x += 1; continue; }
      const start = x;
      while (x < row.length && row[x] === '1') x += 1;
      path += `M${start} ${y}h${x - start}v1h-${x - start}z`;
    }
    return path;
  }).join('');
</script>

<!--
  Scan, camera open.

  Reference: the real app's QR scanner. Coordinates are canvas units
  (1u = 1px of the 945px-wide texture) from the top of the screen area.
  The camera preview is drawn as an SVG so the texture never depends on a
  photo: a softly blurred clinic screen in perspective, a desk edge, and a
  vignette, under the same rounded viewfinder the app draws.
-->
<div class="scan-screen">
  <p class="instruction">Point the camera at the QR code on the clinic screen.</p>

  <div class="camera" role="img" aria-label="Camera preview pointed at a clinic screen. Illustrative only.">
    <svg class="feed" viewBox="0 0 840 1050" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="scan-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f2f4f3" />
          <stop offset="1" stop-color="#d5dad8" />
        </linearGradient>
        <linearGradient id="scan-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#bcc3c1" />
          <stop offset="1" stop-color="#8d9694" />
        </linearGradient>
        <radialGradient id="scan-vignette" cx="50%" cy="48%" r="74%">
          <stop offset=".55" stop-color="#0c1f1f" stop-opacity="0" />
          <stop offset="1" stop-color="#0c1f1f" stop-opacity=".26" />
        </radialGradient>
        <filter id="scan-soft" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1" /></filter>
        <filter id="scan-edge" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.2" /></filter>
        <filter id="scan-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>

      <rect width="840" height="1050" fill="url(#scan-wall)" />

      <!-- Clinic screen, tilted the way a hand-held phone sees it -->
      <g transform="rotate(7 420 430)" filter="url(#scan-soft)" font-family="Roboto, Arial, sans-serif">
        <rect x="-120" y="-80" width="1100" height="900" fill="#f8f9f9" />
        <rect x="-120" y="-80" width="400" height="900" fill="#eceeee" />

        <text x="60" y="150" font-size="20" fill="#7a8584">No patients match “”.</text>
        <rect x="60" y="172" width="132" height="36" rx="18" fill="#fff" stroke="#ccd3d2" stroke-width="2" />
        <text x="82" y="196" font-size="17" font-weight="500" fill="#6c7776">Clear search</text>
        <rect x="52" y="20" width="250" height="62" rx="16" fill="#e0e4e3" />

        <text x="330" y="118" font-size="20" fill="#6f7a79">Write in English or Taglish. Your original note stays</text>
        <text x="330" y="176" font-size="18" font-weight="700" fill="#6b7473">Templates:</text>
        <g font-size="17" fill="#5f6a69" stroke="#d3d9d8" stroke-width="2">
          <rect x="430" y="150" width="148" height="36" rx="18" fill="#eef0f0" />
          <rect x="594" y="150" width="128" height="36" rx="18" fill="#eef0f0" />
          <rect x="738" y="150" width="120" height="36" rx="18" fill="#eef0f0" />
        </g>
        <g font-size="17" fill="#5f6a69">
          <text x="452" y="174">Hypertension</text>
          <text x="618" y="174">Cough / URI</text>
          <text x="762" y="174">Gastro</text>
        </g>

        {#if !SHOW_SAMPLE_CODE}
          <rect x="330" y="214" width="640" height="360" rx="16" fill="#fcfcfc" stroke="#c8cecd" stroke-width="3" />
          <text x="352" y="258" font-size="19" fill="#8a9392">e.g. BP 150/95. Assessment: Stage 1 hypertension</text>
        {/if}
      </g>

      <!-- Desk edge -->
      <polygon points="-10,800 850,990 850,1060 -10,1060" fill="url(#scan-desk)" filter="url(#scan-edge)" />

      {#if SHOW_SAMPLE_CODE}
        <g transform="translate(420 525) rotate(7)">
          <rect x="-208" y="-208" width="440" height="440" rx="18" fill="#9fb0ae" opacity=".55" filter="url(#scan-glow)" />
          <rect x="-220" y="-220" width="440" height="440" rx="16" fill="#fff" />
          <g transform="translate(-197 -197) scale(9.6)">
            <path d={qrPath} fill="#0d1414" shape-rendering="crispEdges" />
          </g>
        </g>
      {/if}

      <rect width="840" height="1050" fill="url(#scan-vignette)" />
    </svg>

    <span class="finder" aria-hidden="true"></span>
  </div>

  <div class="cancel">Cancel</div>
</div>

<style>
  .scan-screen { position:absolute; inset:calc(254 * var(--u)) 0 calc(112 * var(--u)); overflow:hidden; font-family:inherit; color:#111819; }

  .instruction { position:absolute; top:calc(41 * var(--u)); left:calc(52 * var(--u)); right:calc(52 * var(--u)); margin:0; font-size:calc(34 * var(--u)); font-weight:500; line-height:calc(56 * var(--u)); letter-spacing:calc(1 * var(--u)); }

  .camera { position:absolute; top:calc(193 * var(--u)); left:calc(52 * var(--u)); right:calc(52 * var(--u)); height:calc(1050 * var(--u)); overflow:hidden; border-radius:calc(48 * var(--u)); background:#d5dad8; box-shadow:0 0 0 1px #dde5e6; }
  .feed { position:absolute; inset:0; display:block; width:100%; height:100%; }

  /* The rounded-square viewfinder, centred in the preview */
  .finder { position:absolute; top:50%; left:50%; width:calc(603 * var(--u)); height:calc(603 * var(--u)); transform:translate(-50%, -50%); border:calc(4.5 * var(--u)) solid #fff; border-radius:calc(52 * var(--u)); box-shadow:0 0 0 calc(1.5 * var(--u)) rgba(10,30,30,.16), 0 0 calc(14 * var(--u)) rgba(10,30,30,.28), inset 0 0 0 calc(1.5 * var(--u)) rgba(10,30,30,.12); }

  .cancel { position:absolute; top:calc(1292 * var(--u)); left:calc(52 * var(--u)); right:calc(52 * var(--u)); height:calc(100 * var(--u)); display:grid; place-items:center; border:calc(2.5 * var(--u)) solid #b4cbc9; border-radius:99px; color:#1b2b2b; font-size:calc(33 * var(--u)); font-weight:500; letter-spacing:calc(.3 * var(--u)); }
</style>
