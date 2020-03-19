export function someSideInLimit(firstPair: number[], secondPair: number[], lim: number) {
  return inLimit(firstPair[0], secondPair[0], lim)
      || inLimit(firstPair[0], secondPair[1], lim)
      || inLimit(firstPair[1], secondPair[0], lim)
      || inLimit(firstPair[1], secondPair[1], lim);
}

function inLimit(a: number, b: number, lim: number) {
  return Math.abs(a - lim) < b && (a + lim) > b;
}

export const someInRange = (first: number, last: number, arrToCheck: number[]) => {
  return arrToCheck.some(el => first <= el && el <= last);
};
