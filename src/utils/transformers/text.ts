export function truncateText(subject: string, limit: number = 20) {
  const ellipsis = subject.length > limit ? "..." : "";
  return subject.slice(0, 30) + ellipsis;
}
