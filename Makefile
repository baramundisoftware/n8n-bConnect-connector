# Convenience targets. The canonical tooling is npm scripts (see package.json).
# CI and release run LOCALLY on a maintainer machine — this repo has no GitHub
# Actions workflows (avoids the Actions billing requirement; matches bConnect-MCP).
.PHONY: ci build lint test audit release release-dry publish clean

# Full local CI — mirrors the old ci.yml build-and-test job.
ci:
	npm ci
	npm run lint
	npm run build
	npm run test:unit
	npm audit --omit=dev --audit-level=critical

build:
	npm run build

lint:
	npm run lint

test:
	npm run test:unit

audit:
	npm audit --omit=dev --audit-level=critical

# Local release artifact — mirrors the old release.yml. Produces the npm tarball,
# its SHA-256 checksum, and the CycloneDX SBOM. Attach the .tgz + .sha256 + sbom.json
# to the GitHub Release by hand (create it with: gh release create vX.Y.Z ...).
release: ci
	npm run sbom
	npm run license-check
	npm pack
	@tgz=$$(ls -t *.tgz | head -1); \
	sha256sum "$$tgz" > "$$tgz.sha256"; \
	echo ""; \
	echo "Release artifacts ready:"; \
	echo "  $$tgz"; \
	echo "  $$tgz.sha256"; \
	echo "  sbom.json"

# Validation only — build + pack without writing a real tarball.
release-dry: ci
	npm run sbom
	npm pack --dry-run

# Publish to the npm registry (requires `npm login`). Runs prepublishOnly (build).
publish: ci
	npm publish

clean:
	rm -f *.tgz *.tgz.sha256 sbom.json
