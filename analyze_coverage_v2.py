#!/usr/bin/env python3
"""
Analyze n8n connector implementation coverage against bConnect OpenAPI specifications
Version 2: Improved accuracy by reading actual n8n field definitions
"""

import json
import os
import re
from pathlib import Path
from collections import defaultdict

# OpenAPI spec directory
OPENAPI_DIR = "/home/ansible/claudinno/bConnect-MCP/openapi-specs"
# n8n actions directory
N8N_ACTIONS_DIR = "/home/ansible/claudinno/n8nconnector/nodes/Baramundi/actions"

def parse_openapi_spec(spec_file):
    """Parse OpenAPI spec and extract all endpoints"""
    with open(spec_file, 'r') as f:
        spec = json.load(f)

    endpoints = []
    paths = spec.get('paths', {})

    for path, methods in paths.items():
        for method, details in methods.items():
            if method.upper() in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']:
                endpoint = {
                    'method': method.upper(),
                    'path': path,
                    'operationId': details.get('operationId', ''),
                    'summary': details.get('summary', ''),
                    'tags': details.get('tags', [])
                }
                endpoints.append(endpoint)

    return endpoints

def get_n8n_operations_from_fields_file(fields_file):
    """Extract operation names from n8n fields.ts file"""
    operations = set()

    if not os.path.exists(fields_file):
        return operations

    try:
        with open(fields_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find all operation values using regex
        # Pattern: value: 'operationName' or value: "operationName"
        value_pattern = r"value:\s*['\"]([^'\"]+)['\"]"
        matches = re.findall(value_pattern, content)

        for match in matches:
            operations.add(match)

    except Exception as e:
        print(f"Error reading {fields_file}: {e}")

    return operations

def normalize_operation_id(operation_id):
    """Normalize operationId to match n8n naming convention"""
    # Convert from PascalCase to camelCase
    if operation_id and len(operation_id) > 0:
        return operation_id[0].lower() + operation_id[1:]
    return operation_id

def check_operation_implemented(operation_id, n8n_operations):
    """Check if an OpenAPI operation is implemented in n8n"""
    # Try exact match (camelCase)
    normalized = normalize_operation_id(operation_id)

    if normalized in n8n_operations:
        return True

    # Try case-insensitive match
    normalized_lower = normalized.lower()
    for n8n_op in n8n_operations:
        if n8n_op.lower() == normalized_lower:
            return True

    # Try partial match (for compound operations)
    for n8n_op in n8n_operations:
        if normalized_lower in n8n_op.lower() or n8n_op.lower() in normalized_lower:
            return True

    return False

def analyze_module(module_name, spec_file):
    """Analyze a single module"""
    # Parse OpenAPI spec
    endpoints = parse_openapi_spec(spec_file)

    # Find corresponding n8n action directory
    n8n_dir = None
    module_lower = module_name.lower()

    for action_dir in os.listdir(N8N_ACTIONS_DIR):
        action_path = os.path.join(N8N_ACTIONS_DIR, action_dir)
        if os.path.isdir(action_path):
            action_dir_lower = action_dir.lower()
            # Match by module name or common patterns
            if (module_lower in action_dir_lower or
                action_dir_lower in module_lower or
                (module_lower == 'activedirectory' and action_dir_lower == 'activedirectory') or
                (module_lower == 'operatingsystems' and action_dir_lower == 'operatingsystem') or
                (module_lower == 'variables' and action_dir_lower == 'variable')):
                n8n_dir = action_path
                break

    # Get n8n implemented operations
    n8n_operations = set()
    if n8n_dir:
        fields_file = os.path.join(n8n_dir, f"{os.path.basename(n8n_dir)}.fields.ts")
        n8n_operations = get_n8n_operations_from_fields_file(fields_file)

    # Compare
    implemented = []
    missing = []

    for endpoint in endpoints:
        if check_operation_implemented(endpoint['operationId'], n8n_operations):
            implemented.append(endpoint)
        else:
            missing.append(endpoint)

    return {
        'module': module_name,
        'n8n_dir': os.path.basename(n8n_dir) if n8n_dir else None,
        'n8n_operations': sorted(list(n8n_operations)),
        'total_endpoints': len(endpoints),
        'implemented': implemented,
        'missing': missing,
        'endpoints': endpoints
    }

def main():
    """Main analysis"""

    # Map of OpenAPI files to module names
    specs = {
        'bConnect_Jobs.json': 'Jobs',
        'bConnect_Endpoints.json': 'Endpoints',
        'bConnect_Assets.json': 'Assets',
        'bConnect_ActiveDirectory.json': 'ActiveDirectory',
        'bConnect_DefenseControl.json': 'DefenseControl',
        'bConnect_OperatingSystems.json': 'OperatingSystems',
        'bConnect_ServerManagement.json': 'ServerManagement',
        'bConnect_Software.json': 'Software',
        'bConnect_UpdateManagement.json': 'UpdateManagement',
        'bConnect_Variables.json': 'Variables'
    }

    results = []
    total_endpoints = 0
    total_implemented = 0
    total_missing = 0

    for spec_file, module_name in specs.items():
        spec_path = os.path.join(OPENAPI_DIR, spec_file)
        if os.path.exists(spec_path):
            result = analyze_module(module_name, spec_path)
            results.append(result)

            total_endpoints += result['total_endpoints']
            total_implemented += len(result['implemented'])
            total_missing += len(result['missing'])

    # Generate report
    print("# bConnect n8n Connector Coverage Analysis")
    print()
    print("## Executive Summary")
    print()
    print(f"- **Total API Endpoints**: {total_endpoints}")
    print(f"- **Implemented in n8n**: {total_implemented}")
    print(f"- **Missing from n8n**: {total_missing}")
    print(f"- **Coverage**: {(total_implemented/total_endpoints*100):.1f}%")
    print()
    print("---")
    print()

    # Detailed report by module
    for result in sorted(results, key=lambda x: x['module']):
        module = result['module']
        n8n_dir = result['n8n_dir'] or 'NOT FOUND'
        total = result['total_endpoints']
        impl_count = len(result['implemented'])
        miss_count = len(result['missing'])
        coverage = (impl_count / total * 100) if total > 0 else 0

        print(f"## {module}")
        print(f"**n8n Action**: `{n8n_dir}`")
        print()
        print(f"**Coverage**: {impl_count}/{total} ({coverage:.1f}%)")
        print()

        if result['n8n_operations']:
            print(f"**n8n Operations Found** ({len(result['n8n_operations'])}):")
            for op in result['n8n_operations']:
                print(f"- `{op}`")
            print()

        if result['implemented']:
            print(f"### Implemented Endpoints ({impl_count}/{total})")
            print()
            for ep in result['implemented']:
                print(f"- **{ep['method']}** `{ep['path']}`")
                print(f"  - {ep['summary']}")
                print(f"  - OperationId: `{ep['operationId']}`")
            print()

        if result['missing']:
            print(f"### Missing Endpoints ({miss_count}/{total})")
            print()
            for ep in result['missing']:
                print(f"- **{ep['method']}** `{ep['path']}`")
                print(f"  - {ep['summary']}")
                print(f"  - OperationId: `{ep['operationId']}`")
            print()

        print("---")
        print()

if __name__ == '__main__':
    main()
