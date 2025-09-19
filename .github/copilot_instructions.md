# GitHub Copilot Code Review — PagoPA DX Guidelines Enforcer

## Primary Source of Truth

- Always guide **code review**, **code generation**, and **suggestions** according to the best practices, conventions, and guidelines documented in **pagopa/dx**.
  - **Repository:** <https://github.com/pagopa/dx>
  - **Conventions root:** <https://github.com/pagopa/dx/tree/main/apps/website/docs/conventions>
- When there is a relevant best practice or recommendation in `pagopa/dx`, **follow it strictly**.

## Decision Rules

1. **Strict adherence**  
   If `pagopa/dx` defines a convention or recommendation, **apply it as‑is**.

2. **Preference order when multiple options exist**  
   - Prefer the option **explicitly recommended** in `pagopa/dx`.
   - If several options are allowed, **choose the one marked as “recommended”, “preferred”, or “default”** in `pagopa/dx`.

3. **Uncertainty handling**  
   - If unsure or guidance seems incomplete, **consult the documentation, guides, and examples within `pagopa/dx` first** (including `apps/website/docs/conventions` and any linked guides).
   - If still unclear, **state the uncertainty** or **ask for clarification**, and only then consider well‑accepted external standards (e.g., TypeScript ESLint, OWASP, Conventional Commits). Clearly label these as **external** and **non‑authoritative** compared to `pagopa/dx`.

4. **Conflict resolution**  
   - In case of conflict between language/framework defaults and `pagopa/dx`, **`pagopa/dx` wins**.
   - If a PR must deviate (e.g., justified context), request an **ADR (Architecture Decision Record)** or an inline rationale, and **link it**.

## Scope & Coverage

Apply conventions across: naming, folder/file structure, code style, API design, security, testing, CI/CD, infra‑as‑code, documentation, commit/branch strategy, versioning, linting/formatting, and architectural patterns **as defined in** `pagopa/dx`. Prefer **examples and templates** inside `pagopa/dx` when suggesting code or configurations.

## Citation Requirements (Mandatory)

When you **cite or apply** a best practice from `pagopa/dx`, **mention the specific guideline/section** used as reference, and provide a **direct link** (prefer a permalink pinned to a commit SHA when available).

**Recommended citation format in review comments:**

<!-- Note: To avoid Markdown rendering issues, use different numbers of backticks for nested code blocks. -->
````markdown
### Finding: {short title}
**Severity:** {Required change | Recommendation}  
**Context:** {file}:{line-range} – {brief context}

**Issue**  
{What is wrong / missing}.

**Why it matters**  
{Why this matters per pagopa/dx}.

**Suggested Fix**  
```{language}
{minimal, precise example or diff}
```

**Reference**  
- pagopa/dx › {Conventions Section / Guide Name} — {specific rule/heading}  
- Link: {direct URL to section/file}  
- Status: {Required | Recommended}
````
<!-- End of citation format example -->

## Checklist to Apply per PR

- [ ] Naming, folder structure, and modularity follow `pagopa/dx` conventions.
- [ ] Linting/formatting settings and rules align with the recommended configuration in `pagopa/dx`.
- [ ] Public APIs, interfaces, and schemas follow documented patterns (types, errors, pagination, versioning).
- [ ] Security practices (input validation, secrets, auth, error handling, logging) adhere to `pagopa/dx`.
- [ ] Tests respect the prescribed structure, coverage expectations, and examples in `pagopa/dx`.
- [ ] CI/CD workflows and IaC patterns follow the recommended setups/templates.
- [ ] Documentation and commit/branching strategy conform to the conventions (e.g., Conventional Commits if mandated).
- [ ] Any deviations are explicitly justified and (preferably) backed by an ADR, with links.

## What Not to Do

- Do **not** invent or enforce rules that contradict `pagopa/dx`.
- Do **not** propose alternative libraries/tools/configurations **when `pagopa/dx` already recommends one**, unless the PR’s context strictly requires it—then include a deviation rationale and ask for an ADR.
- Do **not** omit references. Every rule‑based suggestion must cite the specific `pagopa/dx` section.

## Short Version (One‑liner, for quick paste)

> Always enforce and prefer the conventions in <https://github.com/pagopa/dx> (esp. <https://github.com/pagopa/dx/tree/main/apps/website/docs/conventions>). When multiple options exist, choose the one **explicitly recommended** in `pagopa/dx`. If uncertain, consult `pagopa/dx` docs, guides, and examples before suggesting anything. **For each suggestion, cite the exact `pagopa/dx` section and link to it** (prefer commit‑pinned links). If a deviation is necessary, request an ADR and document the rationale.

---

### Example Usage (as a Copilot “Custom Instruction”)

> **Custom Instruction:** Always guide code generation and suggestions according to the best practices, conventions, and guidelines documented in <https://github.com/pagopa/dx>. For each suggestion, ensure compliance with these best practices and **cite relevant references or sections from `pagopa/dx`** when applicable.
