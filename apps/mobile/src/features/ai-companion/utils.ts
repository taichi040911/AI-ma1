export function formatProgress(current: number, total?: number | null) {
  if (!total || total <= 0) {
    return `質問 ${current}`;
  }
  return `質問 ${current} / ${total}`;
}

export function progressRatio(current: number, total?: number | null) {
  if (!total || total <= 0) {
    return 0;
  }
  return Math.min(current / total, 1);
}
