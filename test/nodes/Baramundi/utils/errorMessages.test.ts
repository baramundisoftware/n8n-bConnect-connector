import { describe, it, expect } from 'vitest';
import { getNetworkErrorInfo, isSslError, getSslErrorInfo } from '../../../../nodes/shared/utils/errorMessages';

describe('getNetworkErrorInfo()', () => {
  it('should return ECONNREFUSED message', () => {
    const info = getNetworkErrorInfo({ code: 'ECONNREFUSED', message: 'connect ECONNREFUSED' }, 'https://bms:444');
    expect(info.message).toContain('Cannot connect');
    expect(info.troubleshooting.length).toBeGreaterThan(0);
  });

  it('should detect ECONNREFUSED from message when code is empty', () => {
    const info = getNetworkErrorInfo({ message: 'connect ECONNREFUSED 127.0.0.1:444' }, 'https://bms:444');
    expect(info.message).toContain('Cannot connect');
  });

  it('should return ENOTFOUND message', () => {
    const info = getNetworkErrorInfo({ code: 'ENOTFOUND', message: 'getaddrinfo ENOTFOUND' }, 'https://bad-host:444');
    expect(info.message).toContain('Cannot resolve hostname');
    expect(info.troubleshooting).toContain('Try using the IP address instead of hostname');
  });

  it('should return ETIMEDOUT message', () => {
    const info = getNetworkErrorInfo({ code: 'ETIMEDOUT', message: 'connect ETIMEDOUT' }, 'https://bms:444');
    expect(info.message).toContain('timed out');
  });

  it('should return generic network error for unknown codes', () => {
    const info = getNetworkErrorInfo({ code: 'UNKNOWN', message: 'Something went wrong' }, 'https://bms:444');
    expect(info.message).toContain('Network error');
    expect(info.troubleshooting.length).toBeGreaterThan(0);
  });

  it('should handle null/undefined error', () => {
    const info = getNetworkErrorInfo(null, 'https://bms:444');
    expect(info.message).toContain('Network error');
  });
});

describe('isSslError()', () => {
  it('should return true for certificate errors', () => {
    expect(isSslError({ message: 'self-signed certificate in chain' })).toBe(true);
  });

  it('should return true for SSL errors', () => {
    expect(isSslError({ message: 'SSL routines failed' })).toBe(true);
  });

  it('should return true for TLS errors', () => {
    expect(isSslError({ message: 'TLS handshake failed' })).toBe(true);
  });

  it('should return true for DEPTH_ZERO_SELF_SIGNED_CERT code', () => {
    expect(isSslError({ code: 'DEPTH_ZERO_SELF_SIGNED_CERT', message: '' })).toBe(true);
  });

  it('should return true for CERT_HAS_EXPIRED code', () => {
    expect(isSslError({ code: 'CERT_HAS_EXPIRED', message: '' })).toBe(true);
  });

  it('should return true for UNABLE_TO_VERIFY_LEAF_SIGNATURE code', () => {
    expect(isSslError({ code: 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', message: '' })).toBe(true);
  });

  it('should return false for non-SSL errors', () => {
    expect(isSslError({ message: 'Connection refused' })).toBe(false);
  });

  it('should handle null error', () => {
    expect(isSslError(null)).toBe(false);
  });
});

describe('getSslErrorInfo()', () => {
  it('should return SSL error info with troubleshooting hints', () => {
    const info = getSslErrorInfo({ message: 'self-signed certificate' });
    expect(info.message).toContain('SSL Certificate Error');
    expect(info.troubleshooting.length).toBeGreaterThan(0);
    expect(info.troubleshooting.some((t: string) => t.includes('Ignore SSL Issues'))).toBe(true);
  });
});
