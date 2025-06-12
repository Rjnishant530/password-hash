import CryptoJS from 'crypto-js';

// Define the HashAlgorithm type
export type HashAlgorithm = 'MD5' | 'SHA1' | 'SHA256' | 'SHA224' | 'SHA512' | 'SHA384' | 'SHA3' | 'RIPEMD160';

// Define the VisualizationMethod type
export type VisualizationMethod = 'keypad' | 'androidPattern' | 'bankVault';

// Define the DisplayFormat type
export type DisplayFormat = 'all' | 'letters' | 'numbers';

// Hash algorithm options
export const hashAlgorithms = [
  { value: 'MD5', label: 'MD5' },
  { value: 'SHA1', label: 'SHA-1' },
  { value: 'SHA256', label: 'SHA-256' },
  { value: 'SHA224', label: 'SHA-224' },
  { value: 'SHA512', label: 'SHA-512' },
  { value: 'SHA384', label: 'SHA-384' },
  { value: 'SHA3', label: 'SHA-3' },
  { value: 'RIPEMD160', label: 'RIPEMD-160' },
];

// Display format options
export const displayFormats = [
  { value: 'all', label: 'All Characters' },
  { value: 'letters', label: 'Letters Only' },
  { value: 'numbers', label: 'Numbers Only' },
];

// Visualization method options
export const visualizationMethods = [
  { value: 'keypad', label: 'Keypad' },
  { value: 'androidPattern', label: 'Android Pattern' },
  // { value: 'bankVault', label: 'Bank Vault' },
];

// Generate hash function
export function generateHash(text: string, algorithm: HashAlgorithm, salt?: string): string {
  const textToHash = salt ? text + salt : text;
  
  switch (algorithm) {
    case 'MD5':
      return CryptoJS.MD5(textToHash).toString(CryptoJS.enc.Base64);
    case 'SHA1':
      return CryptoJS.SHA1(textToHash).toString(CryptoJS.enc.Base64);
    case 'SHA256':
      return CryptoJS.SHA256(textToHash).toString(CryptoJS.enc.Base64);
    case 'SHA224':
      return CryptoJS.SHA224(textToHash).toString(CryptoJS.enc.Base64);
    case 'SHA512':
      return CryptoJS.SHA512(textToHash).toString(CryptoJS.enc.Base64);
    case 'SHA384':
      return CryptoJS.SHA384(textToHash).toString(CryptoJS.enc.Base64);
    case 'SHA3':
      return CryptoJS.SHA3(textToHash).toString(CryptoJS.enc.Base64);
    case 'RIPEMD160':
      return CryptoJS.RIPEMD160(textToHash).toString(CryptoJS.enc.Base64);
    default:
      return CryptoJS.SHA256(textToHash).toString(CryptoJS.enc.Base64);
  }
}

// Format hash function
export function formatHash(hash: string, groupSize: number, format: DisplayFormat = 'all'): string {
  let filteredHash = hash;
  
  // Filter characters based on format
  if (format === 'letters') {
    filteredHash = hash.replace(/[^a-f]/g, '');
  } else if (format === 'numbers') {
    filteredHash = hash.replace(/[^0-9]/g, '');
  }
  
  if (groupSize <= 1) return filteredHash;
  
  const groups = [];
  for (let i = 0; i < filteredHash.length; i += groupSize) {
    groups.push(filteredHash.slice(i, i + groupSize));
  }
  
  return groups.join(' ');
}