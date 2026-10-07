/**
 * Unit Tests for Validation Utilities
 *
 * Tests validation functions following TDD methodology
 * Tests written before implementation
 */

import { describe, it, expect } from 'vitest';
import {
	validateGuid,
	validateGuidList,
	validateDisplayName,
	validateEmail,
	validateMacAddress,
	validateIpv4Address,
	validateIso8601DateTime,
	validateMaintenanceWindow,
	extractResourceLocatorValue,
	validateRfc6902Patch,
	normalizeBaseUrl,
	type ValidationResult,
} from '../../../../nodes/shared/utils/validation';

describe('Validation Utilities', () => {
	describe('validateGuid', () => {
		it('should accept valid GUID with lowercase letters', () => {
			const result = validateGuid('12345678-1234-1234-1234-123456789012');
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept valid GUID with uppercase letters', () => {
			const result = validateGuid('ABCDEF12-ABCD-ABCD-ABCD-ABCDEFABCDEF');
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept valid GUID with mixed case', () => {
			const result = validateGuid('AbCdEf12-3456-7890-aBcD-123456789AbC');
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should reject invalid GUID format (missing hyphens)', () => {
			const result = validateGuid('12345678123412341234123456789012');
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
			expect(result.errors[0]).toContain('not a valid GUID');
		});

		it('should reject invalid GUID format (wrong length)', () => {
			const result = validateGuid('1234-5678-1234');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('not a valid GUID');
		});

		it('should reject empty string', () => {
			const result = validateGuid('');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toBe('GUID is required');
		});

		it('should reject non-string values', () => {
			const result = validateGuid(null as any);
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toBe('GUID is required');
		});

		it('should reject GUID with invalid characters', () => {
			const result = validateGuid('GHIJKLMN-1234-1234-1234-123456789012');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('not a valid GUID');
		});

		it('should handle GUID with whitespace by trimming', () => {
			const result = validateGuid('  12345678-1234-1234-1234-123456789012  ');
			expect(result.valid).toBe(true);
		});
	});

	describe('validateGuidList', () => {
		it('should accept single valid GUID', () => {
			const result = validateGuidList('12345678-1234-1234-1234-123456789012');
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept multiple valid GUIDs', () => {
			const result = validateGuidList(
				'12345678-1234-1234-1234-123456789012,abcdef12-abcd-abcd-abcd-abcdefabcdef',
			);
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept GUIDs with spaces around commas', () => {
			const result = validateGuidList(
				'12345678-1234-1234-1234-123456789012 , abcdef12-abcd-abcd-abcd-abcdefabcdef',
			);
			expect(result.valid).toBe(true);
		});

		it('should reject empty string', () => {
			const result = validateGuidList('');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toBe('At least one GUID is required');
		});

		it('should reject list with invalid GUID', () => {
			const result = validateGuidList(
				'12345678-1234-1234-1234-123456789012,not-a-guid',
			);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('should collect all errors for multiple invalid GUIDs', () => {
			const result = validateGuidList('invalid1,invalid2,invalid3');
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThanOrEqual(3);
		});

		it('should ignore empty items in list', () => {
			const result = validateGuidList(
				'12345678-1234-1234-1234-123456789012,,abcdef12-abcd-abcd-abcd-abcdefabcdef',
			);
			expect(result.valid).toBe(true);
		});
	});

	describe('validateDisplayName', () => {
		it('should accept valid display name', () => {
			const result = validateDisplayName('WS-001');
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept display name with spaces', () => {
			const result = validateDisplayName('My Computer 001');
			expect(result.valid).toBe(true);
		});

		it('should accept display name with special characters', () => {
			const result = validateDisplayName('Computer-Name_123 (Test)');
			expect(result.valid).toBe(true);
		});

		it('should accept maximum length (255 chars)', () => {
			const result = validateDisplayName('a'.repeat(255));
			expect(result.valid).toBe(true);
		});

		it('should reject empty string', () => {
			const result = validateDisplayName('');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('cannot be empty');
		});

		it('should reject whitespace-only string', () => {
			const result = validateDisplayName('   ');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('cannot be empty');
		});

		it('should reject display name exceeding 255 characters', () => {
			const result = validateDisplayName('a'.repeat(256));
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('255 characters or less');
		});

		it('should reject display name with invalid character <', () => {
			const result = validateDisplayName('Name<Invalid');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('invalid characters');
		});

		it('should reject display name with invalid character >', () => {
			const result = validateDisplayName('Name>Invalid');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('invalid characters');
		});

		it('should reject display name with invalid character :', () => {
			const result = validateDisplayName('Name:Invalid');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('invalid characters');
		});

		it('should reject display name with invalid character "', () => {
			const result = validateDisplayName('Name"Invalid');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('invalid characters');
		});

		it('should reject display name with multiple invalid characters', () => {
			const result = validateDisplayName('Name<>:|Invalid');
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});
	});

	describe('validateEmail', () => {
		it('should accept valid email', () => {
			const result = validateEmail('user@example.com');
			expect(result.valid).toBe(true);
		});

		it('should accept email with subdomain', () => {
			const result = validateEmail('user@mail.example.com');
			expect(result.valid).toBe(true);
		});

		it('should accept email with plus sign', () => {
			const result = validateEmail('user+tag@example.com');
			expect(result.valid).toBe(true);
		});

		it('should accept email with numbers', () => {
			const result = validateEmail('user123@example456.com');
			expect(result.valid).toBe(true);
		});

		it('should reject invalid email (no @)', () => {
			const result = validateEmail('userexample.com');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('valid email');
		});

		it('should reject invalid email (no domain)', () => {
			const result = validateEmail('user@');
			expect(result.valid).toBe(false);
		});

		it('should reject invalid email (no local part)', () => {
			const result = validateEmail('@example.com');
			expect(result.valid).toBe(false);
		});

		it('should reject empty string', () => {
			const result = validateEmail('');
			expect(result.valid).toBe(false);
		});
	});

	describe('validateMacAddress', () => {
		it('should accept valid MAC address with uppercase', () => {
			const result = validateMacAddress('AA:BB:CC:DD:EE:FF');
			expect(result.valid).toBe(true);
		});

		it('should accept valid MAC address with lowercase', () => {
			const result = validateMacAddress('aa:bb:cc:dd:ee:ff');
			expect(result.valid).toBe(true);
		});

		it('should accept valid MAC address with mixed case', () => {
			const result = validateMacAddress('Aa:Bb:Cc:Dd:Ee:Ff');
			expect(result.valid).toBe(true);
		});

		it('should accept valid MAC address with numbers', () => {
			const result = validateMacAddress('00:11:22:33:44:55');
			expect(result.valid).toBe(true);
		});

		it('should reject invalid MAC address (missing colons)', () => {
			const result = validateMacAddress('AABBCCDDEEFF');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('valid MAC address');
		});

		it('should reject invalid MAC address (wrong format)', () => {
			const result = validateMacAddress('AA-BB-CC-DD-EE-FF');
			expect(result.valid).toBe(false);
		});

		it('should reject invalid MAC address (too short)', () => {
			const result = validateMacAddress('AA:BB:CC');
			expect(result.valid).toBe(false);
		});

		it('should reject invalid MAC address (invalid characters)', () => {
			const result = validateMacAddress('GG:HH:II:JJ:KK:LL');
			expect(result.valid).toBe(false);
		});

		it('should reject empty string', () => {
			const result = validateMacAddress('');
			expect(result.valid).toBe(false);
		});
	});

	describe('validateIpv4Address', () => {
		it('should accept valid IPv4 address', () => {
			const result = validateIpv4Address('192.168.1.1');
			expect(result.valid).toBe(true);
		});

		it('should accept localhost IP', () => {
			const result = validateIpv4Address('127.0.0.1');
			expect(result.valid).toBe(true);
		});

		it('should accept maximum valid IP', () => {
			const result = validateIpv4Address('255.255.255.255');
			expect(result.valid).toBe(true);
		});

		it('should accept minimum valid IP', () => {
			const result = validateIpv4Address('0.0.0.0');
			expect(result.valid).toBe(true);
		});

		it('should reject invalid IP (octet > 255)', () => {
			const result = validateIpv4Address('256.1.1.1');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('valid IPv4');
		});

		it('should reject invalid IP (too few octets)', () => {
			const result = validateIpv4Address('192.168.1');
			expect(result.valid).toBe(false);
		});

		it('should reject invalid IP (too many octets)', () => {
			const result = validateIpv4Address('192.168.1.1.1');
			expect(result.valid).toBe(false);
		});

		it('should reject invalid IP (letters)', () => {
			const result = validateIpv4Address('abc.def.ghi.jkl');
			expect(result.valid).toBe(false);
		});

		it('should reject empty string', () => {
			const result = validateIpv4Address('');
			expect(result.valid).toBe(false);
		});
	});

	describe('validateIso8601DateTime', () => {
		it('should accept valid ISO 8601 date with Z', () => {
			const result = validateIso8601DateTime('2026-01-22T10:30:00Z');
			expect(result.valid).toBe(true);
		});

		it('should accept valid ISO 8601 date with timezone offset', () => {
			const result = validateIso8601DateTime('2026-01-22T10:30:00+01:00');
			expect(result.valid).toBe(true);
		});

		it('should accept valid ISO 8601 date without timezone', () => {
			const result = validateIso8601DateTime('2026-01-22T10:30:00');
			expect(result.valid).toBe(true);
		});

		it('should accept valid ISO 8601 date with milliseconds', () => {
			const result = validateIso8601DateTime('2026-01-22T10:30:00.123Z');
			expect(result.valid).toBe(true);
		});

		it('should reject invalid date format', () => {
			const result = validateIso8601DateTime('22/01/2026 10:30');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('not a valid ISO 8601');
		});

		it('should reject invalid date (invalid month)', () => {
			const result = validateIso8601DateTime('2026-13-01T10:30:00Z');
			expect(result.valid).toBe(false);
		});

		it('should reject invalid date (invalid day)', () => {
			const result = validateIso8601DateTime('2026-01-32T10:30:00Z');
			expect(result.valid).toBe(false);
		});

		it('should reject empty string', () => {
			const result = validateIso8601DateTime('');
			expect(result.valid).toBe(false);
		});

		it('should reject non-string values', () => {
			const result = validateIso8601DateTime(null as any);
			expect(result.valid).toBe(false);
		});

		// Strict ISO 8601 — reject formats new Date() accepts but are not ISO 8601
		it('should reject human-readable date string', () => {
			const result = validateIso8601DateTime('March 30, 2026');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('not a valid ISO 8601');
		});

		it('should reject US-style date string', () => {
			const result = validateIso8601DateTime('01/22/2026');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('not a valid ISO 8601');
		});

		it('should reject date-only string without time component', () => {
			const result = validateIso8601DateTime('2026-01-22');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('not a valid ISO 8601');
		});

		it('should reject date with space separator instead of T', () => {
			const result = validateIso8601DateTime('2026-01-22 10:30:00');
			expect(result.valid).toBe(false);
			expect(result.errors[0]).toContain('not a valid ISO 8601');
		});

		it('should reject month out of range (13)', () => {
			const result = validateIso8601DateTime('2026-13-01T10:30:00Z');
			expect(result.valid).toBe(false);
		});

		it('should reject day out of range (32)', () => {
			const result = validateIso8601DateTime('2026-01-32T10:30:00Z');
			expect(result.valid).toBe(false);
		});

		it('should reject hour out of range (25)', () => {
			const result = validateIso8601DateTime('2026-01-22T25:00:00Z');
			expect(result.valid).toBe(false);
		});

		it('should accept negative UTC offset', () => {
			const result = validateIso8601DateTime('2026-01-22T10:30:00-05:00');
			expect(result.valid).toBe(true);
		});

		it('should accept milliseconds with timezone offset', () => {
			const result = validateIso8601DateTime('2026-01-22T10:30:00.999+02:00');
			expect(result.valid).toBe(true);
		});
	});

	describe('validateMaintenanceWindow', () => {
		it('should accept valid maintenance window (future times)', () => {
			const start = new Date(Date.now() + 86400000).toISOString(); // +1 day
			const end = new Date(Date.now() + 172800000).toISOString(); // +2 days

			const result = validateMaintenanceWindow(start, end);
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should accept valid maintenance window (same day)', () => {
			const start = new Date(Date.now() + 86400000).toISOString(); // +1 day
			const end = new Date(Date.now() + 90000000).toISOString(); // +1 day + 1 hour

			const result = validateMaintenanceWindow(start, end);
			expect(result.valid).toBe(true);
		});

		it('should reject start time in the past', () => {
			const start = new Date(Date.now() - 86400000).toISOString(); // -1 day
			const end = new Date(Date.now() + 86400000).toISOString(); // +1 day

			const result = validateMaintenanceWindow(start, end);
			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.includes('cannot be in the past'))).toBe(true);
		});

		it('should reject start time after end time', () => {
			const start = new Date(Date.now() + 172800000).toISOString(); // +2 days
			const end = new Date(Date.now() + 86400000).toISOString(); // +1 day

			const result = validateMaintenanceWindow(start, end);
			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.includes('must be before end time'))).toBe(true);
		});

		it('should reject start time equal to end time', () => {
			const time = new Date(Date.now() + 86400000).toISOString();

			const result = validateMaintenanceWindow(time, time);
			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.includes('must be before end time'))).toBe(true);
		});

		it('should reject invalid start time format', () => {
			const result = validateMaintenanceWindow(
				'invalid-date',
				new Date(Date.now() + 86400000).toISOString(),
			);
			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.includes('Start time'))).toBe(true);
		});

		it('should reject invalid end time format', () => {
			const result = validateMaintenanceWindow(
				new Date(Date.now() + 86400000).toISOString(),
				'invalid-date',
			);
			expect(result.valid).toBe(false);
			expect(result.errors.some((e) => e.includes('End time'))).toBe(true);
		});

		it('should collect multiple errors', () => {
			const result = validateMaintenanceWindow('invalid-start', 'invalid-end');
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe('extractResourceLocatorValue', () => {
		it('should extract value from string (legacy format)', () => {
			const result = extractResourceLocatorValue('12345678-1234-1234-1234-123456789012');
			expect(result).toBe('12345678-1234-1234-1234-123456789012');
		});

		it('should extract value from resourceLocator object', () => {
			const result = extractResourceLocatorValue({
				mode: 'list',
				value: '12345678-1234-1234-1234-123456789012',
			});
			expect(result).toBe('12345678-1234-1234-1234-123456789012');
		});

		it('should extract value from resourceLocator with id mode', () => {
			const result = extractResourceLocatorValue({
				mode: 'id',
				value: 'abcdef12-abcd-abcd-abcd-abcdefabcdef',
			});
			expect(result).toBe('abcdef12-abcd-abcd-abcd-abcdefabcdef');
		});

		it('should return empty string for null', () => {
			const result = extractResourceLocatorValue(null);
			expect(result).toBe('');
		});

		it('should return empty string for undefined', () => {
			const result = extractResourceLocatorValue(undefined);
			expect(result).toBe('');
		});

		it('should return empty string for object without value', () => {
			const result = extractResourceLocatorValue({ mode: 'list' });
			expect(result).toBe('');
		});

		it('should return empty string for empty string', () => {
			const result = extractResourceLocatorValue('');
			expect(result).toBe('');
		});

		it('should handle whitespace in string value', () => {
			const result = extractResourceLocatorValue('  12345678-1234-1234-1234-123456789012  ');
			expect(result).toBe('12345678-1234-1234-1234-123456789012');
		});

		it('should handle whitespace in object value', () => {
			const result = extractResourceLocatorValue({
				mode: 'list',
				value: '  12345678-1234-1234-1234-123456789012  ',
			});
			expect(result).toBe('12345678-1234-1234-1234-123456789012');
		});
	});
});

