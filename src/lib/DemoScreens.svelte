<script>
  let { index = 0 } = $props();

  const tabs = [
    { icon: 'chat_bubble', label: 'Assistant', screen: 0 },
    { icon: 'folder_open', label: 'Records', screen: 1 },
    { icon: 'qr_code_scanner', label: 'Scan', screen: 2 },
    { icon: 'medication', label: 'Medicines', screen: 3 }
  ];
</script>

<div class="ui">
  <div class="appbar">
    <span class="app-mark material-symbols-rounded" aria-hidden="true">health_and_safety</span>
    <span class="app-brand">patnub.ai</span>
    <span class="offline"><i></i> OFFLINE</span>
  </div>

  {#if index === 0}
    <div class="screen-content assistant-screen">
      <div class="greeting">GOOD MORNING, ANA</div>
      <h1>How can I help?</h1>
      <p class="sub">Ask about your health information in your own words.</p>

      <div class="context-card">
        <span class="context-icon material-symbols-rounded">verified_user</span>
        <span><b>Using your saved record</b><small>Approved by Ana Reyes, MD</small></span>
        <span class="material-symbols-rounded context-arrow">chevron_right</span>
      </div>

      <div class="chat-label">RECENT CONVERSATION</div>
      <div class="bubble user-bubble">Why do I feel dizzy when I stand up?</div>
      <div class="bubble assistant-bubble">
        <p>Your note mentions blood pressure medicine. Some medicines may cause dizziness when standing.</p>
        <p>Stand up slowly and check with your clinician, especially if it continues.</p>
        <div class="source-line"><span class="material-symbols-rounded">menu_book</span> Health sources · Your record</div>
      </div>
      <div class="composer"><span class="material-symbols-rounded">add_circle</span><span>Ask a question...</span><span class="material-symbols-rounded send">arrow_upward</span></div>
    </div>
  {:else if index === 1}
    <div class="screen-content">
      <div class="page-heading">
        <span class="greeting">YOUR HEALTH, IN ONE PLACE</span>
        <h1>Records</h1>
        <p class="sub">Notes you've chosen to keep.</p>
      </div>

      <div class="record-card">
        <div class="record-icon material-symbols-rounded">description</div>
        <div class="record-main">
          <div class="verified"><span class="material-symbols-rounded">verified</span> CLINICIAN APPROVED</div>
          <b>Care instructions</b>
          <small>Ana Reyes, MD · Nov 18</small>
          <span class="record-chip">RHU San Isidro</span>
        </div>
        <span class="material-symbols-rounded chevron">chevron_right</span>
      </div>

      <div class="record-card">
        <div class="record-icon pale material-symbols-rounded">medication</div>
        <div class="record-main">
          <div class="record-type">MEDICINE NOTE</div>
          <b>Amlodipine 5 mg</b>
          <small>Daily · Morning</small>
          <span class="record-chip">Saved to your device</span>
        </div>
        <span class="material-symbols-rounded chevron">chevron_right</span>
      </div>

      <div class="privacy-note"><span class="material-symbols-rounded">lock</span><span>Your saved records stay on this device.</span></div>
    </div>
  {:else if index === 2}
    <div class="screen-content scan-screen">
      <div class="page-heading">
        <span class="greeting">ADD A CLINICIAN NOTE</span>
        <h1>Scan a code</h1>
        <p class="sub">Point your camera at the QR code provided by your clinic.</p>
      </div>
      <div class="scan-window">
        <div class="qr-code" aria-hidden="true">
          <svg viewBox="0 0 21 21">
            <rect width="21" height="21" rx="1" fill="#fff" />
            <g fill="#17352f">
              <path d="M1 1h6v6H1zM14 1h6v6h-6zM1 14h6v6H1z" />
              <path d="M3 3h2v2H3zM16 3h2v2h-2zM3 16h2v2H3z" fill="#fff" />
              <path d="M9 1h2v2H9zM9 5h2v2H9zM8 9h3v2H8zM13 9h2v2h-2zM17 9h3v2h-3zM9 13h2v2H9zM12 15h3v2h-3zM16 13h2v2h-2zM8 18h3v2H8zM19 18h1v2h-1z" />
            </g>
          </svg>
        </div>
        <span class="scan-corner top-left"></span><span class="scan-corner top-right"></span>
        <span class="scan-corner bottom-left"></span><span class="scan-corner bottom-right"></span>
      </div>
      <div class="scan-hint"><span class="material-symbols-rounded">qr_code_scanner</span><span>Keep the code inside the frame</span></div>
      <div class="scan-status"><span class="material-symbols-rounded">verified_user</span><span><b>Secure clinic code</b><small>Only approved notes can be saved.</small></span></div>
    </div>
  {:else}
    <div class="screen-content">
      <div class="page-heading">
        <span class="greeting">TRUSTED MEDICINE INFORMATION</span>
        <h1>Medicines</h1>
        <p class="sub">Explore clear information from reviewed sources.</p>
      </div>
      <div class="search-field"><span class="material-symbols-rounded">search</span><span>Search medicines</span></div>
      <div class="scan-action"><span class="material-symbols-rounded">photo_camera</span><span><b>Scan packaging</b><small>Look up a medicine using its label</small></span><span class="material-symbols-rounded action-arrow">chevron_right</span></div>
      <div class="list-label">RECENTLY VIEWED</div>
      <div class="medicine-row">
        <span class="medicine-icon material-symbols-rounded">pill</span>
        <span class="medicine-main"><b>Amlodipine 5 mg</b><small>Blood pressure</small></span>
        <span class="material-symbols-rounded chevron">chevron_right</span>
      </div>
      <div class="medicine-row">
        <span class="medicine-icon material-symbols-rounded">medication</span>
        <span class="medicine-main"><b>Paracetamol 500 mg</b><small>Pain and fever</small></span>
        <span class="material-symbols-rounded chevron">chevron_right</span>
      </div>
      <div class="source-note"><span class="material-symbols-rounded">fact_check</span> References include FDA Philippines.</div>
    </div>
  {/if}

  <nav class="bottom-nav" aria-label="Application navigation">
    {#each tabs as tab}
      <div class="nav-item" class:active={tab.screen === index}>
        <span class="nav-icon-wrap"><span class="material-symbols-rounded">{tab.icon}</span></span>
        <span class="nav-label">{tab.label}</span>
      </div>
    {/each}
  </nav>
</div>

<style>
  .ui {
    --app-bg: #f7faf8;
    --app-surface: #fff;
    --app-surface-low: #edf4f0;
    --app-primary: #0e8f7e;
    --app-primary-container: #d5f1e9;
    --app-ink: #17231f;
    --app-muted: #5f706a;
    --app-outline: #d9e4de;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: var(--app-ink);
    background: var(--app-bg);
    font-family: 'Roboto', Arial, sans-serif;
    font-size: 11px;
  }
  .appbar {
    flex: none;
    height: 42px;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 13px;
    background: var(--app-surface);
    border-bottom: 1px solid var(--app-outline);
  }
  .app-mark { color: var(--app-primary); font-size: 17px; }
  .app-brand { font-size: 11px; font-weight: 700; letter-spacing: -.02em; }
  .offline {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
    padding: 4px 7px;
    border-radius: 99px;
    color: #24665a;
    background: var(--app-primary-container);
    font-size: 7px;
    font-weight: 700;
    letter-spacing: .05em;
  }
  .offline i { width: 5px; height: 5px; border-radius: 50%; background: var(--app-primary); }
  .screen-content { flex: 1; min-height: 0; overflow: hidden; padding: 15px 13px 8px; }
  .greeting { display: block; margin-bottom: 6px; color: var(--app-primary); font-size: 7px; font-weight: 700; letter-spacing: .1em; }
  h1 { margin: 0; font-size: 21px; line-height: 1.1; letter-spacing: -.04em; font-weight: 700; }
  .sub { margin: 5px 0 13px; color: var(--app-muted); font-size: 9px; line-height: 1.45; }
  .context-card {
    display: flex; align-items: center; gap: 8px; padding: 9px;
    border-radius: 12px; background: var(--app-primary-container); color: #164c42;
  }
  .context-icon { font-size: 18px; }
  .context-card b, .context-card small { display: block; }
  .context-card b { font-size: 8px; }
  .context-card small { margin-top: 2px; font-size: 7px; color: #476d63; }
  .context-arrow { margin-left: auto; font-size: 15px; }
  .chat-label, .list-label { margin: 15px 0 7px; color: #778780; font-size: 7px; font-weight: 700; letter-spacing: .09em; }
  .bubble { max-width: 94%; margin-bottom: 7px; padding: 8px 9px; border-radius: 12px; font-size: 8px; line-height: 1.45; }
  .user-bubble { margin-left: auto; border-bottom-right-radius: 4px; color: white; background: var(--app-primary); }
  .assistant-bubble { background: var(--app-surface); border: 1px solid var(--app-outline); border-bottom-left-radius: 4px; }
  .assistant-bubble p { margin: 0 0 5px; }
  .assistant-bubble p:last-of-type { margin-bottom: 0; }
  .source-line { display: flex; align-items: center; gap: 4px; margin-top: 7px; padding-top: 6px; border-top: 1px solid var(--app-outline); color: var(--app-primary); font-size: 7px; font-weight: 600; }
  .source-line .material-symbols-rounded { font-size: 11px; }
  .composer { display: flex; align-items: center; gap: 7px; margin-top: 9px; padding: 7px 8px; border: 1px solid var(--app-outline); border-radius: 99px; color: #819089; background: var(--app-surface); font-size: 8px; }
  .composer .material-symbols-rounded { font-size: 14px; color: var(--app-primary); }
  .composer .send { display: grid; place-items: center; width: 19px; height: 19px; margin-left: auto; border-radius: 50%; color: #fff; background: var(--app-primary); }
  .page-heading { margin-bottom: 13px; }
  .record-card { display: flex; align-items: flex-start; gap: 9px; margin-bottom: 9px; padding: 10px 9px; border: 1px solid var(--app-outline); border-radius: 13px; background: var(--app-surface); }
  .record-icon { flex: none; width: 29px; height: 29px; display: grid; place-items: center; border-radius: 9px; color: var(--app-primary); background: var(--app-primary-container); font-size: 16px; }
  .record-icon.pale { color: #815c37; background: #f8e9d8; }
  .record-main { flex: 1; min-width: 0; }
  .verified, .record-type { display: flex; align-items: center; gap: 3px; margin-bottom: 5px; color: var(--app-primary); font-size: 6.5px; font-weight: 700; letter-spacing: .07em; }
  .verified .material-symbols-rounded { font-size: 10px; }
  .record-main b, .record-main small { display: block; }
  .record-main b { font-size: 9px; }
  .record-main small { margin-top: 3px; color: var(--app-muted); font-size: 7.5px; }
  .record-chip { display: inline-block; margin-top: 7px; padding: 3px 6px; border-radius: 6px; color: #48645a; background: var(--app-surface-low); font-size: 6.5px; }
  .chevron { color: #819089; font-size: 15px; }
  .privacy-note { display: flex; align-items: center; gap: 6px; margin-top: 13px; padding: 9px; border-radius: 10px; color: #315d52; background: var(--app-primary-container); font-size: 7.5px; line-height: 1.4; }
  .privacy-note .material-symbols-rounded { font-size: 14px; }
  .scan-screen { display: flex; flex-direction: column; }
  .scan-window { position: relative; flex: 1; min-height: 155px; display: grid; place-items: center; margin: 4px 8px 10px; border-radius: 17px; background: #18332d; }
  .qr-code { width: 92px; height: 92px; padding: 6px; border-radius: 9px; background: white; }
  .qr-code svg { display: block; width: 100%; height: 100%; }
  .scan-corner { position: absolute; width: 22px; height: 22px; border-color: #9be4d1; border-style: solid; }
  .top-left { top: 15px; left: 15px; border-width: 2px 0 0 2px; border-radius: 6px 0 0; }
  .top-right { top: 15px; right: 15px; border-width: 2px 2px 0 0; border-radius: 0 6px 0 0; }
  .bottom-left { bottom: 15px; left: 15px; border-width: 0 0 2px 2px; border-radius: 0 0 0 6px; }
  .bottom-right { right: 15px; bottom: 15px; border-width: 0 2px 2px 0; border-radius: 0 0 6px; }
  .scan-hint { display: flex; align-items: center; justify-content: center; gap: 5px; margin-bottom: 10px; color: var(--app-muted); font-size: 8px; }
  .scan-hint .material-symbols-rounded { color: var(--app-primary); font-size: 14px; }
  .scan-status { display: flex; align-items: center; gap: 8px; padding: 9px; border-radius: 11px; background: var(--app-primary-container); color: #245b50; }
  .scan-status > .material-symbols-rounded { font-size: 17px; }
  .scan-status b, .scan-status small { display: block; }
  .scan-status b { font-size: 8px; }
  .scan-status small { margin-top: 2px; font-size: 7px; }
  .search-field { display: flex; align-items: center; gap: 7px; padding: 9px 10px; border: 1px solid var(--app-outline); border-radius: 99px; color: #778780; background: var(--app-surface); font-size: 8px; }
  .search-field .material-symbols-rounded { color: var(--app-primary); font-size: 14px; }
  .scan-action { display: flex; align-items: center; gap: 8px; margin-top: 9px; padding: 10px; border-radius: 12px; background: var(--app-primary-container); color: #245b50; }
  .scan-action > .material-symbols-rounded:first-child { font-size: 19px; }
  .scan-action b, .scan-action small { display: block; }
  .scan-action b { font-size: 8px; }
  .scan-action small { margin-top: 3px; color: #54776d; font-size: 7px; }
  .scan-action .action-arrow { margin-left: auto; font-size: 15px; }
  .medicine-row { display: flex; align-items: center; gap: 8px; padding: 9px 2px; border-bottom: 1px solid var(--app-outline); }
  .medicine-icon { width: 27px; height: 27px; display: grid; place-items: center; border-radius: 9px; color: var(--app-primary); background: var(--app-primary-container); font-size: 15px; }
  .medicine-main { flex: 1; min-width: 0; }
  .medicine-main b, .medicine-main small { display: block; }
  .medicine-main b { font-size: 8px; }
  .medicine-main small { margin-top: 2px; color: var(--app-muted); font-size: 7px; }
  .source-note { display: flex; align-items: center; gap: 5px; margin-top: 11px; color: var(--app-muted); font-size: 7px; }
  .source-note .material-symbols-rounded { color: var(--app-primary); font-size: 12px; }
  .bottom-nav { flex: none; height: 55px; display: flex; justify-content: space-around; align-items: center; padding: 4px 3px 6px; background: var(--app-surface); border-top: 1px solid var(--app-outline); }
  .nav-item { min-width: 44px; display: flex; flex-direction: column; align-items: center; gap: 3px; color: #75847d; }
  .nav-icon-wrap { min-width: 42px; height: 25px; display: grid; place-items: center; border-radius: 99px; transition: background 180ms ease; }
  .nav-icon-wrap .material-symbols-rounded { font-size: 17px; }
  .nav-item.active { color: #145d52; }
  .nav-item.active .nav-icon-wrap { background: #d5f1e9; }
  .nav-label { font-size: 6.5px; font-weight: 600; }
</style>
