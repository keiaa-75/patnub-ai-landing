<script>
  import { tick } from 'svelte';

  let {
    motionPaused = false,
    soundEnabled = false,
    onToggleMotion = () => {},
    onToggleSound = () => {}
  } = $props();

  let infoOpen = $state(false);
  let githubOpen = $state(false);

  let infoButton;
  let closeButton;
  let dialogElement;

  const team = [
    {
      name: 'Marlon Isaguirre',
      username: 'SussyMarlony',
      url: 'https://github.com/SussyMarlony',
      role: 'Project Lead'
    },
    {
      name: 'Julian Macato',
      username: 'fancybaby404',
      url: 'https://github.com/fancybaby404',
      role: 'Full-Stack Developer'
    },
    {
      name: 'Ravin Aguelo',
      username: 'RavinEduard',
      url: 'https://github.com/RavinEduard',
      role: 'Runtime Engineer'
    },
    {
      name: 'Jill Abarte',
      username: 'keiaa-75',
      url: 'https://github.com/keiaa-75',
      role: 'Backend Developer'
    }
  ];

  async function openInfo() {
    githubOpen = false;
    infoOpen = true;

    await tick();

    closeButton?.focus();
  }

  async function closeInfo() {
    infoOpen = false;

    await tick();

    infoButton?.focus();
  }

  function toggleGithub() {
    githubOpen = !githubOpen;
    infoOpen = false;
  }

  function handleDialogKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeInfo();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = [
      ...(dialogElement?.querySelectorAll(
        'a[href], button:not([disabled])'
      ) || [])
    ];

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  }
</script>

<!-- Floating control dock -->
<div class="control-dock" role="toolbar" aria-label="Page controls">

  <button
    class="control"
    class:active={motionPaused}
    type="button"
    aria-label={motionPaused ? 'Resume animations' : 'Pause animations'}
    aria-pressed={motionPaused}
    title={motionPaused ? 'Resume animations' : 'Pause animations'}
    onclick={onToggleMotion}
  >
    <span class="material-symbols-rounded" aria-hidden="true">
      {motionPaused ? 'play_arrow' : 'pause'}
    </span>
  </button>

  <button
    class="control"
    class:active={soundEnabled}
    type="button"
    aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
    aria-pressed={soundEnabled}
    title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
    onclick={onToggleSound}
  >
    <span class="material-symbols-rounded" aria-hidden="true">
      {soundEnabled ? 'volume_up' : 'volume_off'}
    </span>
  </button>

  <button
    bind:this={infoButton}
    class="control"
    type="button"
    aria-label="Medical disclaimer and credits"
    aria-haspopup="dialog"
    title="Disclaimer and credits"
    onclick={openInfo}
  >
    <span class="material-symbols-rounded" aria-hidden="true">
      info
    </span>
  </button>

  <button
    class="control github-control"
    class:active={githubOpen}
    type="button"
    aria-label="View the team on GitHub"
    aria-expanded={githubOpen}
    title="GitHub profiles"
    onclick={toggleGithub}
  >
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-1.97c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.77 1.06.77 2.14v3.17c0 .31.21.67.8.56C20.22 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  </button>

</div>

