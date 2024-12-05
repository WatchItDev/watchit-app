import pbkdf2 from 'pbkdf2';
import crypto from 'crypto';
import wordlist from './english.txt';

export const entropyToMnemonic = (entropy) => {
  if (!(entropy instanceof Uint8Array)) {
    throw new TypeError('Entropy must be a Uint8Array');
  }
  if (entropy.length < 16 || entropy.length > 32 || entropy.length % 4 !== 0) {
    throw new Error('Invalid entropy');
  }

  // Convert entropy to binary string
  const entropyBits = Array.from(entropy)
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join('');

  // Calculate checksum
  const checksumBits = checksum(entropy);
  const bits = entropyBits + checksumBits;

  // Split bits into chunks of 11 bits and map to words
  const words = [];
  for (let i = 0; i < bits.length; i += 11) {
    const index = parseInt(bits.slice(i, i + 11), 2);
    words.push(wordlist[index]);
  }

  return words.join(' ');
};

// Helper function to calculate checksum
const checksum = (entropy) => {
  const hash = sha256(entropy);
  const hashBits = Array.from(hash)
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join('');
  const checksumLength = entropy.length / 4;
  return hashBits.slice(0, checksumLength);
};

const sha256 = (data) => crypto.createHash('sha256').update(data).digest();

const normalize = (text) => text.normalize('NFKD');

export const mnemonicToSeedSync = (mnemonic, password = '') => {
  if (typeof mnemonic !== 'string') {
    throw new TypeError('mnemonic must be a string');
  }
  if (typeof password !== 'string') {
    throw new TypeError('password must be a string');
  }

  const normalizedMnemonic = normalize(mnemonic);
  const salt = 'mnemonic' + normalize(password);

  return pbkdf2.pbkdf2Sync(normalizedMnemonic, salt, 2048, 64, 'sha512');
};
