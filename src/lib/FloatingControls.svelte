<script>
  import { onDestroy, tick } from 'svelte';
  import { acquireScrollLock } from './scrollLock.js';

  let infoOpen = $state(false);
  let githubOpen = $state(false);
  let activeControl = $state(0);

  let infoButton;
  let githubButton;
  let closeButton = $state(null);
  let dialogElement = $state(null);
  let releaseModalScrollLock = null;

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

  function releaseInfoLock() {
    releaseModalScrollLock?.();
    releaseModalScrollLock = null;
  }

  async function openInfo() {
    githubOpen = false;
    infoOpen = true;
    releaseModalScrollLock ??= acquireScrollLock();

    await tick();

    closeButton?.focus();
  }

  async function closeInfo() {
    if (!infoOpen) return;

    infoOpen = false;
    releaseInfoLock();

    await tick();

    infoButton?.focus();
  }

  function closeGithub(restoreFocus = false) {
    if (!githubOpen) return;

    githubOpen = false;

    if (restoreFocus) {
      tick().then(() => githubButton?.focus());
    }
  }

  function toggleGithub() {
    if (githubOpen) {
      closeGithub(true);
      return;
    }

    githubOpen = true;
  }

  function handleToolbarKeydown(event) {
    const buttons = [
      ...event.currentTarget.querySelectorAll('.control:not(:disabled)')
    ];

    if (!buttons.length) return;

    const currentIndex = buttons.indexOf(event.target);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % buttons.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = buttons.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    const target = buttons[nextIndex];
    activeControl = Number(target.dataset.controlIndex);
    target.focus();
  }

  function handleDialogKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
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

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleWindowKeydown(event) {
    if (event.key === 'Escape' && githubOpen && !infoOpen) {
      event.preventDefault();
      closeGithub(true);
    }
  }

  function handleWindowPointerDown(event) {
    if (!githubOpen || !(event.target instanceof Element)) return;

    if (event.target.closest('.github-panel, .github-control')) return;

    closeGithub();
  }

  onDestroy(() => {
    releaseInfoLock();
  });
</script>

<svelte:window
  onkeydown={handleWindowKeydown}
  onpointerdown={handleWindowPointerDown}
/>

<!-- Floating control dock -->
<div
  class="control-dock"
  role="toolbar"
  aria-label="Page controls"
  aria-orientation="horizontal"
  tabindex="-1"
  onkeydown={handleToolbarKeydown}
>
  <button
    bind:this={infoButton}
    class="control"
    type="button"
    data-control-index="0"
    tabindex={activeControl === 0 ? 0 : -1}
    aria-label="Medical disclaimer and credits"
    aria-haspopup="dialog"
    aria-controls="medical-disclaimer-dialog"
    title="Medical disclaimer"
    onfocus={() => activeControl = 0}
    onclick={openInfo}
  >
    <span class="material-symbols-rounded" aria-hidden="true">info</span>
  </button>

  <button
    bind:this={githubButton}
    class="control github-control"
    class:active={githubOpen}
    type="button"
    data-control-index="1"
    tabindex={activeControl === 1 ? 0 : -1}
    aria-label="View the team on GitHub"
    aria-expanded={githubOpen}
    aria-controls="github-team-panel"
    title="GitHub profiles"
    onfocus={() => activeControl = 1}
    onclick={toggleGithub}
  >
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
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
  <section
    id="github-team-panel"
    class="github-panel"
    aria-labelledby="github-panel-title"
  >
    <header class="panel-heading">
      <h2 id="github-panel-title">Meet the team</h2>

      <button
        class="panel-close"
        type="button"
        aria-label="Close GitHub panel"
        onclick={() => closeGithub(true)}
      >
        <span class="material-symbols-rounded" aria-hidden="true">close</span>
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
          <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
        </a>
      {/each}
    </div>
  </section>
{/if}

