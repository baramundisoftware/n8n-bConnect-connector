/**
 * Validation Utilities for baramundi n8n Node
 *
 * Provides validation functions for user input parameters
 * All functions return ValidationResult with errors array
 */

export interface ValidationResult {
	valid: boolean;
	errors: string[];
}

/**
 * Validate GUID format (UUID v4 pattern)
 * @param value - The GUID string to validate
 * @returns ValidationResult with valid flag and error messages
 */
export function validateGuid(value: string): ValidationResult {
	const guidRegex =
		/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

	if (!value || typeof value !== 'string') {
		return { valid: false, errors: ['GUID is required'] };
	}

	const trimmedValue = value.trim();

	if (!guidRegex.test(trimmedValue)) {
		return {
			valid: false,
			errors: [
				`"${value}" is not a valid GUID format (expected: 12345678-1234-1234-1234-123456789012)`,
			],
		};
	}

	return { valid: true, errors: [] };
}

/**
 * Validate comma-separated list of GUIDs
 * @param value - Comma-separated GUID string
 * @returns ValidationResult with all GUID validation errors
 */
export function validateGuidList(value: string): ValidationResult {
	const errors: string[] = [];
	const guids = value
		.split(',')
		.map((g) => g.trim())
		.filter((g) => g.length > 0);

	if (guids.length === 0) {
		return { valid: false, errors: ['At least one GUID is required'] };
	}

	for (const guid of guids) {
		const result = validateGuid(guid);
		if (!result.valid) {
			errors.push(...result.errors);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validate display name for endpoints, jobs, etc.
 * Rules: 1-255 characters, no invalid Windows filename characters
 * @param name - The display name to validate
 * @returns ValidationResult
 */
export function validateDisplayName(name: string): ValidationResult {
	const errors: string[] = [];

	if (!name || name.trim().length === 0) {
		errors.push('Display name cannot be empty');
	}

	if (name && name.length > 255) {
		errors.push('Display name must be 255 characters or less');
	}

	// Windows filename invalid characters: < > : " / \ | ? *
	const invalidChars = /[<>:"/\\|?*]/;
	if (name && invalidChars.test(name)) {
		errors.push('Display name contains invalid characters: < > : " / \\ | ? *');
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Validate email address format
 * @param email - The email address to validate
 * @returns ValidationResult
 */
export function validateEmail(email: string): ValidationResult {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	if (!email || typeof email !== 'string') {
		return { valid: false, errors: ['Email address is required'] };
	}

	if (!emailRegex.test(email)) {
		return {
			valid: false,
			errors: [`"${email}" is not a valid email address`],
		};
	}

	return { valid: true, errors: [] };
}

/**
 * Validate MAC address format (IEEE MAC-48)
 * Format: XX:XX:XX:XX:XX:XX (hex octets separated by colons)
 * @param mac - The MAC address to validate
 * @returns ValidationResult
 */
export function validateMacAddress(mac: string): ValidationResult {
	const macRegex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;

	if (!mac || typeof mac !== 'string') {
		return { valid: false, errors: ['MAC address is required'] };
	}

	if (!macRegex.test(mac)) {
		return {
			valid: false,
			errors: [`"${mac}" is not a valid MAC address (expected format: AA:BB:CC:DD:EE:FF)`],
		};
	}

	return { valid: true, errors: [] };
}

/**
 * Validate IPv4 address format
 * @param ip - The IP address to validate
 * @returns ValidationResult
 */
export function validateIpv4Address(ip: string): ValidationResult {
	const ipv4Regex =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

	if (!ip || typeof ip !== 'string') {
		return { valid: false, errors: ['IP address is required'] };
	}

	if (!ipv4Regex.test(ip)) {
		return {
			valid: false,
			errors: [`"${ip}" is not a valid IPv4 address (expected format: 192.168.1.1)`],
		};
	}

	return { valid: true, errors: [] };
}

/**
 * Validate ISO 8601 date/time format
 * @param value - The date/time string to validate
 * @returns ValidationResult
 */
export function validateIso8601DateTime(value: string): ValidationResult {
	if (!value || typeof value !== 'string') {
		return { valid: false, errors: ['Date/time is required'] };
	}

	try {
		const date = new Date(value);
		if (isNaN(date.getTime())) {
			return {
				valid: false,
				errors: [
					`"${value}" is not a valid ISO 8601 date/time (expected format: 2026-01-22T10:30:00Z)`,
				],
			};
		}
		return { valid: true, errors: [] };
	} catch (error) {
		return {
			valid: false,
			errors: [
				`"${value}" is not a valid ISO 8601 date/time (expected format: 2026-01-22T10:30:00Z)`,
			],
		};
	}
}

/**
 * Validate maintenance window times
 * Checks:
 * - Both times are valid ISO 8601
 * - Start time is before end time
 * - Start time is not in the past
 * @param startTime - Start time in ISO 8601 format
 * @param endTime - End time in ISO 8601 format
 * @returns ValidationResult with all validation errors
 */
export function validateMaintenanceWindow(
	startTime: string,
	endTime: string,
): ValidationResult {
	const errors: string[] = [];

	// Validate formats
	const startResult = validateIso8601DateTime(startTime);
	const endResult = validateIso8601DateTime(endTime);

	if (!startResult.valid) {
		errors.push(`Start time: ${startResult.errors.join(', ')}`);
	}

	if (!endResult.valid) {
		errors.push(`End time: ${endResult.errors.join(', ')}`);
	}

	// If formats are valid, check business rules
	if (startResult.valid && endResult.valid) {
		const start = new Date(startTime);
		const end = new Date(endTime);
		const now = new Date();

		// Check start < end
		if (start >= end) {
			errors.push('Start time must be before end time');
		}

		// Check start is not in the past
		if (start < now) {
			errors.push('Start time cannot be in the past');
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

const RFC6902_OPS = new Set(['add', 'remove', 'replace', 'move', 'copy', 'test']);

/**
 * Validate a JSON Patch document against RFC 6902.
 * Each operation must have an `op` (add|remove|replace|move|copy|test),
 * a `path` string starting with "/", and (where required) a `value` field.
 * @param operations - Parsed array of patch operations
 * @returns ValidationResult
 */
export function validateRfc6902Patch(operations: unknown): ValidationResult {
	const errors: string[] = [];

	if (!Array.isArray(operations)) {
		return { valid: false, errors: ['Patch body must be a JSON array of operations'] };
	}

	if (operations.length === 0) {
		return { valid: false, errors: ['Patch body must contain at least one operation'] };
	}

	for (let i = 0; i < operations.length; i++) {
		const op = operations[i] as Record<string, unknown>;
		const prefix = `Operation [${i}]`;

		if (typeof op !== 'object' || op === null || Array.isArray(op)) {
			errors.push(`${prefix}: must be an object`);
			continue;
		}

		if (typeof op.op !== 'string' || !RFC6902_OPS.has(op.op)) {
			errors.push(
				`${prefix}: "op" must be one of ${[...RFC6902_OPS].join(', ')} (got: ${JSON.stringify(op.op)})`,
			);
		}

		if (typeof op.path !== 'string' || !op.path.startsWith('/')) {
			errors.push(`${prefix}: "path" must be a string starting with "/" (got: ${JSON.stringify(op.path)})`);
		}

		const opStr = typeof op.op === 'string' ? op.op : '';
		if (['add', 'replace', 'test'].includes(opStr) && !('value' in op)) {
			errors.push(`${prefix}: "value" is required for "${opStr}" operations`);
		}

		if (['move', 'copy'].includes(opStr) && typeof op.from !== 'string') {
			errors.push(`${prefix}: "from" must be a string for "${opStr}" operations`);
		}
	}

	return { valid: errors.length === 0, errors };
}

/**
 * Extract value from resourceLocator or string parameter
 * Handles both legacy string format and new resourceLocator object format
 * @param value - Either a string GUID or resourceLocator object
 * @returns Extracted GUID string (trimmed), or empty string if invalid
 */
export function extractResourceLocatorValue(value: any): string {
	// Handle null/undefined
	if (value === null || value === undefined) {
		return '';
	}

	// Handle legacy string format
	if (typeof value === 'string') {
		return value.trim();
	}

	// Handle new resourceLocator object format
	if (typeof value === 'object' && value.value) {
		return typeof value.value === 'string' ? value.value.trim() : '';
	}

	return '';
}
