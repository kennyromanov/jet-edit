# JetEdit

Instructions for AI agents working with this repository.

---

## 0) Quick facts about this repository

* Purpose: an **embeddable** text editor UI for editing project documents and templates across different hosts (web, PWA, desktop wrappers, etc.)
* Shape: **UI application packaged as a library**
    * `core/` is a full Vue UI (Router + Layout + Editor + Pinia store), embedded via `createEditor()`
    * `app/` is a thin reference host that mounts `@core` and implements host-side hooks
* Stack (core): `Vue 3`, `TypeScript`, `Pinia`, `Vue Router`, `Vite`, `Tailwind`
* Editor engine: **external** — `vue-edit` / `Tiptap` / `ProseMirror`
* Format boundary (external world): **Handlebars templates** are the canonical “save/load” representation
    * ProseMirror = working foundation
    * Tiptap/Vue Edit = editor abstractions
    * Handlebars = source-of-truth format for storage and interchange

> Agents: before making changes, read `README.md`, `package.json`, `core/src/index.ts`, `core/src/pinia/store/useApp.ts`, `core/src/components/Layout.vue`, `core/src/components/Editor.vue`, `core/src/views/home/Component.vue`, and the example extension in `core/src/flext/modules/test/`.

---

## 1) Agent protocol

1. **Understand the task**
    * Create a concise plan (3–7 steps) and follow it
    * Follow the PRD / ticket requirements strictly. Don’t “improve the product” beyond scope
2. **Minimal diff**
    * Modify only the files and sections required for the task
    * ❌ No mass refactoring, reformatting, or rename waves across unrelated files
3. **Stability is a hard requirement**
    * Preserve editor UX: focus/caret, IME/composition, undo/redo behavior, selection behavior
    * Preserve mounting/unmounting semantics for `createEditor()`
4. **Maintain behavioral contracts**
    * Preserve the public API shape and semantics (`createEditor()` options, return value, defaults)
    * Treat exported types as API
5. **Integration discipline (host hooks)**
    * Core UI must not implement host-specific I/O
    * Any external interactions (file pick, load/save/export, filesystem, platform bridges) must go through **host-implemented hooks** provided to `createEditor()`
    * ❌ No direct file pickers / filesystem calls inside core components unless explicitly required
6. **Build and sanity checks**
    * Run the relevant checks before committing (at minimum: lint + typecheck + build)
7. **Documentation**
    * When behavior changes, update related comments/docs

---

## 2) Architecture and code placement

### 2.1. Public entrypoint and embedding

Responsible for:

* Library entry and initialization (`createEditor()`)
* Registering/bootstrapping Router + Pinia + i18n (if present)
* Connecting core UI to host-side hooks

Requirements:

* `core/src/index.ts` is the **single public integration point**
* The host controls “outside world” behavior via hooks/options
* Avoid breaking changes to exports and types

---

### 2.2. Core UI shell (Router + Layout + Home)

Responsible for:

* Layout composition (sidebar/toolbar/header)
* Document switching UI
* Binding editor UI to Pinia state

Requirements:

* Keep the core flow predictable and centralized
* Don’t scatter stateful side effects across random components
* Prefer the existing structure: `Layout` --> `Home view` --> `Editor wrapper`

---

### 2.3. Editor wrapper (vue-edit / Tiptap)

Responsible for:

* Rendering the editor component
* Providing access to the Tiptap instance where needed
* Bridging Vue UI <--> Tiptap/Vue Edit APIs

Requirements:

* Treat `vue-edit/Tiptap/ProseMirror` as the authoritative implementation for:
    * Selection & caret
    * IME/composition
    * Undo/redo history
    * DOM/contenteditable behavior
* Avoid DOM hacks and manual selection manipulation
* Any changes around `v-model` must preserve:
    * Deterministic caret behavior
    * Composition input stability

---

### 2.4. Document model and format boundaries

There are multiple abstraction layers; keep the boundary clean:

* **ProseMirror** — the working editing foundation (node tree, transactions) (external)
* **Tiptap / Vue Edit** — editor abstractions and commands (external)
* **JetEdit core** — UI and app-level document state (string + meta)
* **Handlebars** — external representation (canonical save/load format)

Requirements:

* In JetEdit state (Pinia), store:
    * Document identity + metadata
    * The **Handlebars string** (or canonical external text format)
* Do **not** pull ProseMirror internal state into Pinia
* Any conversion between formats must be:
    * Explicit
    * Centralized (prefer utilities/services)
    * Covered by a minimal sanity check

---

### 2.5. Commands and UI actions

Current reality:

* The project is context-dependent on the Tiptap instance
* There is currently a single main view (`Home`) where UI actions call `tiptap.commands.*`

Requirements:

* Keep it simple:
    * Calling `tiptap.commands.*` directly from the main view is acceptable
    * ❌ Don’t introduce a command registry, command bus, or elaborate composable architecture unless the PRD explicitly requires it
* If you need to reuse a *small* piece of command logic:
    * Prefer a tiny local helper in the same file
    * Or a simple utility that receives `tiptap` as an argument

---

### 2.6. Extensions (Tiptap / ProseMirror plugins)

Responsible for:

* Adding nodes/marks/input rules/paste rules
* Providing extra commands through Tiptap extension APIs

Requirements:

* New editor behavior should be implemented as **Tiptap extensions** where possible
* Keep extensions modular (one feature per extension folder)
* Avoid “magic” that silently mutates documents

