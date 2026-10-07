# Convenience targets. The canonical tooling is npm scripts (see package.json).
# `make ci` is the local equivalent of the `gate` job in .github/workflows/ci.yml.
# Release artifacts are still built locally (`make release`).
.PHONY: ci build lint test audit release release-dry publish clean

# Full local CI — mirrors the ci.yml `gate` job, plus the runtime audit.
ci:
	npm ci
	npm run lint
	npm run build
	npm run test:coverage
	npm audit --omit=dev --audit-level=critical

build:
	npm run build

lint:
	npm run lint

test:
	npm run test:unit

audit:
	npm audit --omit=dev --audit-level=critical

# Local release artifact. Produces the npm tarball,
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
# npm publishing runs only in GitHub Actions (.github/workflows/publish.yml): n8n accepts
# community nodes only with an npm provenance statement, which a local publish lacks.
publish:
	@echo "Publishing runs in GitHub Actions on a version tag (.github/workflows/publish.yml)."
	@echo "Use 'make release-dry' to check the package locally."
	@exit 1

clean:
	rm -f *.tgz *.tgz.sha256 sbom.json
