 
// ----------------------------------------------------------------------

export const truncateAddress = (text: string, startChars= 6, endChars= 6) => {
  if (!text) return '';

  if (text.length <= startChars + endChars) {
    return text;
  }
  return `${text.slice(0, startChars)}...${text.slice(-endChars)}`;
};

export const replacePrefix = (hash: string) => {
  if (hash.startsWith('0x')) {
    return 'f0' + hash.slice(2);
  }
  return hash;
};