describe('validateRfc6902Patch()', () => {
	it('should accept a valid replace operation', () => {
		const result = validateRfc6902Patch([{ op: 'replace', path: '/enabled', value: true }]);
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('should accept a valid add operation', () => {
		const result = validateRfc6902Patch([{ op: 'add', path: '/tags/0', value: 'new-tag' }]);
		expect(result.valid).toBe(true);
	});

	it('should accept a valid remove operation (no value required)', () => {
		const result = validateRfc6902Patch([{ op: 'remove', path: '/tags/0' }]);
		expect(result.valid).toBe(true);
	});

	it('should accept a valid move operation with from', () => {
		const result = validateRfc6902Patch([{ op: 'move', path: '/a/b', from: '/a/c' }]);
		expect(result.valid).toBe(true);
	});

	it('should accept a valid copy operation with from', () => {
		const result = validateRfc6902Patch([{ op: 'copy', path: '/a/b', from: '/a/c' }]);
		expect(result.valid).toBe(true);
	});

	it('should accept a valid test operation', () => {
		const result = validateRfc6902Patch([{ op: 'test', path: '/enabled', value: true }]);
		expect(result.valid).toBe(true);
	});

	it('should reject non-array input', () => {
		const result = validateRfc6902Patch({ op: 'replace', path: '/x', value: 1 });
		expect(result.valid).toBe(false);
		expect(result.errors[0]).toMatch(/must be a JSON array/);
	});

	it('should reject empty array', () => {
		const result = validateRfc6902Patch([]);
		expect(result.valid).toBe(false);
		expect(result.errors[0]).toMatch(/at least one operation/i);
	});

	it('should reject invalid op value', () => {
		const result = validateRfc6902Patch([{ op: 'update', path: '/x', value: 1 }]);
		expect(result.valid).toBe(false);
		expect(result.errors[0]).toMatch(/"op" must be one of/);
	});

	it('should reject path not starting with /', () => {
		const result = validateRfc6902Patch([{ op: 'replace', path: 'enabled', value: true }]);
		expect(result.valid).toBe(false);
		expect(result.errors[0]).toMatch(/"path" must be a string starting with/);
	});

	it('should reject replace without value', () => {
		const result = validateRfc6902Patch([{ op: 'replace', path: '/x' }]);
		expect(result.valid).toBe(false);
		expect(result.errors[0]).toMatch(/"value" is required for "replace"/);
	});

	it('should reject add without value', () => {
		const result = validateRfc6902Patch([{ op: 'add', path: '/x' }]);
		expect(result.valid).toBe(false);
		expect(result.errors[0]).toMatch(/"value" is required for "add"/);
	});

	it('should reject move without from', () => {
		const result = validateRfc6902Patch([{ op: 'move', path: '/a/b' }]);
		expect(result.valid).toBe(false);
		expect(result.errors[0]).toMatch(/"from" must be a string/);
	});

	it('should reject copy without from', () => {
		const result = validateRfc6902Patch([{ op: 'copy', path: '/a/b' }]);
		expect(result.valid).toBe(false);
		expect(result.errors[0]).toMatch(/"from" must be a string/);
	});

	it('should collect errors from multiple invalid operations', () => {
		const result = validateRfc6902Patch([
			{ op: 'replace', path: '/x' },        // missing value
			{ op: 'bad-op', path: '/y', value: 1 }, // invalid op
		]);
		expect(result.valid).toBe(false);
		expect(result.errors).toHaveLength(2);
	});

	it('should reject non-object items in the array', () => {
		const result = validateRfc6902Patch(['not-an-object']);
		expect(result.valid).toBe(false);
		expect(result.errors[0]).toMatch(/must be an object/);
	});

	describe('normalizeBaseUrl', () => {
		it('should leave a clean URL unchanged', () => {
			expect(normalizeBaseUrl('https://bms:444/bconnect')).toBe('https://bms:444/bconnect');
		});

		it('should trim surrounding whitespace (#34)', () => {
			expect(normalizeBaseUrl('  https://bms:444/bconnect \t\n')).toBe('https://bms:444/bconnect');
		});

		it('should drop trailing slashes', () => {
			expect(normalizeBaseUrl('https://bms:444/bconnect/')).toBe('https://bms:444/bconnect');
			expect(normalizeBaseUrl('https://bms:444/bconnect///')).toBe('https://bms:444/bconnect');
		});

		it('should handle whitespace and a trailing slash together', () => {
			expect(normalizeBaseUrl('https://bms:444/bconnect/ ')).toBe('https://bms:444/bconnect');
		});

		it('should return an empty string for missing values', () => {
			expect(normalizeBaseUrl(undefined)).toBe('');
			expect(normalizeBaseUrl(null)).toBe('');
		});
	});
});
