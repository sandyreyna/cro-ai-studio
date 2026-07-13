import dns from 'node:dns/promises';
import net from 'node:net';

const PRIVATE_V4_RANGES = [
  [/^127\./],
  [/^10\./],
  [/^169\.254\./],
  [/^192\.168\./],
  [/^0\./],
];

function isPrivateV4(ip) {
  if (PRIVATE_V4_RANGES.some(([re]) => re.test(ip))) return true;
  const m = ip.match(/^172\.(\d+)\./);
  if (m) {
    const second = Number(m[1]);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

function isPrivateV6(ip) {
  const lower = ip.toLowerCase();
  return lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80');
}

export async function assertPublicHostname(hostname) {
  if (hostname === 'localhost' || hostname.endsWith('.local')) {
    throw new Error('No se puede analizar una URL local.');
  }
  let addresses;
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw new Error('No pudimos resolver ese dominio. Revisa que la URL esté bien escrita.');
  }
  for (const { address, family } of addresses) {
    if (family === 4 && isPrivateV4(address)) {
      throw new Error('No se pueden analizar direcciones de red privadas o internas.');
    }
    if (family === 6 && isPrivateV6(address)) {
      throw new Error('No se pueden analizar direcciones de red privadas o internas.');
    }
    if (!net.isIP(address)) {
      throw new Error('No se pudo resolver ese dominio a una dirección válida.');
    }
  }
}
