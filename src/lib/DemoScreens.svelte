<script>
  let { index = 0 } = $props();

  const tabs = [
    { icon: '✦', label: 'Assistant' },
    { icon: '▤', label: 'Records' },
    { icon: '⛶', label: 'Scan' },
    { icon: '◍', label: 'Medicines' },
    { icon: '◇', label: 'Profiles' }
  ];
</script>

<div class="ui">
  <div class="topbar">
    <span class="logo">✚</span>
    <span class="brand">patnub.ai</span>
    <span class="offline"><i></i> OFFLINE</span>
  </div>

  {#if index === 0}
    <div class="chat">
      <header class="chat-head">
        <h1>patnub.ai Assistant</h1>
        <p>Plain-language health information · not a diagnosis</p>
      </header>

      <div class="ctx">🛡 Using instructions from <b>Ana Reyes, MD</b> · Nov 18</div>

      <div class="msgs">
        <div class="bubble me">I've had a headache for two days and feel dizzy when I stand up</div>
        <div class="bubble ai">
          <p>Your record from Ana Reyes, MD notes <b>high blood pressure</b> and Amlodipine 5 mg each morning.</p>
          <p>MedlinePlus says a sudden severe headache with dizziness can be a warning sign. If it's sudden or the worst you've felt, seek urgent care.</p>
          <div class="sources">▤ MedlinePlus · FDA label · Your record</div>
          <div class="caution">Not a diagnosis. Please check with your clinician.</div>
        </div>
      </div>

      <div class="composer">
        <span class="mic">◉</span>
        <span class="input">Describe a symptom or ask a question</span>
        <span class="send">↑</span>
      </div>
    </div>
  {:else if index === 1}
    <div class="screen">
      <h1 class="lt">Records</h1>
      <p class="sub">Doctor-approved summaries you chose to save.</p>

      <div class="rec">
        <div class="date"><span>NOV</span><b>18</b></div>
        <div class="rec-main">
          <div class="verified">🛡 Ana Reyes, MD</div>
          <p class="t">Stage 1 hypertension</p>
          <p class="m">RHU San Isidro</p>
          <div class="chips"><span>◍ Amlodipine 5 mg</span></div>
        </div>
      </div>

      <div class="privacy">🔒 Only you can see these. The assistant uses them only to answer questions about your own care.</div>

      <div class="rec muted-rec">
        <div class="date"><span>OCT</span><b>02</b></div>
        <div class="rec-main">
          <div class="reported">◌ Patient reported</div>
          <p class="t">Headaches in the afternoon</p>
          <p class="m">Added by you</p>
        </div>
      </div>
    </div>
  {:else if index === 2}
    <div class="screen">
      <h1 class="lt">Scan</h1>
      <p class="sub">Save your doctor's instructions from their QR code.</p>

      <div class="viewfinder">
        <div class="reticle">
          <svg viewBox="0 0 21 21" class="qr" aria-hidden="true">
            <rect width="21" height="21" fill="#fff"></rect>
            <g fill="#1c1c1e">
              <path d="M0 0h7v7H0zM14 0h7v7h-7zM0 14h7v7H0z"></path>
            </g>
            <g fill="#fff">
              <path d="M1 1h5v5H1zM15 1h5v5h-5zM1 15h5v5H1z"></path>
            </g>
            <g fill="#1c1c1e">
              <path d="M2 2h3v3H2zM16 2h3v3h-3zM2 16h3v3H2zM9 1h2v2H9zM12 4h2v2h-2zM8 7h3v2H8zM12 9h2v3h-2zM9 12h3v2H9zM5 10h3v2H5zM16 11h2v2h-2zM13 15h3v2h-3zM8 17h2v2H8zM18 17h2v2h-2z"></path>
            </g>
          </svg>
          <span class="scanline"></span>
        </div>
        <p class="vf-cap">Point your camera at the code</p>
      </div>

      <div class="status">🛡 A code from <b>Ana Reyes, MD</b> for Maria Dela Cruz is ready</div>
      <div class="primary-btn">Save to my records</div>
    </div>
  {:else}
    <div class="screen">
      <h1 class="lt">Medicines</h1>
      <p class="sub">General information from reviewed references.</p>

      <div class="search">⌕ Search by name</div>
      <div class="scanpack"><b>⛶ Scan packaging</b><span>Point at the box or blister pack</span><i>›</i></div>

      <div class="li">
        <span class="tile">◍</span>
        <span class="grow"><b>Amlodipine 5 mg</b><small>Calcium channel blocker</small></span>
        <span class="badge">Prescribed</span>
      </div>
      <div class="li">
        <span class="tile">◍</span>
        <span class="grow"><b>Paracetamol 500 mg</b><small>Pain and fever</small></span>
      </div>
      <div class="li">
        <span class="tile">◍</span>
        <span class="grow"><b>Metformin 500 mg</b><small>Type 2 diabetes</small></span>
      </div>

      <div class="fda">▤ FDA Philippines · brand and product details from the registry</div>
    </div>
  {/if}

  <nav class="tabbar" aria-label="App tabs">
    {#each tabs as tab, i}
      <div class="tab" class:on={i === index} class:scan={i === 2}>
        <span class="ico">{tab.icon}</span>
        <span class="lbl">{tab.label}</span>
      </div>
    {/each}
  </nav>
</div>

<style>
  .ui {
    /* Scoped to the phone: stable brand UI, independent of the stage bloom. */
    --bg: #f2f2f7;
    --surface: #fff;
    --surface-2: #f6f6f9;
    --text: #1c1c1e;
    --text-2: #62626a;
    --text-3: #9a9aa2;
    --line: rgba(60, 60, 67, 0.13);
    --accent: #0e8f7e;
    --accent-soft: rgba(14, 143, 126, 0.11);
    --accent-text: #0a7062;
    --danger: #d93636;

    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
    font-size: 12px;
  }

  .topbar {
    flex: none;
    height: 38px;
    padding: 0 13px;
    display: flex;
    align-items: center;
    gap: 7px;
    background: var(--surface);
    border-bottom: 0.5px solid var(--line);
  }
  .logo {
    width: 19px;
    height: 19px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    font-size: 11px;
    color: #fff;
    background: linear-gradient(160deg, #17a893, #0b7a6b);
  }
  .brand { font-weight: 800; font-size: 11px; letter-spacing: -0.02em; }
  .offline {
    margin-left: auto;
    font-size: 7px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--accent-text);
    background: var(--accent-soft);
    padding: 3px 6px;
    border-radius: 99px;
  }
  .offline i {
    display: inline-block;
    width: 4px;
    height: 4px;
    margin-right: 4px;
    border-radius: 50%;
    background: var(--accent);
    vertical-align: middle;
  }

  .chat { flex: 1; display: flex; flex-direction: column; min-height: 0; }
  .chat-head { flex: none; padding: 11px 14px 8px; }
  .chat-head h1 { margin: 0; font-size: 14px; letter-spacing: -0.025em; }
  .chat-head p { margin: 2px 0 0; font-size: 8px; color: var(--text-2); }

  .ctx {
    flex: none;
    margin: 0 12px 8px;
    padding: 7px 9px;
    border-radius: 9px;
    background: var(--accent-soft);
    color: var(--accent-text);
    font-size: 8px;
  }

  .msgs { flex: 1; min-height: 0; overflow: hidden; padding: 0 12px; }
  .bubble {
    max-width: 94%;
    padding: 9px 11px;
    border-radius: 13px;
    font-size: 9.5px;
    line-height: 1.45;
    margin-bottom: 8px;
  }
  .bubble.me {
    margin-left: auto;
    background: var(--accent);
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  .bubble.ai {
    background: var(--surface);
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  .bubble.ai p { margin: 0 0 6px; }
  .sources {
    margin-top: 7px;
    padding-top: 6px;
    border-top: 0.5px solid var(--line);
    font-size: 7.5px;
    font-weight: 700;
    color: var(--accent-text);
  }
  .caution { margin-top: 4px; font-size: 7px; color: var(--danger); }

  .composer {
    flex: none;
    margin: 2px 12px 8px;
    padding: 6px 8px;
    display: flex;
    align-items: center;
    gap: 7px;
    background: var(--surface);
    border: 0.5px solid var(--line);
    border-radius: 12px;
  }
  .mic { color: var(--accent); font-size: 12px; }
  .input { flex: 1; font-size: 8px; color: var(--text-3); }
  .send {
    width: 18px;
    height: 18px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    font-size: 11px;
  }

  .screen { flex: 1; min-height: 0; overflow: hidden; padding: 14px 13px 6px; }
  .lt { margin: 0; font-size: 20px; letter-spacing: -0.045em; }
  .sub { margin: 3px 0 14px; font-size: 8.5px; line-height: 1.4; color: var(--text-2); }

  .rec {
    display: flex;
    gap: 10px;
    padding: 11px;
    margin-bottom: 9px;
    background: var(--surface);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .date {
    width: 34px;
    flex: none;
    text-align: center;
    border-right: 0.5px solid var(--line);
    padding-right: 8px;
  }
  .date span { display: block; font-size: 7px; font-weight: 800; color: var(--text-3); letter-spacing: 0.08em; }
  .date b { display: block; font-size: 17px; letter-spacing: -0.04em; }
  .rec-main { min-width: 0; }
  .verified { font-size: 7.5px; font-weight: 700; color: var(--accent-text); }
  .reported { font-size: 7.5px; font-weight: 700; color: var(--text-3); }
  .rec-main .t { margin: 3px 0 1px; font-size: 11px; font-weight: 700; }
  .rec-main .m { margin: 0; font-size: 8px; color: var(--text-2); }
  .chips { margin-top: 7px; }
  .chips span {
    display: inline-block;
    padding: 3px 7px;
    border-radius: 99px;
    background: var(--surface-2);
    font-size: 7.5px;
    color: var(--text-2);
  }
  .muted-rec { opacity: 0.75; }

  .privacy {
    display: flex;
    gap: 7px;
    padding: 10px;
    border-radius: 11px;
    background: var(--accent-soft);
    color: var(--accent-text);
    font-size: 7.5px;
    line-height: 1.5;
    margin-bottom: 9px;
  }

  .viewfinder {
    height: 208px;
    border-radius: 15px;
    background: #222627;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .reticle {
    position: relative;
    width: 112px;
    height: 112px;
    padding: 11px;
    border-radius: 12px;
    border: 1.5px solid rgba(95, 227, 204, 0.85);
    overflow: hidden;
  }
  .qr { width: 100%; height: 100%; display: block; }
  .scanline {
    position: absolute;
    left: 4px;
    right: 4px;
    top: 35%;
    height: 2px;
    background: #5fe3cc;
    box-shadow: 0 0 10px #5fe3cc;
    opacity: 0.9;
  }
  .vf-cap { margin: 13px 0 0; font-size: 8px; color: rgba(255, 255, 255, 0.65); }

  .status {
    margin-top: 11px;
    padding: 9px;
    border-radius: 10px;
    background: var(--surface);
    font-size: 8px;
    line-height: 1.45;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  .primary-btn {
    margin-top: 9px;
    padding: 10px;
    border-radius: 11px;
    text-align: center;
    background: var(--accent);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
  }

  .search {
    padding: 9px 10px;
    border-radius: 10px;
    background: var(--surface);
    color: var(--text-3);
    font-size: 8.5px;
    margin-bottom: 9px;
  }
  .scanpack {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px;
    border-radius: 10px;
    background: var(--accent-soft);
    margin-bottom: 11px;
  }
  .scanpack b { font-size: 8.5px; color: var(--accent-text); }
  .scanpack span { flex: 1; font-size: 7px; color: var(--text-2); }
  .scanpack i { font-style: normal; color: var(--text-3); font-size: 13px; }

  .li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 2px;
    border-bottom: 0.5px solid var(--line);
  }
  .tile {
    width: 26px;
    height: 26px;
    flex: none;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: var(--accent-soft);
    color: var(--accent-text);
    font-size: 12px;
  }
  .grow { flex: 1; min-width: 0; }
  .grow b { display: block; font-size: 9.5px; }
  .grow small { display: block; font-size: 7.5px; color: var(--text-2); margin-top: 1px; }
  .badge {
    padding: 3px 6px;
    border-radius: 99px;
    background: var(--accent-soft);
    color: var(--accent-text);
    font-size: 7px;
    font-weight: 700;
  }
  .fda {
    margin-top: 11px;
    padding: 8px;
    border-radius: 9px;
    background: var(--surface);
    font-size: 7px;
    line-height: 1.5;
    color: var(--text-2);
  }

  .tabbar {
    flex: none;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: var(--surface);
    border-top: 0.5px solid var(--line);
  }
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 6.5px;
    color: var(--text-3);
    min-width: 38px;
  }
  .tab.on { color: var(--accent); }
  .ico { font-size: 14px; line-height: 1; }
  .tab.scan .ico {
    width: 27px;
    height: 27px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    background: var(--accent);
    color: #fff;
    font-size: 14px;
    margin-top: -13px;
  }
</style>
