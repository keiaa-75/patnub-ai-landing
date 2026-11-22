<div class="records-screen">
  <div class="welcome-mark"><img src="/screens/nurse-mark.svg" alt="patnub assistant" /></div>
  <h1>No records yet</h1>
  <p>After a visit, scan the QR code from your clinic to save the record on this phone.</p>
  <div class="scan-record-button">Scan a record from your clinic</div>
</div>

<style>
  .records-screen { position:absolute; inset:calc(254 * var(--u)) 0 calc(112 * var(--u)); color:#111819; font-family:inherit; }
  .welcome-mark { position:absolute; top:calc(106 * var(--u)); left:50%; width:calc(252 * var(--u)); height:calc(252 * var(--u)); transform:translateX(-50%); display:grid; place-items:center; border-radius:50%; background:#e0eeee; }
  .welcome-mark img { width:calc(184 * var(--u)); height:calc(186 * var(--u)); object-fit:contain; }
  h1 { position:absolute; top:calc(390 * var(--u)); left:0; right:0; margin:0; text-align:center; font-size:calc(67 * var(--u)); font-weight:300; line-height:1.15; letter-spacing:calc(-1.4 * var(--u)); }
  p { position:absolute; top:calc(500 * var(--u)); left:calc(104 * var(--u)); right:calc(104 * var(--u)); margin:0; color:#687575; text-align:center; font-size:calc(44 * var(--u)); line-height:1.42; letter-spacing:calc(.2 * var(--u)); }
  .scan-record-button { position:absolute; top:calc(752 * var(--u)); left:50%; width:calc(640 * var(--u)); height:calc(106 * var(--u)); transform:translateX(-50%); display:flex; align-items:center; justify-content:center; border-radius:99px; background:#1e7d7a; color:white; font-size:calc(39 * var(--u)); font-weight:400; white-space:nowrap; }
</style>
