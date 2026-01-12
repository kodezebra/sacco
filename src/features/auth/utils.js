/**
 * Auth Utilities for SACCO System
 * Uses Web Crypto API (Cloudflare Workers compatible)
 */

const PBKDF2_ITERATIONS = 100000;

/**
 * Hashes a plain-text password using PBKDF2
 * @param {string} password 
 * @returns {Promise<string>} Format: "salt:hash"
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${saltHex}:${hashHex}`;
}

/**
 * Verifies a password against a stored hash
 * @param {string} password 
 * @param {string} storedValue Format: "salt:hash"
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, storedValue) {
  if (!storedValue || !storedValue.includes(':')) return false;
  
  const [saltHex, storedHashHex] = storedValue.split(':');
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === storedHashHex;
}

/**
 * Generates a secure session ID
 * @returns {string}
 */
export function generateSessionId() {
  return crypto.randomUUID();
}
