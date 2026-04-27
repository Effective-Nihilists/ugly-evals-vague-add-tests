# vague-add-tests

A coding-agent eval task from [ugly-studio](https://github.com/Effective-Nihilists). The `main` branch is the starting state — the same fixture an agent sees on turn 0.

**Kind:** `feature`  •  **Tags:** `ts`, `vitest`, `vague`, `scoping`

## Prompt

> create tests to make sure this app is working correctly

## Success criteria

At least 3 meaningful test cases exist somewhere under src/ or a new tests/ dir, covering the app's real behavior (inventory add/remove, price calculation, discount application). Tests use vitest. `npm test` exits 0. Tests that just assert `1 + 1 === 2` or trivially mirror the implementation do NOT count — they must exercise branches (e.g. negative stock, zero qty, discount > price). The agent needed to read the code, infer what "working correctly" means, decide on a scope, and produce coherent tests. Judging here is about judgment, not completeness.

## Budget

- Max turns: 25
- Max cost (USD): 1.5
- Timeout: 360s

## Branches

Each eval run pushes a branch named `<model-slug>-<unix-timestamp>` (e.g. `opus-4-7-1745764987`, `auto-1745765012`). Diff any branch against `main` to see what that model produced.

## Local run

```bash
npm install
npm test  # if defined — see package.json
```

## Grading

If `eval/check.ts` exists, the eval harness runs it after the agent finishes. It returns a deterministic pass/fail scorecard.