<!-- GitHub team panel -->
{#if githubOpen}
  <section class="github-panel" aria-label="Team GitHub profiles">
    <header class="panel-heading">
      <div>
        <span class="panel-eyebrow">THE PEOPLE BEHIND PATNUB.AI</span>
        <h2>Find us on GitHub.</h2>
      </div>

      <button
        class="panel-close"
        type="button"
        aria-label="Close GitHub panel"
        onclick={() => githubOpen = false}
      >
        <span class="material-symbols-rounded">close</span>
      </button>
    </header>

    <div class="github-team">
      {#each team as member}
        <a
          class="github-member"
          href={member.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="github-member-copy">
            <b>{member.name}</b>
            <span>{member.role}</span>
          </div>

          <span class="github-username">@{member.username}</span>

          <span class="material-symbols-rounded">open_in_new</span>
        </a>
      {/each}
    </div>
  </section>
{/if}

<!-- Disclaimer modal -->
{#if infoOpen}
  <div class="modal-layer">

    <button
      class="modal-backdrop"
      type="button"
      tabindex="-1"
      aria-label="Close information dialog"
      onclick={closeInfo}
    ></button>

    <section
      class="info-dialog"
      bind:this={dialogElement}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-title"
      aria-describedby="info-intro"
      tabindex="-1"
      onkeydown={handleDialogKeydown}
    >
      <header class="dialog-header">
        <div>
          <span class="dialog-eyebrow">PATNUB.AI · INFORMATION</span>
          <h2 id="info-title">A note about your health.</h2>
        </div>

        <button
          bind:this={closeButton}
          class="panel-close"
          type="button"
          aria-label="Close dialog"
          onclick={closeInfo}
        >
          <span class="material-symbols-rounded">close</span>
        </button>
      </header>

      <div class="dialog-content">

        <!-- What it is -->
        <section class="info-section">
          <h3>What is patnub.ai?</h3>

          <p id="info-intro">
            patnub.ai is a health-information companion designed
            to help people understand, organize, and revisit
            health information and clinician-approved instructions.
            It uses AI and external health references to present
            information in more understandable language.
          </p>
        </section>

        <!-- Limitations -->
        <section class="info-section">
          <h3>What it is not</h3>

          <p>
            patnub.ai is not a doctor, healthcare provider,
            diagnostic tool, or emergency service. It is not a
            substitute for professional medical advice,
            diagnosis, or treatment.
          </p>

          <p>
            AI-generated information may be incomplete, outdated,
            or inaccurate. Do not use it as the sole basis for
            diagnosing a condition, choosing a treatment, or
            changing medication. Consult a qualified healthcare
            professional about decisions concerning your health.
          </p>
        </section>

        <!-- Emergency guidance -->
        <section class="urgent-notice">
          <div class="urgent-heading">
            <span class="material-symbols-rounded">emergency</span>
            <h3>For immediate or severe cases</h3>
          </div>

          <p>
            Do not wait for an application response when you
            experience severe or potentially life-threatening
            symptoms, such as difficulty breathing, chest pain,
            severe bleeding, loss of consciousness, or possible
            signs of stroke.
          </p>

          <p>
            Seek immediate medical attention at the nearest
            emergency department. In the Philippines, call
            the National Emergency Hotline. Outside the Philippines,
            contact your local emergency service.
          </p>

          <a class="emergency-link" href="tel:911">
            <span class="material-symbols-rounded">call</span>
            Call 911
          </a>

          <a
            class="text-link emergency-source"
            href="https://ehotlines.e.gov.ph/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official Philippine emergency hotline directory
            <span class="material-symbols-rounded">open_in_new</span>
          </a>
        </section>

        <!-- AI model -->
        <section class="info-section">
          <span class="section-label">AI MODEL</span>

          <h3>
            <a
              class="inline-link"
              href="https://developers.google.com/health-ai-developer-foundations/medgemma/model-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              MedGemma
              <span class="material-symbols-rounded">open_in_new</span>
            </a>
          </h3>

          <p>
            MedGemma is a medical-domain AI model from Google.
            It is a development model, not a medical reference
            database or a replacement for a clinician. Its outputs
            are preliminary and require independent verification
            and clinical correlation.
          </p>
        </section>

        <!-- Medical information sources -->
        <section class="info-section">
          <span class="section-label">MEDICAL INFORMATION REFERENCES</span>

          <div class="source-list">

            <a
              class="source-item"
              href="https://open.fda.gov/apis/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="source-copy">
                <b>openFDA</b>
                <span>
                  Public U.S. FDA datasets about drugs, devices,
                  foods, recalls, and regulatory information.
                  Not all records are validated for clinical use.
                </span>
              </span>

              <span class="material-symbols-rounded">open_in_new</span>
            </a>

            <a
              class="source-item"
              href="https://odphp.health.gov/myhealthfinder"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="source-copy">
                <b>MyHealthfinder</b>
                <span>
                  Evidence-based consumer health information from
                  the U.S. Department of Health and Human Services.
                </span>
              </span>

              <span class="material-symbols-rounded">open_in_new</span>
            </a>

            <a
              class="source-item"
              href="https://developer.cdc.gov/apis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="source-copy">
                <b>CDC APIs</b>
                <span>
                  API catalog and public-health data services
                  from the U.S. Centers for Disease Control and Prevention.
                </span>
              </span>

              <span class="material-symbols-rounded">open_in_new</span>
            </a>

            <a
              class="source-item"
              href="https://verification.fda.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="source-copy">
                <b>Philippine FDA Verification Portal</b>
                <span>
                  A local resource for checking registered health
                  products and licensed establishments in the Philippines.
                </span>
              </span>

              <span class="material-symbols-rounded">open_in_new</span>
            </a>

          </div>

          <p class="source-footnote">
            These references have different purposes. MedGemma
            is an AI model, while the others provide information,
            datasets, or regulatory verification. Listing a source
            does not mean that every generated answer uses or has
            been independently validated against every reference.
          </p>

          <p class="source-footnote">
            Some references are U.S.-based and may not reflect
            Philippine regulatory decisions or local clinical guidance.
          </p>

          <div class="myhealthfinder-credit">
            <a
              href="https://odphp.health.gov/myhealthfinder"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MyHealthfinder, official source"
            >
              <img
                src="https://odphp.health.gov/themes/custom/healthfinder/images/MyHF.svg"
                alt="MyHealthfinder"
              />
            </a>

            <a
              class="inline-link"
              href="https://odphp.health.gov/our-work/national-health-initiatives/health-literacy/consumer-health-content/free-web-content/apis-developers/terms-use"
              target="_blank"
              rel="noopener noreferrer"
            >
              MyHealthfinder API terms of use
              <span class="material-symbols-rounded">open_in_new</span>
            </a>
          </div>

          <p class="source-footnote">
            When MyHealthfinder API content is displayed, its terms
            require source attribution, the supplied logo and link,
            preservation of the original content, and its last-updated
            date alongside the content.
          </p>
        </section>

        <!-- 3D model -->
        <section class="info-section">
          <span class="section-label">3D MODEL ATTRIBUTION</span>

          <h3>Samsung Galaxy S24 Ultra</h3>

          <p>
            3D model by <b>Sketcher</b>, sourced from
            <a
              class="inline-link"
              href="https://sketchfab.com/3d-models/samsung-s24-ultra-b05e35cc5fa540cba52e055b378c28bd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sketchfab
              <span class="material-symbols-rounded">open_in_new</span>
            </a>.
          </p>

          <p>
            Licensed under
            <a
              class="inline-link"
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creative Commons Attribution 4.0 International (CC BY 4.0)
            </a>.
          </p>

          <p>
            Modified for patnub.ai presentation, including
            screen overlays, positioning, lighting, and animation.
          </p>
        </section>

        <!-- Trademark -->
        <section class="info-section legal-note">
          <h3>Trademark notice</h3>

          <p>
            Samsung, Galaxy, and Samsung Galaxy S24 Ultra are
            trademarks of Samsung Electronics Co., Ltd. The
            device model is used for illustrative purposes.
            patnub.ai is independently developed and is not
            affiliated with, sponsored by, or endorsed by Samsung.
          </p>
        </section>

      </div>

      <footer class="dialog-footer">
        <span>patnub.ai</span>
        <span>Care that stays with you.</span>
      </footer>
    </section>
  </div>
{/if}

<style>
  :global(.control-dock),
  :global(.github-panel),
  :global(.modal-layer) {
    font-family: var(--font-body);
  }

  /* Floating dock */

  .control-dock {
    position: fixed;

    right: clamp(18px, 3vw, 38px);

    bottom: max(
      20px,
      calc(env(safe-area-inset-bottom) + 14px)
    );

    z-index: 100;

    display: flex;
    align-items: center;

    gap: 7px;

    padding: 7px;

    border: 1px solid rgba(209, 221, 215, 0.9);
    border-radius: 23px;

    background: rgba(249, 252, 250, 0.92);

    box-shadow:
      0 8px 28px rgba(27, 58, 49, 0.11),
      0 1px 3px rgba(27, 58, 49, 0.05);

    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .control {
    width: 43px;
    height: 43px;

    flex: none;

    display: grid;
    place-items: center;

    padding: 0;

    border: 0;
    border-radius: 16px;

    background: transparent;
    color: #52645e;

    cursor: pointer;

    transition:
      background 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }

  .control:hover {
    background: #e8f2ed;
    color: #0b796b;

    transform: translateY(-2px);
  }

  .control:active {
    transform: scale(0.94);
  }

  .control.active {
    background: #d5f1e9;
    color: #0b796b;
  }

  .control .material-symbols-rounded {
    font-size: 21px;
  }

  .github-control svg {
    display: block;
  }

  .control:focus-visible,
  .panel-close:focus-visible,
  .github-member:focus-visible,
  .info-dialog a:focus-visible {
    outline: 3px solid #0e8f7e;
    outline-offset: 3px;
  }

  /* GitHub panel */

  .github-panel {
    position: fixed;

    right: clamp(18px, 3vw, 38px);

    bottom: calc(
      max(20px, env(safe-area-inset-bottom)) + 76px
    );

    z-index: 101;

    width: min(350px, calc(100vw - 36px));

    padding: 19px;

    border: 1px solid #d1ddd7;
    border-radius: 25px;

    background: #fbfdfa;
    color: #17231f;

    box-shadow: 0 18px 55px rgba(27, 58, 49, 0.16);

    animation: panel-in 220ms cubic-bezier(.2,.8,.2,1) both;
  }

  .panel-heading,
  .dialog-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 16px;
  }

  .panel-eyebrow,
  .dialog-eyebrow {
    color: #0e8f7e;

    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.11em;
  }

  .panel-heading h2,
  .dialog-header h2 {
    margin: 5px 0 0;

    color: #17231f;

    font-family: var(--font-display);

    font-size: 23px;
    font-weight: 600;

    letter-spacing: -0.04em;
    line-height: 1.1;
  }

  .panel-close {
    flex: none;

    width: 34px;
    height: 34px;

    display: grid;
    place-items: center;

    border: 0;
    border-radius: 50%;

    background: #edf4f0;
    color: #52645e;

    cursor: pointer;

    transition:
      background 160ms ease,
      color 160ms ease;
  }

  .panel-close:hover {
    background: #d5f1e9;
    color: #0b796b;
  }

  .panel-close .material-symbols-rounded {
    font-size: 19px;
  }

  .github-team {
    display: grid;
    gap: 4px;

    margin-top: 16px;
  }

  .github-member {
    display: grid;

    grid-template-columns: minmax(0, 1fr) auto 16px;

    align-items: center;
    gap: 10px;

    padding: 11px 9px;

    border-radius: 13px;

    color: inherit;
    text-decoration: none;

    transition: background 160ms ease;
  }

  .github-member:hover {
    background: #edf5f0;
  }

  .github-member-copy {
    min-width: 0;

    display: grid;
    gap: 3px;
  }

  .github-member-copy b {
    font-size: 12px;
    font-weight: 700;
  }

  .github-member-copy span,
  .github-username {
    color: #71827a;
    font-size: 10px;
  }

  .github-username {
    white-space: nowrap;
  }

  .github-member > .material-symbols-rounded {
    color: #0e8f7e;
    font-size: 16px;
  }

  /* Modal */

  .modal-layer {
    position: fixed;
    inset: 0;

    z-index: 1000;

    display: grid;
    place-items: center;

    padding:
      max(18px, env(safe-area-inset-top))
      max(16px, env(safe-area-inset-right))
      max(18px, env(safe-area-inset-bottom))
      max(16px, env(safe-area-inset-left));
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    border: 0;

    background: rgba(12, 30, 24, 0.48);

    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);

    cursor: default;
  }

  .info-dialog {
    position: relative;
    z-index: 1;

    width: min(660px, 100%);
    max-height: min(86dvh, 850px);

    display: flex;
    flex-direction: column;

    overflow: hidden;

    border: 1px solid #d1ddd7;
    border-radius: 28px;

    background: #fbfdfa;
    color: #17231f;

    box-shadow: 0 30px 90px rgba(8, 30, 24, 0.28);

    animation: dialog-in 260ms cubic-bezier(.2,.8,.2,1) both;
  }

  .dialog-header {
    flex: none;
    align-items: center;

    padding: 23px 25px 20px;

    border-bottom: 1px solid #e2ebe5;

    background: #f9fcfa;
  }

  .dialog-header h2 {
    font-size: clamp(23px, 4vw, 30px);
  }

  .dialog-content {
    min-height: 0;

    overflow-y: auto;
    overscroll-behavior: contain;

    padding: 22px 25px 26px;
  }

  .info-section {
    display: grid;
    gap: 9px;

    margin-bottom: 25px;
  }

  .info-section:last-child {
    margin-bottom: 0;
  }

  .info-section h3 {
    margin: 0;

    color: #1b3028;

    font-size: 15px;
    font-weight: 700;
  }

  .info-section p {
    margin: 0;

    color: #52645e;

    font-size: 12px;
    line-height: 1.75;
  }

  .section-label {
    color: #0e8f7e;

    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.13em;
  }

  /* Emergency notice */

  .urgent-notice {
    display: grid;
    gap: 11px;

    margin: 25px 0;

    padding: 18px;

    border: 1px solid #f0d8c7;
    border-radius: 19px;

    background: #fff5ed;
  }

  .urgent-heading {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .urgent-heading .material-symbols-rounded {
    color: #ad4c2b;
    font-size: 22px;
  }

  .urgent-heading h3 {
    margin: 0;

    color: #763b28;
    font-size: 14px;
    font-weight: 700;
  }

  .urgent-notice p {
    margin: 0;

    color: #6c5145;

    font-size: 12px;
    line-height: 1.65;
  }

  .emergency-link {
    width: fit-content;

    display: inline-flex;
    align-items: center;
    gap: 7px;

    padding: 9px 14px;

    border-radius: 999px;

    background: #a84127;
    color: #ffffff;

    font-size: 12px;
    font-weight: 700;

    text-decoration: none;
  }

  .emergency-link .material-symbols-rounded {
    font-size: 16px;
  }

  .emergency-source {
    width: fit-content;

    color: #8a513a;
    font-size: 10px;
  }

  /* Links */

  .inline-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    color: #087d6e;

    font-weight: 700;
    text-decoration: none;
  }

  .inline-link:hover {
    text-decoration: underline;
  }

  .inline-link .material-symbols-rounded {
    font-size: 13px;
  }

  /* Source list */

  .source-list {
    display: grid;
    gap: 5px;
  }

  .source-item {
    display: grid;

    grid-template-columns: minmax(0, 1fr) 18px;

    align-items: center;
    gap: 12px;

    padding: 12px;

    border: 1px solid #e0e9e3;
    border-radius: 14px;

    background: #ffffff;

    color: inherit;
    text-decoration: none;

    transition:
      background 160ms ease,
      border-color 160ms ease;
  }

  .source-item:hover {
    border-color: #b3d9ca;
    background: #f1f8f4;
  }

  .source-copy {
    display: grid;
    gap: 4px;
  }

  .source-copy b {
    color: #1b3028;
    font-size: 12px;
  }

  .source-copy span {
    color: #62736b;

    font-size: 11px;
    line-height: 1.5;
  }

  .source-item > .material-symbols-rounded {
    color: #0e8f7e;
    font-size: 16px;
  }

  .info-section .source-footnote {
    margin-top: 7px;

    color: #788780;

    font-size: 10px;
    line-height: 1.6;
  }

  .myhealthfinder-credit {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    gap: 12px;

    margin-top: 8px;
    padding: 10px;

    border: 1px solid #e0e9e3;
    border-radius: 12px;

    background: #ffffff;
  }

  .myhealthfinder-credit img {
    display: block;

    width: 132px;
    max-height: 34px;

    object-fit: contain;
  }

  .legal-note {
    padding-top: 19px;

    border-top: 1px solid #e0e9e3;
  }

  /* Footer */

  .dialog-footer {
    flex: none;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 12px;

    padding: 14px 25px;

    border-top: 1px solid #e2ebe5;

    color: #7b8b83;

    font-size: 10px;
  }

  .dialog-footer span:first-child {
    color: #0e8f7e;
    font-weight: 700;
  }

  @keyframes panel-in {
    from {
      opacity: 0;
      transform: translateY(9px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes dialog-in {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.985);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 560px) {
    .control-dock {
      right: 14px;

      bottom: max(
        15px,
        calc(env(safe-area-inset-bottom) + 10px)
      );

      gap: 3px;
      padding: 5px;

      border-radius: 19px;
    }

    .control {
      width: 39px;
      height: 39px;

      border-radius: 14px;
    }

    .control .material-symbols-rounded {
      font-size: 19px;
    }

    .github-control svg {
      width: 19px;
      height: 19px;
    }

    .github-panel {
      right: 14px;

      bottom: calc(
        max(15px, env(safe-area-inset-bottom)) + 66px
      );

      padding: 16px;

      border-radius: 21px;
    }

    .info-dialog {
      max-height: 88dvh;
      border-radius: 23px;
    }

    .dialog-header {
      padding: 18px 17px 16px;
    }

    .dialog-content {
      padding: 17px;
    }

    .dialog-footer {
      padding: 12px 17px;
    }

    .github-member {
      grid-template-columns: minmax(0, 1fr) auto 16px;
      gap: 7px;
    }

    .github-username {
      font-size: 9px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .control,
    .panel-close,
    .github-member,
    .source-item {
      transition: none;
    }

    .github-panel,
    .info-dialog {
      animation: none;
    }
  }
</style>