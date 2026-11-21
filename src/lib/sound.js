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
      0.22,
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

    const now = context.currentTime;

    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    const forward = direction >= 0;

    oscillator.type = 'sine';

    oscillator.frequency.setValueAtTime(
      forward ? 360 : 560,
      now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      forward ? 720 : 300,
      now + 0.16
    );

    filter.type = 'lowpass';

    filter.frequency.setValueAtTime(
      forward ? 900 : 1400,
      now
    );

    filter.frequency.exponentialRampToValueAtTime(
      forward ? 1800 : 650,
      now + 0.17
    );

    gain.gain.setValueAtTime(
      0.0001,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      0.055,
      now + 0.035
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.2
    );

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    oscillator.start(now);
    oscillator.stop(now + 0.22);

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
        start + 0.32
      );

      oscillator.connect(gain);
      gain.connect(master);

      oscillator.start(start);
      oscillator.stop(start + 0.34);

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