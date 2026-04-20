# AGENTS

This repository uses [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) as the primary source of truth for code organization and refactoring decisions.

## Instructions for Agents

- Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) before making structural changes.
- Follow the documented module boundaries between `app/`, `components/`, and `lib/`.
- Prefer reusing existing workflows, catalogs, services, and factories instead of duplicating orchestration logic.
- Keep UI rendering concerns in `.tsx` files and reusable non-visual logic in `.ts` files, following the architecture guide.
- Preserve the documented performance strategy for PDF preview rendering, including deferred and buffered updates.
- When adding new abstractions, align them with the reuse and object-boundary principles described in the architecture document.

## Priority

If an implementation choice is unclear, prefer the approach that is most consistent with [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
