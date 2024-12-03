export const hexToBuffer = (hex) => Buffer.from(hex.replace(/^0x/, ''), 'hex');
export const removeHexPrefix = (hex) => hex.replace(/^0x/, '');
export const sanitizeBytes = (bytes) => bytes.replace(/[^0-9a-f]/gi, '');
export const numberToHex = (num) => `0x${num.toString(16)}`;
export const hexToBinary = (hex) => parseInt(hex, 16).toString(2);
export const binaryToNumber = (binary) => parseInt(binary, 2);
