export const selectorIsMatch = (target: HTMLElement, fullSelector: string) => {
  const selector = extractSelectorName(fullSelector);
  return target.className === selector || target.id === selector;
};

const extractSelectorName = (fullSelector: string) => {
  return fullSelector.split('').splice(1).join('');
};
