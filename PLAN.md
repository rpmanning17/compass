# Design System & AI Agent Workflow — Master Plan

**Status:** Active
**Created:** May 1, 2026
**Last updated:** May 1, 2026 (Phase 1 complete; removed GitHub mobile app per §8 deviation; Vercel pending)
**Owner:** [Your name]
**Source of truth hierarchy:** GitHub repo `PLAN.md` > Cowork project copy > Claude chat project copy > Google Drive backup

---

## 1. Purpose

This document is the single source of truth for building a portable UX/UI design system and AI agent workflow. It exists to prevent drift across long, multi-session, multi-tool work. Any deviation from this plan must be recorded in the Decisions Log (Section 8) with reasoning before execution.

Read this document at the start of every working session, in whichever tool you are using.

---

## 2. Vision

Build a design system + AI agent kit that is:

- **Portable across employers.** Owned by you, not entangled with any specific company's IP.
- **AI-native.** Claude Code, Codex CLI, Claude Design, and Cowork are first-class participants in the workflow, not bolt-ons.
- **Cross-checked.** Claude and GPT review each other's work at decision points and at code-review points to catch single-model blind spots.
- **Engineering-friendly.** Outputs are consumable as a real npm package by real engineering teams, not just design files.
- **Stakeholder-friendly.** Outputs can be exported as decks, prototypes, and HTML for non-technical reviewers.
- **Customizable per client.** A standard methodology that gets forked and tuned to each new employer's stack and brand in under an hour.

---

## 3. Architecture: Four Layers

### 3.1 Tokens layer
The atomic design decisions: color, type ramp, spacing scale, radii, shadows, motion. Stored as framework-agnostic JSON. Compiled with Style Dictionary into:
- CSS variables
- TypeScript/JS exports
- Figma variables (via Tokens Studio sync)
- Optional: iOS/Android tokens, Tailwind config

This is the single source of truth for visual style. Everything else derives from it.

### 3.2 Component layer
Reference components built on the tokens. Initial set: Button, Input, FormField, Card, Modal. Grows as needed. Built in React + TypeScript, with tests and Storybook stories. These are the canonical reference; per-client implementations may diverge.

### 3.3 Design surface
The Figma library that mirrors tokens and components. Tokens Studio syncs token JSON into Figma variables. Code Connect maps Figma components to code components so design and engineering speak the same language during handoff.

### 3.4 Agent layer
The AI configuration that lives inside the repo and the Cowork project:
- `CLAUDE.md` and `AGENTS.md` at repo root, telling Claude Code and Codex CLI how to work in the codebase
- Subagents defined in `.claude/agents/` for repeated tasks (token-updater, component-scaffolder, accessibility-reviewer, design-system-linter)
- Cowork projects for non-code recurring work (research synthesis, design QA, weekly reports)
- Claude Design connected to the repo so generated prototypes use the real design system

---

## 4. Tool Inventory

| Tool | Primary use in this workflow |
|------|------------------------------|
| **Claude chat (this project)** | Planning, decisions, meta-work, troubleshooting |
| **Claude Cowork** | File/folder work, recurring tasks, non-code deliverables, scheduled work |
| **Claude Code (CLI)** | Building and maintaining the design system codebase |
| **Claude Design** | Prototype generation, stakeholder mockups, exec decks |
| **Codex CLI (GPT)** | Cross-checking Claude Code's work; second-opinion implementations |
| **ChatGPT (web)** | Second-opinion on plans before committing; red-teaming proposals |
| **VS Code** | Editor host for Claude Code and Codex CLI (terminal lives inside it); Agent Sessions view (1.109+) shows both agents side by side; manual file inspection and edits |
| **Figma** | Design surface, stakeholder collaboration, Code Connect handoff |
| **GitHub (web)** | Repo hosting, Storybook deploy via Pages, PR-based review trail |
| **Google Drive** | Backup of plan doc; final polished client deliverables |
| **Hosting (Vercel?)** | TBD — see Decisions Log pending entry |

