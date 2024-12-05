/* eslint-disable */
// ----------------------------------------------------------------------

export const truncateAddress = (text: string, startChars: number = 6, endChars: number = 6) => {
  if (text.length <= startChars + endChars) {
    return text;
  }
  return `${text.slice(0, startChars)}...${text.slice(-endChars)}`;
};
