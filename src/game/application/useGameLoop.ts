import { useEffect, useRef, useState } from 'react';
import { logger } from '../../shared/logging/logger';

type GameLoopOptions = {
  fixedStepMs: number;
  maxFrameDeltaMs?: number;
  onFixedUpdate: (stepMs: number) => void;
};

export function useGameLoop(options: GameLoopOptions): number {
  const { fixedStepMs, onFixedUpdate, maxFrameDeltaMs = 250 } = options;
  const [fps, setFps] = useState(0);

  const rafRef = useRef<number | null>(null);
  const accumulatorRef = useRef(0);
  const previousTimeRef = useRef(0);
  const frameCounterRef = useRef(0);
  const frameSecondTimerRef = useRef(0);
  const onFixedUpdateRef = useRef(onFixedUpdate);

  onFixedUpdateRef.current = onFixedUpdate;

  useEffect(() => {
    if (!Number.isFinite(fixedStepMs) || fixedStepMs <= 0) {
      logger.error('Invalid fixedStepMs supplied to useGameLoop.', { fixedStepMs });
      return;
    }

    const frame = (now: number): void => {
      if (previousTimeRef.current === 0) {
        previousTimeRef.current = now;
      }

      let delta = now - previousTimeRef.current;
      previousTimeRef.current = now;

      if (!Number.isFinite(delta) || delta < 0) {
        delta = 0;
      }

      if (delta > maxFrameDeltaMs) {
        delta = maxFrameDeltaMs;
      }

      accumulatorRef.current += delta;

      while (accumulatorRef.current >= fixedStepMs) {
        try {
          onFixedUpdateRef.current(fixedStepMs);
        } catch (error) {
          logger.error('Error in fixed update callback.', error);
        }
        accumulatorRef.current -= fixedStepMs;
      }

      frameCounterRef.current += 1;
      frameSecondTimerRef.current += delta;

      if (frameSecondTimerRef.current >= 1000) {
        setFps(frameCounterRef.current);
        frameSecondTimerRef.current = 0;
        frameCounterRef.current = 0;
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    logger.info('Game loop started.', { fixedStepMs, maxFrameDeltaMs });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      logger.info('Game loop stopped.');
    };
  }, [fixedStepMs, maxFrameDeltaMs]);

  return fps;
}

