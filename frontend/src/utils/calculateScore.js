export const calculateScore = (matched, total) => {
  if (total === 0) return 0;
  return Math.round((matched / total) * 100);
};
