<!--
  Chat: the Assistant tab mid-conversation (the "Ask in plain language" beat).

  The empty welcome state lives in AssistantScreen.svelte and belongs to the
  "Say hi" beat. Both keep the Assistant tab active in the bottom navigation.

  Reference: the real app's chat view. All coordinates are in canvas units
  (1u = 1px of the 945px-wide texture) measured from the top of the screen
  area, which starts under the app header (254u) and ends above the system
  navigation (112u). The bottom navigation pill floats over this area.
-->
<div class="chat-screen">
  <div class="thread">
    <div class="bubble user">I’ve had a headache for two days and feel dizzy when I stand up</div>

    <article class="bubble answer">
      <p class="answer-text">It sounds like you are feeling unsteady. This can be caused by many things, like dehydration or low blood pressure. Try to sit down slowly when you stand up. If the dizziness is severe or doesn’t go away, please see a health center right away.</p>

      <div class="sources">
        <span class="source">MedlinePlus: Dizziness and Vertigo</span>
        <span class="source">MedlinePlus: Headache</span>
      </div>

      <p class="fine first">For health information only; not a diagnosis.</p>
      <p class="fine">Reference text comes from MedlinePlus and has not been reviewed by a clinician.</p>
    </article>
  </div>

  <div class="tools">
    <div class="live-info">
      <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><path d="M3 16h26M16 3c4 4 6 8 6 13s-2 9-6 13c-4-4-6-8-6-13s2-9 6-13Z"/></svg>
      <span>Live info</span>
      <span class="switch" aria-hidden="true"><i></i></span>
    </div>
    <span class="clear">Clear chat</span>
  </div>

  <div class="composer">
    <span class="plus">+</span>
    <span class="placeholder">Ask a health question</span>
    <span class="send"><svg viewBox="0 0 32 32"><path d="M16 26V6M7 15l9-9 9 9"/></svg></span>
  </div>
</div>

<style>
  .chat-screen { position:absolute; inset:calc(254 * var(--u)) 0 calc(112 * var(--u)); color:#111819; font-family:inherit; }

  /* Scrolling message area. It ends in a hard cut, exactly like the app. */
  .thread { position:absolute; top:0; left:0; right:0; height:calc(1137 * var(--u)); overflow:hidden; display:flex; flex-direction:column; gap:calc(32 * var(--u)); padding:calc(42 * var(--u)) calc(42 * var(--u)) 0; }

  .bubble.user { align-self:flex-end; flex:none; width:calc(788 * var(--u)); padding:calc(26 * var(--u)) calc(38 * var(--u)); border-radius:calc(62 * var(--u)) calc(62 * var(--u)) calc(18 * var(--u)) calc(62 * var(--u)); background:#1b7a77; color:#fff; font-size:calc(45 * var(--u)); line-height:calc(63 * var(--u)); letter-spacing:calc(.9 * var(--u)); }

  .bubble.answer { flex:none; padding:calc(42 * var(--u)) calc(43 * var(--u)) calc(40 * var(--u)); border:1px solid #e3e9ea; border-radius:calc(42 * var(--u)); background:#fff; }
  .answer-text { margin:0 0 calc(22 * var(--u)); font-size:calc(45 * var(--u)); line-height:calc(63 * var(--u)); letter-spacing:calc(.8 * var(--u)); }

  .sources { display:flex; flex-direction:column; align-items:flex-start; gap:calc(44 * var(--u)); padding-top:calc(45 * var(--u)); border-top:calc(2 * var(--u)) solid #e1e8e9; }
  .source { display:inline-flex; align-items:center; height:calc(80 * var(--u)); padding:0 calc(46 * var(--u)); border:calc(2 * var(--u)) solid #dfe6e7; border-radius:99px; color:#5d6a6b; font-size:calc(36 * var(--u)); font-weight:400; letter-spacing:calc(.75 * var(--u)); white-space:nowrap; }

  .fine { margin:calc(20 * var(--u)) 0 0; color:#5d6a6b; font-size:calc(31 * var(--u)); line-height:calc(40 * var(--u)); font-weight:400; letter-spacing:calc(.7 * var(--u)); }
  .fine.first { margin-top:calc(42 * var(--u)); }

  /* Live info (off) and Clear chat */
  .tools { position:absolute; top:calc(1171 * var(--u)); left:calc(38 * var(--u)); right:calc(70 * var(--u)); height:calc(70 * var(--u)); display:flex; align-items:center; justify-content:space-between; }
  .live-info { width:calc(330 * var(--u)); height:100%; display:flex; align-items:center; gap:calc(18 * var(--u)); padding:0 calc(14 * var(--u)) 0 calc(28 * var(--u)); border:calc(1.5 * var(--u)) solid #dfe6e7; border-radius:99px; background:#fff; color:#1b2525; }
  .live-info > svg { flex:none; width:calc(36 * var(--u)); height:calc(36 * var(--u)); fill:none; stroke:#4f5f5f; stroke-width:2.2; }
  .live-info > span:nth-child(2) { font-size:calc(32 * var(--u)); font-weight:400; letter-spacing:calc(.8 * var(--u)); white-space:nowrap; }
  .switch { width:calc(72 * var(--u)); height:calc(42 * var(--u)); margin-left:auto; display:flex; align-items:center; padding:calc(4 * var(--u)); border:calc(2 * var(--u)) solid #c9d3d3; border-radius:99px; background:#eef2f3; }
  .switch i { width:calc(30 * var(--u)); height:calc(30 * var(--u)); border-radius:50%; background:#fff; box-shadow:0 calc(1 * var(--u)) calc(3 * var(--u)) rgba(20,40,40,.35); }
  .clear { color:#247d7b; font-size:calc(36 * var(--u)); font-weight:400; letter-spacing:calc(1 * var(--u)); white-space:nowrap; }

  /* Composer */
  .composer { position:absolute; top:calc(1289 * var(--u)); left:calc(30 * var(--u)); right:calc(30 * var(--u)); height:calc(154 * var(--u)); display:flex; align-items:center; gap:calc(30 * var(--u)); padding:0 calc(33 * var(--u)) 0 calc(62 * var(--u)); border:1px solid #e1e6e7; border-radius:99px; background:#fff; box-shadow:0 calc(3 * var(--u)) calc(6 * var(--u)) rgba(28,47,47,.20); }
  .plus { flex:none; width:calc(42 * var(--u)); text-align:center; color:#207e7b; font-family:Arial,sans-serif; font-size:calc(62 * var(--u)); font-weight:300; line-height:1; }
  .placeholder { flex:1; margin-left:calc(41 * var(--u)); color:#6b7777; font-size:calc(44 * var(--u)); letter-spacing:calc(.8 * var(--u)); white-space:nowrap; text-align:left; }
  .send { flex:none; display:grid; place-items:center; width:calc(95 * var(--u)); height:calc(95 * var(--u)); border-radius:50%; background:#e4ebeb; }
  .send svg { width:calc(48 * var(--u)); height:calc(48 * var(--u)); fill:none; stroke:#667272; stroke-width:2.6; stroke-linecap:round; stroke-linejoin:round; }
</style>