---

## 5. Tool Selection: Rule of Thumb

**Default rule:** Chat for thinking and deciding. Cowork for working with files on your machine and recurring non-code work. Claude Code for building and maintaining the codebase. Codex CLI for cross-checking. Claude Design for prototypes. Figma for the design surface. VS Code as the editor that hosts the terminals where Claude Code and Codex run.

**Specific guidance:**

- If you're about to **make a decision**, you belong in chat (here or ChatGPT).
- If you're about to **touch files on your computer**, you belong in Cowork or Claude Code.
- If you're about to **iterate on code with builds running**, you belong in Claude Code (terminal, inside VS Code).
- If you're about to **review a diff before merging**, you belong in Codex CLI (or in GitHub's PR review with @Codex if you've set up Agent HQ later).
- If you're about to **generate a prototype, deck, or mockup**, you belong in Claude Design.
- If you're about to **build or edit a Figma component**, you belong in Figma itself, with Claude chat open as a guide.
- If you're about to **synthesize research, organize files, or run a recurring deliverable**, you belong in Cowork.

**Anti-pattern:** defaulting to chat out of habit. Chat cannot create files, run code, or modify Figma. If you're in chat doing anything other than thinking or deciding, you're in the wrong tool.

---

## 6. The Seven Phases

Each phase has: a goal, the tool(s) it happens in, inputs required, outputs produced, and success criteria. Phases happen in order. Do not start a phase until the previous phase's success criteria are met.

### Phase 0: Planning and decisions
- **Tool:** Claude chat (AI Incorporation project)
- **Goal:** Lock in the plan, make foundational decisions
- **Inputs:** This document
- **Outputs:** This document, with Section 8 decisions filled in
- **Success criteria:**
  - Three foundational decisions recorded: system name, component framework, repo visibility ✅
  - PLAN.md saved to chat project files and Google Drive backup
- **Status:** ✅ Complete (decisions recorded; save updated PLAN.md to chat project + Drive)

### Phase 1: Repo foundation
- **Tool:** Cowork (primary), GitHub web (for repo creation)
- **Goal:** Create the GitHub repo, scaffold the directory structure, get Claude Code and VS Code installed and working locally
- **Inputs:** Decisions from Phase 0
- **Outputs:**
  - Public GitHub repo named `compass` created
  - Local clone with directory structure scaffolded
  - `PLAN.md`, `README.md`, `.gitignore`, `LICENSE` (MIT) committed
  - VS Code installed (if not already)
  - Claude Code installed via `npm install -g @anthropic-ai/claude-code`
  - Cowork project created for ongoing work; `PLAN.md` copy added
- **Success criteria:**
  - Repo visible on GitHub with initial commit
  - Claude Code runs successfully against the local repo from a VS Code terminal
  - Cowork project exists with PLAN.md and read access to the repo folder

### Phase 2: Tokens
- **Tool:** Cowork to set up scaffolding, then Claude Code (in VS Code) for iteration
- **Goal:** Define the token system and build pipeline
- **Inputs:** Repo from Phase 1
- **Outputs:**
  - `tokens/` directory with JSON token definitions (color, typography, spacing, radii, shadows, motion)
  - Style Dictionary configured
  - Build outputs: CSS variables, TypeScript exports, Figma-compatible JSON
  - `npm run build:tokens` works end to end
- **Success criteria:**
  - Running the build produces all expected output formats with no errors
  - Tokens are documented in `tokens/README.md`
  - At least one round of cross-check: Codex CLI reviews the token structure

### Phase 3: Reference components
- **Tool:** Claude Code (terminal in VS Code), Codex CLI (parallel terminal in VS Code, or via Agent Sessions view if on 1.109+)
- **Goal:** Build the starter component library in React + TypeScript
- **Inputs:** Tokens from Phase 2
- **Outputs:**
  - Components: Button, Input, FormField, Card, Modal (minimum)
  - Each component has: TypeScript types, unit tests, accessibility considerations documented, Storybook story
  - Tests pass via `npm test`
