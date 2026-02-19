import { memo, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  Line,
  Rect,
  RoundedRect,
  vec,
} from '@shopify/react-native-skia';
import Animated, {
  Easing,
  type SharedValue,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type SkiaGameSceneProps = {
  progress: number;
  physicsBoxes?: {
    id: number;
    x: number;
    y: number;
    angle: number;
    size: number;
  }[];
};

type WorkerDotProps = {
  index: number;
  width: number;
  baseY: number;
  bobPhase: SharedValue<number>;
  walkPhase: SharedValue<number>;
};

function WorkerDot({ index, width, baseY, bobPhase, walkPhase }: WorkerDotProps) {
  const cx = useDerivedValue(() => {
    const laneWidth = width - 80;
    const base = 40 + (laneWidth / 6) * (index + 1);
    const sway = Math.sin(walkPhase.value * Math.PI * 2 + index * 0.8) * 8;
    return base + sway;
  }, [index, width]);

  const cy = useDerivedValue(() => {
    const bob = Math.sin(bobPhase.value * Math.PI * 2 + index * 0.95) * 6;
    return baseY + bob;
  }, [baseY, index]);

  return <Circle cx={cx} cy={cy} r={10} color="#f59e0b" />;
}

function SkiaGameSceneBase({ progress, physicsBoxes = [] }: SkiaGameSceneProps) {
  const { width, height } = useWindowDimensions();

  const bobPhase = useSharedValue(0);
  const walkPhase = useSharedValue(0);

  useEffect(() => {
    bobPhase.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );

    walkPhase.value = withRepeat(
      withTiming(1, {
        duration: 2600,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [bobPhase, walkPhase]);

  const safeProgress = Math.max(0, Math.min(progress, 1));
  const groundTop = height * 0.68;
  const craneX = width * 0.15;
  const craneTop = height * 0.15;
  const buildingX = width * 0.55;
  const buildingBase = groundTop;
  const buildingHeight = height * 0.34;
  const currentBuildingHeight = buildingHeight * safeProgress;

  return (
    <Canvas style={{ width, height }}>
      <Rect x={0} y={0} width={width} height={height} color="#0b1220" />

      <Rect x={0} y={groundTop} width={width} height={height - groundTop} color="#334155" />

      <Rect x={craneX} y={craneTop} width={14} height={groundTop - craneTop} color="#facc15" />
      <Line p1={vec(craneX + 7, craneTop)} p2={vec(craneX + 170, craneTop)} color="#facc15" strokeWidth={7} />
      <Line p1={vec(craneX + 170, craneTop)} p2={vec(craneX + 170, groundTop - 80)} color="#facc15" strokeWidth={4} />
      <Rect x={craneX + 154} y={groundTop - 96} width={32} height={16} color="#eab308" />

      <Rect x={buildingX} y={buildingBase - buildingHeight} width={90} height={buildingHeight} color="#1f2937" />
      <Rect
        x={buildingX}
        y={buildingBase - currentBuildingHeight}
        width={90}
        height={currentBuildingHeight}
        color="#22c55e"
      />

      <RoundedRect x={width * 0.1} y={40} width={width * 0.8} height={20} r={8} color="#1e293b" />
      <RoundedRect x={width * 0.1} y={40} width={width * 0.8 * safeProgress} height={20} r={8} color="#4ade80" />

      <WorkerDot index={0} width={width} baseY={groundTop - 16} bobPhase={bobPhase} walkPhase={walkPhase} />
      <WorkerDot index={1} width={width} baseY={groundTop - 20} bobPhase={bobPhase} walkPhase={walkPhase} />
      <WorkerDot index={2} width={width} baseY={groundTop - 14} bobPhase={bobPhase} walkPhase={walkPhase} />
      <WorkerDot index={3} width={width} baseY={groundTop - 18} bobPhase={bobPhase} walkPhase={walkPhase} />
      <WorkerDot index={4} width={width} baseY={groundTop - 12} bobPhase={bobPhase} walkPhase={walkPhase} />

      {physicsBoxes.map((box) => (
        <Group
          key={box.id}
          transform={[{ rotate: box.angle }]}
          origin={vec(box.x, box.y)}
        >
          <Rect
            x={box.x - box.size / 2}
            y={box.y - box.size / 2}
            width={box.size}
            height={box.size}
            color="#b45309"
          />
        </Group>
      ))}
    </Canvas>
  );
}

export const SkiaGameScene = memo(SkiaGameSceneBase);

