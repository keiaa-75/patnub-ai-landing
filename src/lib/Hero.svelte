<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Phone from './Phone.svelte';
  import DemoScreens from './DemoScreens.svelte';

  let wrap, phone, reveal, problem, tagline;
  let screen = $state(0);

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const motion = '(prefers-reduced-motion: no-preference)';

    const build = (isDesktop) => {
      const p = { i: 0 };
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: true }
      });

      gsap.set(reveal, { '--r': '0%', '--cx': isDesktop ? '10%' : '50%', '--cy': isDesktop ? '50%' : '100%' });
      gsap.set(tagline, { opacity: 0, y: 20 });

      if (isDesktop) {
        gsap.set(phone, { transformPerspective: 1000, x: '-60vw', rotateY: 0 });
        tl.to(phone, { x: '28vw', rotateY: 360, ease: 'power2.out', duration: 0.55 }, 0.2);
        tl.to(reveal, { '--r': '150%', '--cx': '78%', duration: 0.55 }, 0.2);
      } else {
        gsap.set(phone, { y: '110vh' });
        tl.to(phone, { y: 0, ease: 'power2.out', duration: 0.45 }, 0.2);
        tl.to(reveal, { '--r': '160%', duration: 0.45 }, 0.2);
      }

      tl.to(problem, { opacity: 0, duration: 0.15 }, 0.2);
      tl.to(tagline, { opacity: 1, y: 0, duration: 0.15 }, 0.5);
      tl.to(p, { i: 2, snap: 'i', duration: 0.25, onUpdate: () => (screen = p.i) }, 0.75);
    };

    mm.add(`(min-width: 768px) and ${motion}`, () => build(true));
    mm.add(`(max-width: 767px) and ${motion}`, () => build(false));

    return () => mm.revert();
  });
</script>

<section class="wrap" bind:this={wrap}>
  <div class="stage">
    <div class="reveal" bind:this={reveal}></div>

    <div class="copy problem" bind:this={problem}>
      <h1>Placeholder: the problem statement</h1>
      <p>Supporting sentence.</p>
    </div>

    <div class="copy tagline" bind:this={tagline}>
      <h2>Placeholder: tagline for the solution</h2>
      <p>One line on what the app does.</p>
    </div>

    <div class="phone-slot" bind:this={phone}>
      <Phone><DemoScreens index={screen} /></Phone>
    </div>
  </div>
</section>

<style>
  .wrap { height: 350vh; }
  .stage {
    position: sticky; top: 0; height: 100svh; overflow: hidden;
    display: grid; place-items: center;
  }
  .reveal {
    position: absolute; inset: 0; background: var(--green);
    --r: 150%; --cx: 78%; --cy: 50%;
    clip-path: circle(var(--r) at var(--cx) var(--cy));
  }
  .copy { position: absolute; left: 8%; top: 50%; translate: 0 -50%; width: 40%; }
  .problem { opacity: 0; }
  h1, h2 { font-size: clamp(1.75rem, 3.5vw, 3rem); line-height: 1.15; margin: 0 0 1rem; }
  .phone-slot { position: relative; transform: translateX(28vw); }

  @media (max-width: 767px) {
    .copy { left: 8%; right: 8%; top: 12%; width: auto; translate: none; }
    .phone-slot { transform: none; margin-top: 18svh; transform-style: preserve-3d; }
  }
</style>