- **Success criteria:**
  - All five components implemented and tested
  - Each PR (or commit batch) reviewed by Codex CLI before merge
  - Accessibility review completed for each (keyboard nav, ARIA, contrast)

### Phase 4: Documentation and Storybook
- **Tool:** Claude Code (in VS Code)
- **Goal:** Make the system browsable and consumable
- **Inputs:** Components from Phase 3
- **Outputs:**
  - Storybook configured with all components
  - Storybook deployed to a public URL (GitHub Pages by default; Vercel pending decision — see Section 8)
  - GitHub Action handles deploy on merge to main
  - `README.md` covers: what this is, how to install, how to contribute, how to consume tokens, how to consume components
  - `CONTRIBUTING.md` covers: branch naming, PR conventions, AI agent usage rules
- **Success criteria:**
  - Live Storybook URL works and shows all components
  - A new engineer could install the package and use a Button without asking questions

### Phase 5: Figma sync
- **Tool:** Hybrid — Claude Code for Code Connect setup; Figma directly for library work; Claude chat as guide
- **Goal:** Make Figma a peer to the code, not a parallel reality
- **Inputs:** Components and tokens from Phases 2–4
- **Outputs:**
  - Figma library file with components matching the code components
  - Tokens Studio installed and syncing tokens from the repo into Figma variables
  - Code Connect set up; at least Button mapped from Figma to code component
- **Success criteria:**
  - Changing a token in the repo and pushing updates the Figma variable on next sync
  - In Figma's dev mode, hovering a Button shows the corresponding code component

### Phase 6: Agent layer
- **Tool:** Claude Code (for files in repo), Cowork (for recurring projects), Claude Design (for repo connection)
- **Goal:** Wire the AI agents into the system so they help maintain and extend it
- **Inputs:** Working repo from Phases 1–4
- **Outputs:**
  - `CLAUDE.md` at repo root (instructions for Claude Code)
  - `AGENTS.md` at repo root (instructions for Codex CLI and other agents)
  - `.claude/agents/` populated with subagents: token-updater, component-scaffolder, accessibility-reviewer, design-system-linter
  - Cowork projects created for: research synthesis, weekly design review compile, competitive scan
  - Claude Design connected to the repo (generated prototypes use real tokens/components)
- **Success criteria:**
  - Asking Claude Code "add a new color token for warning state" produces a correct, conventional change without manual hand-holding
  - Asking Claude Design "build a settings page mockup" produces output using your real Button, Input, Card components
  - At least one Cowork project running on a schedule

### Phase 7: Portability playbook
- **Tool:** Cowork
- **Goal:** Document the methodology so you can deploy this at any new employer in under an hour
- **Inputs:** Everything built in Phases 1–6
- **Outputs:**
  - `PLAYBOOK.md` in the repo covering: how to fork the system for a new client, how to swap brand tokens without breaking components, how to introduce the system to an engineering team, how to handle existing-codebase integration, common gotchas
  - Template `CLAUDE.md` and `AGENTS.md` with `[CLIENT_NAME]` placeholders
  - A "Day 1 Checklist" for new client engagements
- **Success criteria:**
  - You can spin up a customized fork for a hypothetical new client in under an hour, end to end

---

## 7. Cross-Checking Protocol

Claude and GPT have different training and different blind spots. Use the cross-check at decision points and code-review points, not for routine implementation.

**Plans and architecture decisions:** Draft in Claude chat. Paste into ChatGPT with prompt "Red-team this plan. What's missing? What would fail in practice? What would you do differently?" Reconcile yourself before committing.

**Code changes:** Implement with Claude Code. Before merging, run Codex CLI on the diff with prompt "Review this diff for correctness, conventions, accessibility, and test coverage. Flag anything you'd push back on in PR review." Address findings before merge.

**Design system decisions** (e.g., "should this be a Button variant or a separate component?"): Get both models' takes. Decide yourself.

