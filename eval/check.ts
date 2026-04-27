/**
 * Default grader: run vitest on the BASELINE test files only —
 * those present in the fixture at extraction time, listed one per line
 * in eval/baseline-tests.txt. Tests added by the agent (or unrelated
 * scaffolder tests in setup-style tasks) are intentionally NOT graded:
 * the agent's task is to make the originally-failing test pass without
 * regressing its siblings, not to fix every test in the project.
 *
 * Invoked by the eval harness with the cloned worktree as cwd. Returns
 * a JSON scorecard on stdout that the harness parses.
 */
import { execFile } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execFileP = promisify(execFile);

async function readBaselineTests(cwd: string): Promise<string[]> {
  try {
    const raw = await fs.readFile(path.join(cwd, 'eval', 'baseline-tests.txt'), 'utf-8');
    return raw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .filter(async (rel) => {
        try {
          await fs.access(path.join(cwd, rel));
          return true;
        } catch {
          return false;
        }
      });
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const baselineTests = await readBaselineTests(cwd);
  // Only test files that still exist in the worktree (agent may have
  // deleted some — counted as failure via vitest's "no test found").
  const present: string[] = [];
  for (const rel of baselineTests) {
    try {
      await fs.access(path.join(cwd, rel));
      present.push(rel);
    } catch {
      /* baseline file removed by agent */
    }
  }
  const args =
    present.length > 0
      ? ['--no-install', 'vitest', 'run', ...present]
      : ['--no-install', 'vitest', 'run'];
  let exit: number | null = 0;
  let output = '';
  try {
    const r = await execFileP('npx', args, {
      cwd,
      timeout: 120_000,
      env: { ...process.env, CI: '1', FORCE_COLOR: '0' },
    });
    output = (r.stdout + '\n' + r.stderr).slice(-2000);
  } catch (err) {
    const e = err as NodeJS.ErrnoException & { code?: number; stdout?: string; stderr?: string };
    exit = typeof e.code === 'number' ? e.code : null;
    output = (`${e.stdout ?? ''}\n${e.stderr ?? ''}`).slice(-2000);
  }
  const passed = exit === 0;
  process.stdout.write(JSON.stringify({
    taskName: process.env.EVAL_TASK_NAME ?? 'unknown',
    checks: [{
      name: present.length > 0
        ? `vitest (baseline tests: ${present.length})`
        : 'vitest (no baseline list — running all)',
      passed,
      detail: passed ? 'tests passed' : output,
    }],
    tscExit: null,
    tscErrors: -1,
    score: passed ? 1 : 0,
    scoreMax: 1,
  }, null, 2) + '\n');
  process.exit(passed ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
