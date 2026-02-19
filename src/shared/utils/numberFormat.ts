export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  const abs = Math.abs(value);
  if (abs < 1_000) {
    return value.toFixed(1);
  }
  if (abs < 1_000_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  if (abs < 1_000_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  return `${(value / 1_000_000_000).toFixed(1)}B`;
}