Example reference:

* `core/src/flext/modules/*` — example extension/node

---

### 2.7. Host app (`app/`) as a reference shell

Responsible for:

* Mounting core via `createEditor()`
* Implementing host hooks (select/load/save/export)

Requirements:

* `app/` should stay thin
* Core behavior belongs in `core/`, not in the shell

---

## 3) UX rules

JetEdit UX is the product — especially because it’s embeddable.

### 3.1. Editor stability is critical

* Preserve focus/caret behavior
* Preserve IME/composition stability
* Preserve undo/redo and selection behavior

Requirements:

* Avoid touching editor internals unless the task explicitly requires it
* Any change near:
    * `Editor.vue`
    * `Home view` bindings
    * `document.extra.position` (if used)

…must be validated with a sanity check.

### 3.2. Layout and interaction consistency

* Keep UI controls predictable
* Avoid adding extra modals/toasts/overlays unless required
* Do not change navigation/layout structure casually

---

## 4) State and document lifecycle

The app uses Pinia as the UI-level source of truth.

Requirements:

* Document state must be updated through the store actions (not scattered local state)
* Avoid hidden cross-component state changes
* Keep document switching deterministic:
    * active document id
    * active document content
    * UI reflects that reliably

---

## 5) Build, packaging and platform constraints

JetEdit is shipped as a library and embedded into hosts.

Requirements:

* Avoid breaking changes to exports
* Don’t add heavy dependencies without justification
* Ensure builds remain valid for embedding:
    * library build output
    * types output (if applicable)

---

## 6) Code style

JetEdit code should be **straightforward, explicit, and predictable**.

### 6.1. General principles

* One function — one responsibility
* Prefer early returns instead of deep nesting
* Function size target: **≤40–60 lines**
* Nesting depth: **≤3 levels**
* Prefer named helpers over long inline callbacks

### 6.2. Naming rules

* **Data --> nouns:** `documents`, `document`, `model`, `options`, `paths`, `state`, `val`
* **Actions --> verbs:** `createEditor`, `selectDocument`, `loadDocument`, `saveDocument`, `applyTemplate`, `exportDocument`
* No unclear abbreviations
* No humorous names — this is a long-lived product library

### 6.3. Comments

Comments explain **why**, not syntax.

Use these markers consistently:

* `// Constants`
* `// Variables`
* `// Doing some checks`
* `// Getting the data`
* `// Defining the functions`
* `// TODO: username:`
* `// FIXME: username:`


### 6.4. Function structure pattern

Preferred 4-step pattern:

1. **Doing some checks** — validate input
2. **Getting the data** — prepare required variables
3. **Defining the functions** — local helpers if needed
4. **Main flow** — execute the core logic

Reference example (host hook I/O + Pinia update + explicit format boundary):

```ts
import { Document } from '@/types';
import { HostHooks } from '@/types';
import store from '@/pinia/store';


// Third-parties

const appStore = store.useApp();


// Constants

const DEFAULT_DOCUMENT: Document = { id: '', name: '', data: '', extra: {} };


// NOTE: JetEdit stores the canonical external representation (Handlebars) in `Document.data`. The editor engine (Tiptap/ProseMirror) owns the internal structure.

export async function selectAndLoadDocument(id: string, hooks: HostHooks): Promise<void> {

    // Doing some checks

    if (!id)
        throw new Error('JetEdit: Unable to load document: Missing id');

    if (!hooks?.getDocument)
        throw new Error('JetEdit: Unable to load document: Missing host hook getDocument');


    // Getting the data

    const prev = appStore.getEditorDocument() ?? DEFAULT_DOCUMENT;


    // Defining the functions

    const coerce = (val: any): string => String(val || '');

    const normalize = (doc: Partial<Document>): Document => ({
        id: coerce(doc.id) || id,
        name: coerce(doc.name) || prev.name,
        data: coerce(doc.data),
        extra: doc.extra ?? {},
    });


    // Getting the document

    const document = await hooks.getDocument(id);


    // Updating the data

    app.setDocumentById(normalize(document));

    app.setEditorDocumentId(id);
}
```

---

## 7) Sanity checks

Keep it simple. Don’t build a giant manual test matrix.

When you change behavior, do the **minimum** relevant sanity check:

* `createEditor()` mounts successfully
* Unmount/remount works without leaked listeners
* Selecting/opening a document via host hook works
* Editing updates Pinia state predictably
* Undo/redo still works (basic smoke)
* If you touched extensions: the extension loads and does at least one observable thing

If the PRD requires additional checks.

---

## 8) Prohibitions & caution

* ❌ Don’t implement host-specific I/O inside core components (filesystem, pickers, platform bridges)
* ❌ Don’t pull ProseMirror internal state into Pinia
* ❌ Don’t add DOM hacks around selection/caret
* ❌ Don’t introduce an app-level plugin framework without explicit requirements
* ❌ Don’t add heavy dependencies without justification
* ❌ Don’t refactor across unrelated files “for cleanliness”

---

## 9) Pre-commit checklist

* [ ] Task is completed according to the plan and ticket
* [ ] Minimal diff — no unrelated refactors
* [ ] Public API (`createEditor()` + exports/types) is preserved or intentionally updated with notes
* [ ] External interactions are implemented in the host via hooks (not inside core components)
* [ ] Editor UX remains stable (caret/IME/selection/undo)
* [ ] Lint + typecheck + build pass
* [ ] Any behavior change is documented (README / comments / notes)
