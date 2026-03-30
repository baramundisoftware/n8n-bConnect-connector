#!/usr/bin/env python3
"""
Analyze n8n connector implementation coverage against bConnect OpenAPI specifications
"""

import json
import os
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

def get_n8n_implemented_operations(action_dir):
    """Get list of operations implemented in n8n action"""
    operations = []

    # Check if fields file exists
    fields_file = os.path.join(action_dir, f"{os.path.basename(action_dir)}.fields.ts")
    if not os.path.exists(fields_file):
        return operations

    try:
        with open(fields_file, 'r') as f:
            content = f.read()

        # Look for operation options
        if "'Get All'" in content or '"Get All"' in content:
            operations.append('GET_ALL')
        if "'Get'" in content or '"Get"' in content:
            operations.append('GET')
        if "'Create'" in content or '"Create"' in content:
            operations.append('CREATE')
        if "'Update'" in content or '"Update"' in content:
            operations.append('UPDATE')
        if "'Delete'" in content or '"Delete"' in content:
            operations.append('DELETE')

    except Exception as e:
        print(f"Error reading {fields_file}: {e}")

    return operations

def map_operation_to_endpoint(operation_id, method):
    """Map OpenAPI operationId to n8n operation type"""
    operation_id_lower = operation_id.lower()

    if 'get' in operation_id_lower and method == 'GET':
        if operation_id_lower.startswith('get') and operation_id_lower.endswith('s'):
            return 'GET_ALL'
        return 'GET'
    elif 'create' in operation_id_lower or method == 'POST':
        return 'CREATE'
    elif 'update' in operation_id_lower or method in ['PUT', 'PATCH']:
        return 'UPDATE'
    elif 'delete' in operation_id_lower or method == 'DELETE':
        return 'DELETE'

    return None

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
            if module_lower in action_dir.lower() or action_dir.lower() in module_lower:
                n8n_dir = action_path
                break

    # Get n8n implemented operations
    n8n_operations = []
    if n8n_dir:
        n8n_operations = get_n8n_implemented_operations(n8n_dir)

    # Compare
    implemented = []
    missing = []

    for endpoint in endpoints:
        operation_type = map_operation_to_endpoint(endpoint['operationId'], endpoint['method'])

        if operation_type and operation_type in n8n_operations:
            implemented.append(endpoint)
        else:
            missing.append(endpoint)

    return {
        'module': module_name,
        'n8n_dir': os.path.basename(n8n_dir) if n8n_dir else None,
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
    print(f"- Total API Endpoints: {total_endpoints}")
    print(f"- Implemented in n8n: {total_implemented}")
    print(f"- Missing from n8n: {total_missing}")
    print(f"- Coverage: {(total_implemented/total_endpoints*100):.1f}%")
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
        print(f"n8n Action: `{n8n_dir}`")
        print(f"Coverage: {impl_count}/{total} ({coverage:.1f}%)")
        print()

        if result['implemented']:
            print(f"### Implemented Endpoints ({impl_count}/{total})")
            print()
            for ep in result['implemented']:
                print(f"- {ep['method']} `{ep['path']}` - {ep['summary']}")
                if ep['operationId']:
                    print(f"  - OperationId: `{ep['operationId']}`")
            print()

        if result['missing']:
            print(f"### Missing Endpoints ({miss_count}/{total})")
            print()
            for ep in result['missing']:
                print(f"- {ep['method']} `{ep['path']}` - {ep['summary']}")
                if ep['operationId']:
                    print(f"  - OperationId: `{ep['operationId']}`")
            print()

        print("---")
        print()

if __name__ == '__main__':
    main()
