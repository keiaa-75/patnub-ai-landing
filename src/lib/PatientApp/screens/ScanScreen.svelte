<script>
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

<div class="scan-screen">
  <div class="previous-card-clip" aria-hidden="true">
    <div class="previous-button">Scan a record from your clinic</div>
  </div>

  <section class="checkin-card">
    <h1>Your check-in code</h1>
    <p>Show this code at the clinic so they can send visit records only to this phone. The screen stays bright while it is open.</p>
    <div class="qr-frame" aria-label="Illustrative sample QR code, not a real check-in code">
      <svg class="qr" viewBox="0 0 41 41" shape-rendering="crispEdges" aria-hidden="true">
        <rect width="41" height="41" fill="#fff" />
        <path d={qrPath} fill="#050505" />
      </svg>
    </div>
  </section>
</div>

<style>
  .scan-screen { position:absolute; inset:calc(254 * var(--u)) 0 calc(112 * var(--u)); overflow:hidden; font-family:inherit; color:#111819; }
  .previous-card-clip { position:absolute; top:0; left:calc(42 * var(--u)); right:calc(42 * var(--u)); height:calc(126 * var(--u)); overflow:hidden; border-radius:0 0 calc(42 * var(--u)) calc(42 * var(--u)); background:#fff; border:1px solid #dfe6e7; border-top:0; }
  .previous-button { position:absolute; top:calc(-53 * var(--u)); left:calc(52 * var(--u)); right:calc(52 * var(--u)); height:calc(128 * var(--u)); display:flex; align-items:center; justify-content:center; border-radius:calc(34 * var(--u)); background:#1e7d7a; color:#fff; font-size:calc(36 * var(--u)); white-space:nowrap; }
  .checkin-card { position:absolute; top:calc(170 * var(--u)); left:calc(42 * var(--u)); right:calc(42 * var(--u)); min-height:calc(1244 * var(--u)); padding:calc(54 * var(--u)) calc(52 * var(--u)); border:1px solid #dfe6e7; border-radius:calc(43 * var(--u)); background:#fff; }
  h1 { margin:0 0 calc(26 * var(--u)); font-size:calc(60 * var(--u)); line-height:1.15; font-weight:300; letter-spacing:calc(-1.1 * var(--u)); }
  p { margin:0; color:#687575; font-size:calc(44 * var(--u)); line-height:1.42; letter-spacing:calc(.05 * var(--u)); max-width:calc(716 * var(--u)); }
  .qr-frame { width:calc(690 * var(--u)); height:calc(690 * var(--u)); margin:calc(74 * var(--u)) auto 0; display:grid; place-items:center; background:#fff; }
  .qr { display:block; width:100%; height:100%; }
</style>
