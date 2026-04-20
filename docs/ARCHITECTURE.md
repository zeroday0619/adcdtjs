# Architecture

This document explains how the AEJIS certificate generator is organized, how data moves through the app, and how the codebase separates UI concerns from reusable logic.

## Overview

AEJIS is a Next.js App Router application that lets users fill out a parody medical certificate form, preview the result as a PDF, and print the final document from the browser.

At a high level, the architecture is split into four layers:

- Route and metadata entrypoints in `app/`
- UI components in `components/`
- Certificate application and domain logic in `lib/certificate/`
- Shared site-level metadata helpers in `lib/site.ts`

## Design Principles

### Reuse through object boundaries

- Encapsulated construction: Shared behavior is grouped into dedicated objects so route files and UI layers consume stable interfaces instead of rebuilding the same logic.
- Dependency injection: Higher-level workflows receive collaborators through constructors, which keeps implementations swappable and reduces tight coupling.
- Single source of truth: Metadata, certificate output behavior, and workflow coordination are defined once and reused across multiple entrypoints.
- Open for extension: New renderers, platforms, or metadata producers can be introduced by composing new objects instead of rewriting existing consumers.

### Platform-aware certificate output

- Service abstraction: Certificate generation and output behavior are coordinated through dedicated service and platform layers.
- Runtime adaptation: Browser capabilities are detected at runtime so preview generation, printing, and file handling can follow the active environment.
- Extensible output flow: New rendering or delivery strategies can be added without rewriting the form or state logic.
- User-first fallback behavior: The app degrades gracefully when preview rendering or printing is temporarily unavailable.

### Responsive client-side workflow

- Live preview pipeline: Form updates are transformed into print data and rendered into a PDF preview as the user edits.
- Non-blocking interactions: Preview rendering and print actions run asynchronously to keep the UI responsive.
- Separated concerns: User input, preview generation, and print execution are handled as distinct steps in the workflow.
- Predictable updates: React state transitions ensure the preview and issued certificate state stay synchronized.

### Performance-aware preview rendering

- Deferred preview state: The live form state is separated from the preview-rendering state so heavy PDF work does not block typing.
- Buffered regeneration: Preview rendering is intentionally delayed for a short idle window to avoid regenerating the PDF on every keystroke.
- Workflow-based coordination: Preview generation and URL lifecycle management are centralized in reusable workflow objects instead of being scattered across UI components.
- Render cost isolation: Expensive PDF document generation is treated as a background-style operation, while the interactive form remains the highest-priority UI path.

### Modular application structure

- Clear boundaries: Domain formatting, state management, rendering, and UI components each have focused responsibilities.
- Dependency-driven design: Higher-level services receive renderer and platform implementations instead of hard-coding them.
- Reusable domain layer: Certificate data factories, constants, and formatters are isolated from presentation code.
- Maintainable growth: New certificate rules, fields, or UI behaviors can be added with minimal impact on unrelated modules.

## Module Organization

### Route layer

- `app/page.tsx`, `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`: Thin Next.js entrypoints that re-export the actual route and metadata implementations.
- `app/(site)/`: Route-facing `.tsx` implementations for the main site layout and page.
- `app/social/`: Social image generation implementations.
- `app/metadata/`: Non-visual metadata route implementations such as `robots` and `sitemap`.
- `app/globals.css`: Global styling and theme-level presentation rules.

### UI layer

- `components/certificate-builder.tsx`: Thin client entrypoint for the certificate builder experience.
- `components/certificate-builder-shell.tsx`: Presentational shell that assembles the page header, form, preview pane, and footer.
- `components/certificate-form.tsx`: Input form for patient details and certificate options.
- `components/certificate-preview-pane.tsx`: Embedded PDF preview container.
- `components/certificate-print-document.tsx`: Print-oriented certificate document rendering.

### Domain and application logic layer

- `lib/certificate/app/`: Feature-level orchestration hooks, reusable workflows, and service factories for the certificate builder flow.
- `lib/certificate/domain/`: Certificate defaults, types, constants, factories, and formatting logic.
- `lib/certificate/state/`: Reducer-based state management for editing, issuing, previewing, and printing certificates.
- `lib/certificate/services/`: PDF rendering and output orchestration.
- `lib/certificate/platform/`: Runtime platform detection and browser-specific output behavior.
- `lib/site.ts`: Site metadata, canonical origin helpers, and reusable document-factory logic used by route metadata.

Representative reusable objects:

- `SiteDocumentFactory`: Centralizes site metadata, structured data, `robots`, and `sitemap` generation behind one reusable object boundary.
- `CertificateBuilderWorkflow`: Coordinates certificate preview and print preparation so the React hook can stay focused on UI lifecycle integration.
- `CertificateFormCatalog`: Centralizes reusable form field labels, options, and display rules so the form component can render from shared definitions instead of hard-coded JSX literals.

## File Placement Rules

### Directory-first organization

This project uses directory responsibility as the primary way to separate file types.

- `app/` contains route entrypoints, metadata routes, and framework-facing files.
- Within `app/`, route-facing `.tsx` implementations are grouped into subdirectories such as `app/(site)/` and `app/social/`, while non-visual metadata `.ts` implementations live in `app/metadata/`.
- `components/` contains React UI components and presentation-specific logic.
- `lib/` contains reusable logic that should stay independent from page rendering concerns.

This means file extension choices are not arbitrary. They follow the role of the directory and the responsibility of the file.

### When to use `.tsx`

Use `.tsx` for files that render JSX or define React-driven UI entrypoints.

### When to use `.ts`

Use `.ts` for files that do not return JSX and instead provide data, logic, orchestration, or platform behavior.

### Practical rule of thumb

- If a file renders JSX, keep it in a UI-oriented directory and use `.tsx`.
- If a file handles data shaping, state transitions, formatting, service coordination, or platform behavior, keep it in `lib/` or a non-visual route file and use `.ts`.

This separation makes the codebase easier to scan because rendering concerns stay close to the UI, while reusable logic remains isolated from presentation code.

## Extension Guidelines

- Add new form inputs in the UI layer first, then extend the domain types and state reducer as needed.
- Keep formatting rules and certificate value normalization inside `lib/certificate/domain/`.
- Keep output-specific behavior inside `services/` or `platform/`, not inside presentational components.
- Prefer introducing reusable objects around shared behavior before duplicating orchestration logic across hooks, routes, or components.
- Keep field labels, option lists, and form display rules in reusable objects when multiple parts of the UI may depend on the same semantics.
- When adding heavy preview features, preserve deferred and buffered rendering so interactive typing stays responsive.
- Prefer adding new reusable logic to `lib/` rather than embedding it directly into route files or UI components.
