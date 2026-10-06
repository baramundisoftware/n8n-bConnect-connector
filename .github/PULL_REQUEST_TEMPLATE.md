## What and why

<!-- One topic per PR. What does it change, and why? -->

Closes #

## Scope

- [ ] **One topic.** Unrelated changes are in separate PRs.
- [ ] **Small:** roughly 400 changed lines or fewer (generated files excluded). Larger work started as an accepted change-proposal issue and is split.
- [ ] Linked to an issue a maintainer has accepted (not needed for typo/doc fixes).

## Checks

- [ ] `npm run ci` passes locally (lint, build, unit tests, audit).
- [ ] New or changed operations have a unit test.
- [ ] Docs updated where operations, parameters or credentials changed.
- [ ] Version gating (`bmsVersion`) is correct for 25R2 / 26R1.

## Security

- [ ] No credentials, tokens, estate data or internal URLs in code, tests, fixtures, example workflows or this description.
- [ ] ID fields go through `extractResourceLocatorValue()` and GUID validation.