<!-- Medical disclaimer dialog -->
{#if infoOpen}
  <div class="modal-layer">
    <button
      class="modal-backdrop"
      type="button"
      tabindex="-1"
      aria-label="Close medical disclaimer"
      onclick={closeInfo}
    ></button>

    <div
      id="medical-disclaimer-dialog"
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
        <h2 id="info-title">Medical disclaimer</h2>

        <button
          bind:this={closeButton}
          class="panel-close"
          type="button"
          aria-label="Close dialog"
          onclick={closeInfo}
        >
          <span class="material-symbols-rounded" aria-hidden="true">close</span>
        </button>
      </header>

      <div class="dialog-content">
        <section class="info-section disclaimer-copy">
          <p id="info-intro">
            patnub.ai helps people understand, organize, and revisit health
            information and clinician-approved instructions. It uses AI and
            external references to explain information in plainer language.
          </p>

          <p>
            patnub.ai is not a healthcare provider, diagnostic tool, or
            emergency service. AI-generated information may be incomplete,
            outdated, or inaccurate. Do not rely on it alone to diagnose a
            condition, choose treatment, or change medication. Consult a
            qualified healthcare professional about your care.
          </p>
        </section>

        <section class="urgent-notice" aria-labelledby="emergency-title">
          <div class="urgent-heading">
            <span class="material-symbols-rounded" aria-hidden="true">emergency</span>
            <h3 id="emergency-title">Medical emergencies</h3>
          </div>

          <p>
            Do not wait for an application response for severe or potentially
            life-threatening symptoms, including difficulty breathing, chest
            pain, severe bleeding, loss of consciousness, or possible signs
            of stroke. Seek immediate medical attention.
          </p>

          <div class="emergency-actions">
            <a class="emergency-link" href="tel:911">
              <span class="material-symbols-rounded" aria-hidden="true">call</span>
              Call 911 in the Philippines
            </a>

            <a
              class="text-link emergency-source"
              href="https://ehotlines.e.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official emergency hotline directory
            </a>
          </div>
        </section>

        <section class="info-section">
          <h3>Information sources</h3>
          <p class="section-intro">
            These resources serve different purposes. Listing a source does
            not mean every generated answer has been independently validated
            against it.
          </p>

          <div class="source-list">
            <a
              class="source-item"
              href="https://developers.google.com/health-ai-developer-foundations/medgemma/model-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="source-copy">
                <b>MedGemma</b>
                <span>Google's medical-domain AI model; not a medical reference database or a substitute for clinical review.</span>
              </span>
              <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
            </a>

            <a
              class="source-item"
              href="https://open.fda.gov/apis/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="source-copy">
                <b>openFDA</b>
                <span>Public U.S. FDA datasets covering drugs, devices, foods, recalls, and regulatory information.</span>
              </span>
              <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
            </a>

            <a
              class="source-item"
              href="https://odphp.health.gov/myhealthfinder"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="source-copy">
                <b>MyHealthfinder</b>
                <span>Consumer health information from the U.S. Department of Health and Human Services.</span>
              </span>
              <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
            </a>

            <a
              class="source-item"
              href="https://developer.cdc.gov/apis"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="source-copy">
                <b>CDC APIs</b>
                <span>Public-health data services from the U.S. Centers for Disease Control and Prevention.</span>
              </span>
              <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
            </a>

            <a
              class="source-item"
              href="https://verification.fda.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="source-copy">
                <b>Philippine FDA Verification Portal</b>
                <span>Check registered health products and licensed establishments in the Philippines.</span>
              </span>
              <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
            </a>
          </div>

          <div class="myhealthfinder-credit">
            <a
              href="https://odphp.health.gov/myhealthfinder"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MyHealthfinder official website"
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
              MyHealthfinder API terms
              <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
            </a>
          </div>

          <p class="source-footnote">
            When MyHealthfinder API content is displayed, its terms require
            source attribution, the supplied logo and link, preservation of
            the original content, and its last-updated date alongside it.
          </p>

          <p class="source-footnote">
            Some listed references are U.S.-based and may not reflect
            Philippine regulatory decisions or local clinical guidance.
          </p>
        </section>

        <section class="info-section legal-note">
          <h3>Credits and trademarks</h3>

          <p>
            The Samsung Galaxy S24 Ultra 3D model is by <b>Sketcher</b>,
            sourced from
            <a
              class="inline-link"
              href="https://sketchfab.com/3d-models/samsung-s24-ultra-b05e35cc5fa540cba52e055b378c28bd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sketchfab
              <span class="material-symbols-rounded" aria-hidden="true">open_in_new</span>
            </a>, and licensed under
            <a
              class="inline-link"
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>. It has been modified for this presentation.
          </p>

          <p>
            Samsung, Galaxy, and Samsung Galaxy S24 Ultra are trademarks of
            Samsung Electronics Co., Ltd. The device is illustrative only.
            patnub.ai is independently developed and is not affiliated with,
            sponsored by, or endorsed by Samsung.
          </p>
        </section>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.control-dock),
  :global(.github-panel),
  :global(.modal-layer) {
    font-family: var(--font-body);
  }

  /* Floating toolbar */

  .control-dock {
    position: fixed;
    right: clamp(18px, 3vw, 38px);
    bottom: max(20px, calc(env(safe-area-inset-bottom) + 14px));
    z-index: 100;

    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px;

    border: 1px solid rgba(209, 221, 215, 0.92);
    border-radius: 27px;
    background: rgba(245, 250, 248, 0.94);
    box-shadow:
      0 8px 28px rgba(27, 58, 49, 0.11),
      0 1px 3px rgba(27, 58, 49, 0.05);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .control {
    width: 48px;
    height: 48px;
    flex: none;

    display: grid;
    place-items: center;
    padding: 0;

    border: 0;
    border-radius: 18px;
    background: transparent;
    color: var(--md-on-surface-variant);
    cursor: pointer;

    transition:
      background-color 180ms ease,
      color 180ms ease,
      transform 180ms ease;
  }

  .control:hover:not(:disabled) {
    background: var(--md-surface-container-high);
    color: var(--md-primary-strong);
  }

  .control:active:not(:disabled) {
    transform: scale(0.94);
  }

  .control.active {
    background: var(--md-primary-container);
    color: var(--md-on-primary-container);
  }

  .control:disabled {
    cursor: not-allowed;
    opacity: 0.42;
  }

  .control .material-symbols-rounded {
    font-size: 24px;
  }

  .github-control svg {
    display: block;
  }

  .control:focus-visible,
  .panel-close:focus-visible,
  .github-member:focus-visible,
  .info-dialog a:focus-visible {
    outline: 3px solid var(--md-primary);
    outline-offset: 3px;
  }

  /* GitHub team surface */

  .github-panel {
    position: fixed;
    right: clamp(18px, 3vw, 38px);
    bottom: calc(max(20px, env(safe-area-inset-bottom)) + 82px);
    z-index: 101;

    width: min(360px, calc(100vw - 36px));
    padding: 20px;

    border: 1px solid var(--md-outline-variant);
    border-radius: 26px;
    background: var(--md-surface);
    color: var(--md-on-surface);
    box-shadow: 0 18px 55px rgba(27, 58, 49, 0.16);

    animation: panel-in 220ms cubic-bezier(.2, .8, .2, 1) both;
  }

  .panel-heading,
  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .panel-heading h2,
  .dialog-header h2 {
    margin: 0;
    color: var(--md-on-surface);
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.035em;
    line-height: 1.1;
  }

  .panel-close {
    width: 48px;
    height: 48px;
    flex: none;

    display: grid;
    place-items: center;
    padding: 0;

    border: 0;
    border-radius: 50%;
    background: var(--md-surface-container);
    color: var(--md-on-surface-variant);
    cursor: pointer;

    transition:
      background-color 160ms ease,
      color 160ms ease;
  }

  .panel-close:hover {
    background: var(--md-primary-container);
    color: var(--md-on-primary-container);
  }

  .panel-close .material-symbols-rounded {
    font-size: 21px;
  }

  .github-team {
    display: grid;
    gap: 3px;
    margin-top: 12px;
  }

  .github-member {
    min-height: 58px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto 18px;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 16px;
    color: inherit;
    text-decoration: none;
    transition: background-color 160ms ease;
  }

  .github-member:hover {
    background: var(--md-surface-container-low);
  }

  .github-member-copy {
    min-width: 0;
    display: grid;
    gap: 4px;
  }

  .github-member-copy b {
    font-size: 14px;
    font-weight: 700;
  }

  .github-member-copy span,
  .github-username {
    color: var(--md-on-surface-variant);
    font-size: 12px;
  }

  .github-username {
    white-space: nowrap;
  }

  .github-member > .material-symbols-rounded {
    color: var(--md-primary);
    font-size: 18px;
  }

  /* Medical disclaimer dialog */

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
    width: min(560px, 100%);
    max-height: min(88dvh, 850px);

    display: flex;
    flex-direction: column;
    overflow: hidden;

    border: 1px solid var(--md-outline-variant);
    border-radius: 28px;
    background: var(--md-surface);
    color: var(--md-on-surface);
    box-shadow: 0 30px 90px rgba(8, 30, 24, 0.28);

    animation: dialog-in 240ms cubic-bezier(.2, .8, .2, 1) both;
  }

  .dialog-header {
    flex: none;
    padding: 20px 24px 18px;
    border-bottom: 1px solid var(--md-outline-variant);
    background: var(--md-surface-container-low);
  }

  .dialog-header h2 {
    font-size: clamp(24px, 4vw, 28px);
  }

  .dialog-content {
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 22px 24px 24px;
  }

  .info-section {
    display: grid;
    gap: 11px;
    margin-bottom: 23px;
  }

  .info-section:last-child {
    margin-bottom: 0;
  }

  .info-section h3 {
    margin: 0;
    color: var(--md-on-surface);
    font-size: 16px;
    font-weight: 700;
  }

  .info-section p,
  .urgent-notice p {
    margin: 0;
    color: var(--md-on-surface-variant);
    font-size: 14px;
    line-height: 1.6;
  }

  .disclaimer-copy {
    gap: 12px;
  }

  /* Emergency information */

  .urgent-notice {
    display: grid;
    gap: 12px;
    margin: 0 0 23px;
    padding: 18px;
    border: 1px solid #f0d8c7;
    border-radius: 20px;
    background: #fff5ed;
  }

  .urgent-heading {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .urgent-heading .material-symbols-rounded {
    color: #ad4c2b;
    font-size: 23px;
  }

  .urgent-heading h3 {
    margin: 0;
    color: #763b28;
    font-size: 15px;
    font-weight: 700;
  }

  .urgent-notice p {
    color: #6c5145;
  }

  .emergency-actions {
    display: grid;
    justify-items: start;
    gap: 7px;
  }

  .emergency-link {
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 16px;
    border-radius: 999px;
    background: #a84127;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
  }

  .emergency-link .material-symbols-rounded {
    font-size: 19px;
  }

  .emergency-source {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    color: #8a513a;
    font-size: 12px;
  }

  /* Source links */

  .section-intro {
    margin-top: -3px !important;
  }

  .source-list {
    display: grid;
    gap: 6px;
  }

  .source-item {
    min-height: 64px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 20px;
    align-items: center;
    gap: 12px;
    padding: 11px 13px;
    border: 1px solid var(--md-outline-variant);
    border-radius: 16px;
    background: var(--md-surface-container-low);
    color: inherit;
    text-decoration: none;
    transition:
      background-color 160ms ease,
      border-color 160ms ease;
  }

  .source-item:hover {
    border-color: #b3d9ca;
    background: var(--md-primary-container);
  }

  .source-copy {
    display: grid;
    gap: 4px;
  }

  .source-copy b {
    color: var(--md-on-surface);
    font-size: 14px;
  }

  .source-copy span {
    color: var(--md-on-surface-variant);
    font-size: 12px;
    line-height: 1.45;
  }

  .source-item > .material-symbols-rounded {
    color: var(--md-primary);
    font-size: 18px;
  }

  .inline-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--md-primary-strong);
    font-weight: 700;
    text-decoration: none;
  }

  .inline-link:hover {
    text-decoration: underline;
  }

  .inline-link .material-symbols-rounded {
    font-size: 14px;
  }

  .info-section .source-footnote {
    margin-top: 2px;
    color: #71827a;
    font-size: 12px;
    line-height: 1.5;
  }

  .myhealthfinder-credit {
    min-height: 56px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 5px;
    padding: 10px 12px;
    border: 1px solid var(--md-outline-variant);
    border-radius: 14px;
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
    border-top: 1px solid var(--md-outline-variant);
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
      bottom: max(15px, calc(env(safe-area-inset-bottom) + 10px));
      gap: 4px;
      padding: 6px;
      border-radius: 23px;
    }

    .control {
      width: 48px;
      height: 48px;
      border-radius: 17px;
    }

    .github-panel {
      right: 14px;
      bottom: calc(max(15px, env(safe-area-inset-bottom)) + 82px);
      padding: 17px;
      border-radius: 23px;
    }

    .github-member {
      grid-template-columns: minmax(0, 1fr) auto 18px;
      gap: 7px;
    }

    .github-username {
      font-size: 11px;
    }

    .info-dialog {
      max-height: 90dvh;
      border-radius: 24px;
    }

    .dialog-header {
      padding: 15px 17px 14px;
    }

    .dialog-content {
      padding: 17px;
    }

    .dialog-header h2 {
      font-size: 24px;
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
