import { memo, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type FloatingMoneyTextProps = {
  x: number;
  y: number;
  amount: number;
  onDone: () => void;
};

function FloatingMoneyTextBase({ x, y, amount, onDone }: FloatingMoneyTextProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(
      1,
      {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(onDone)();
        }
      }
    );
  }, [onDone, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: x - 14,
      top: y - 18,
      opacity: 1 - progress.value,
      transform: [{ translateY: -34 * progress.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle} pointerEvents="none">
      <Text style={styles.text}>+{amount.toFixed(0)}</Text>
    </Animated.View>
  );
}

export const FloatingMoneyText = memo(FloatingMoneyTextBase);

const styles = StyleSheet.create({
  text: {
    color: '#86efac',
    fontSize: 16,
    fontWeight: '800',
    textShadowColor: '#052e16',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

