/*
  patnub.ai interaction sounds

  Original synthesized effects using the Web Audio API.

  Sound is disabled by default.
  No external audio files are required.
*/

export function createSoundEngine() {
  let context = null;
  let master = null;

  let enabled = false;
  let disposed = false;
  let lastTransitionAt = Number.NEGATIVE_INFINITY;

  const TRANSITION_COOLDOWN = 0.34;

  /*
    Create the audio context only when sound is enabled.
  */

  function createContext() {
    if (
      disposed ||
      typeof window === 'undefined'
    ) {
      return false;
    }

    const AudioContextClass =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContextClass) {
      return false;
    }

    if (!context) {
      try {
        context = new AudioContextClass();

        master = context.createGain();

        master.gain.value = 0;

        master.connect(context.destination);

      } catch (error) {
        console.warn(
          '[patnub.ai] Web Audio is unavailable:',
          error
        );

        return false;
      }
    }

    return true;
  }

  /*
    Resume an existing suspended audio context.
  */

  async function unlock() {
    if (!createContext()) {
      return false;
    }

    try {
      if (context.state === 'suspended') {
        await context.resume();
      }

      return context.state === 'running';

    } catch (error) {
      console.warn(
        '[patnub.ai] Could not resume audio:',
        error
      );

      return false;
    }
  }

  /*
    Enable sound.

    A successful return means the browser supports the
    audio context. The context itself may still be suspended
    until a permitted user interaction occurs.
  */

  async function enable() {
    if (!createContext()) {
      enabled = false;
      return false;
    }

    enabled = true;

    master.gain.setTargetAtTime(
      0.17,
      context.currentTime,
      0.04
    );

    await unlock();

    return true;
  }

  /*
    Mute without destroying the context.
  */

  function disable() {
    enabled = false;

    if (context && master) {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(
        0,
        context.currentTime,
        0.025
      );
    }
  }

  function canPlay() {
    return (
      enabled &&
      !disposed &&
      context &&
      master &&
      context.state === 'running'
    );
  }

  /*
    Soft pitch sweep for a major scene transition.

    direction:
      1  = forward
     -1  = backward
  */

  function transition(direction = 1) {
    if (!canPlay()) return;

    // Avoid a flurry of tones when someone scrolls rapidly across beats.
    const now = context.currentTime;
    if (now - lastTransitionAt < TRANSITION_COOLDOWN) return;
    lastTransitionAt = now;

    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    const forward = direction >= 0;

    oscillator.type = 'sine';

    oscillator.frequency.setValueAtTime(
      forward ? 420 : 560,
      now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      forward ? 680 : 360,
      now + 0.13
    );

    filter.type = 'lowpass';

    filter.frequency.setValueAtTime(
      forward ? 1000 : 1300,
      now
    );

    filter.frequency.exponentialRampToValueAtTime(
      forward ? 1600 : 720,
      now + 0.14
    );

    gain.gain.setValueAtTime(
      0.0001,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      0.032,
      now + 0.025
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.145
    );

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    oscillator.start(now);
    oscillator.stop(now + 0.16);

    oscillator.onended = () => {
      oscillator.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }

  /*
    Gentle two-note chime for the final phone landing.
  */

  function landing() {
    if (!canPlay()) return;

    const now = context.currentTime;

    const notes = [
      {
        frequency: 523.25,
        offset: 0
      },
      {
        frequency: 659.25,
        offset: 0.075
      }
    ];

    notes.forEach(({ frequency, offset }) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      const start = now + offset;

      oscillator.type = 'sine';

      oscillator.frequency.setValueAtTime(
        frequency,
        start
      );

      gain.gain.setValueAtTime(
        0.0001,
        start
      );

      gain.gain.exponentialRampToValueAtTime(
        0.035,
        start + 0.025
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + 0.28
      );

      oscillator.connect(gain);
      gain.connect(master);

      oscillator.start(start);
      oscillator.stop(start + 0.3);

      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    });
  }

  /*
    Dispose resources when the landing page is destroyed.
  */

  function dispose() {
    if (disposed) return;

    disable();

    disposed = true;

    if (
      context &&
      context.state !== 'closed'
    ) {
      context.close().catch(() => {});
    }

    context = null;
    master = null;
  }

  return {
    enable,
    disable,
    unlock,
    transition,
    landing,
    dispose
  };
}