**Routine implementation work** (e.g., "add a prop to this existing component"): Don't cross-check. It's overhead without benefit.

---

## 8. Decisions Log

Record every foundational decision and every deviation from this plan. Format: date, decision, reasoning, who/what was consulted.

### Recorded decisions

| Date | Decision | Reasoning | Consulted |
|------|----------|-----------|-----------|
| 2026-05-01 | **System name: Compass** | Neutral, durable, evokes wayfinding/orientation — appropriate framing for a design system. Owner-chosen. | Claude chat |
| 2026-05-01 | **Framework: React + TypeScript** | Broadest consumption across employers; strongest tooling ecosystem; native Storybook support; works with Code Connect; matches the most common engineering stack at target clients. | Claude chat (recommendation accepted) |
| 2026-05-01 | **Repo visibility: Public** | Functions as a portfolio asset; shareable with prospective employers; lower friction for collaborators; reinforces "owned by you, not by any employer" principle. No proprietary client work will live in this repo. | Claude chat |
| 2026-05-01 | **Add VS Code to tool inventory** | VS Code 1.109+ has unified Agent Sessions view for Claude + Codex; standard editor host for the terminals where both agents run; needed for manual file inspection. | Conversation with Leann (informal) |

### Pending decisions

| Date raised | Decision | Context | Owner | Resolve by |
|-------------|----------|---------|-------|------------|
| 2026-05-01 | **Storybook hosting: GitHub Pages or Vercel?** | Pages is free, zero extra service, lives with the repo. Vercel adds preview deploys per PR, faster CDN, but adds an account/integration to maintain across employers. Question: what is being deployed beyond Storybook (e.g., live prototype demos, a docs site)? If Storybook only, Pages wins on simplicity; if more, Vercel may be worth it. | You | Before Phase 4 |

### Deviations from plan

| Date | Phase | What changed | Why |
|------|-------|--------------|-----|
| 2026-05-01 | Phase 1 | Removed GitHub mobile app references from Tool Inventory (§4), Tool Selection guidance (§5), Phase 1 outputs (§6), and Decisions Log (§8). | Original mobile-app entry was based on a misremembered conversation with Leann — Leann referenced GitHub Desktop, not mobile. Decided not to add Desktop in its place either; existing stack (Claude Code, Codex CLI, VS Code, terminal git) covers all needed git operations. |

---

## 9. Document Maintenance

### Where copies live
1. **GitHub repo `PLAN.md`** — canonical source of truth (created in Phase 1)
2. **Cowork project file** — working copy for Cowork sessions (created in Phase 1)
3. **Claude chat project file (AI Incorporation)** — working copy for chat sessions
4. **Google Drive backup** — disaster recovery copy

### Update protocol
- When the plan changes, update the GitHub `PLAN.md` first
- Then sync the Cowork and chat project copies from the GitHub version
- Update Drive backup at major milestones (end of each phase)
- Never edit any copy except the canonical GitHub one once Phase 1 is complete

### Anti-drift mechanism
- Read this document at the start of every working session
- Before any action that wasn't in the plan, ask: "should this be a deviation entry?"
- If yes, write the deviation entry first, then proceed
- Both Claude Code and Codex CLI will read this file (via `CLAUDE.md` / `AGENTS.md` references) on every session, so they will help flag drift

---

## 10. Out of Scope (For Now)

To keep this plan focused, the following are explicitly *not* included in Phases 1–7. Revisit after Phase 7 is complete:

- Multi-brand theming infrastructure beyond simple token swaps
- Mobile-native (iOS/Android) component implementations
- Advanced motion/animation system
- Internationalization tooling
- Visual regression testing infrastructure
- Design system documentation site beyond Storybook (e.g., a custom Next.js doc site)
- GitHub Agent HQ setup (Tier 2 cross-checking) — defer until working with engineering teams at an actual employer

These are good ideas but not foundational. Adding them now would slow the build of the core system.
