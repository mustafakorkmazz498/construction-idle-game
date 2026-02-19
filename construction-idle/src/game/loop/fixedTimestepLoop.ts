export type FixedTimestepLoopOptions = {
  targetUpdatesPerSecond?: number;
  maxDeltaSec?: number;
  onTick: (dtSec: number) => void;
};

export type FixedTimestepLoopHandle = {
  start: () => void;
  stop: () => void;
};

export function createFixedTimestepLoop(options: FixedTimestepLoopOptions): FixedTimestepLoopHandle {
  const targetUpdatesPerSecond = options.targetUpdatesPerSecond ?? 60;
  const fixedStepSec = 1 / targetUpdatesPerSecond;
  const maxDeltaSec = options.maxDeltaSec ?? 0.25;

  let running = false;
  let rafId: number | null = null;
  let previousTimeMs: number | null = null;
  let accumulatorSec = 0;

  const frame = (timeMs: number): void => {
    if (!running) {
      return;
    }

    if (previousTimeMs === null) {
      previousTimeMs = timeMs;
    }

    const rawDeltaSec = (timeMs - previousTimeMs) / 1000;
    previousTimeMs = timeMs;

    const deltaSec = Math.max(0, Math.min(rawDeltaSec, maxDeltaSec));
    accumulatorSec += deltaSec;

    while (accumulatorSec >= fixedStepSec) {
      options.onTick(fixedStepSec);
      accumulatorSec -= fixedStepSec;
    }

    rafId = requestAnimationFrame(frame);
  };

  return {
    start: () => {
      if (running) {
        return;
      }

      running = true;
      previousTimeMs = null;
      accumulatorSec = 0;
      rafId = requestAnimationFrame(frame);
    },

    stop: () => {
      running = false;
      previousTimeMs = null;
      accumulatorSec = 0;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
  };
}

