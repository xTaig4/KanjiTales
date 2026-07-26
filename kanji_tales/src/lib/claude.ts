// Story generation via headless Claude Code (`claude -p`). Runs on the
// user's Claude subscription — no API key needed. The prompt goes in via
// stdin to avoid Windows argv length limits.

import { spawn } from "node:child_process";

const TIMEOUT_MS = 120_000;

export async function askClaude(systemPrompt: string, prompt: string): Promise<string> {
  const args = [
    "-p",
    "--model", process.env.STORY_MODEL ?? "sonnet",
    "--output-format", "json",
    "--tools", "",
    "--setting-sources", "",
    "--no-session-persistence",
    "--system-prompt", systemPrompt,
  ];

  const raw = await new Promise<string>((resolve, reject) => {
    const child = spawn("claude", args, { windowsHide: true });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`claude -p timed out after ${TIMEOUT_MS / 1000}s`));
    }, TIMEOUT_MS);

    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(new Error(`failed to launch claude CLI: ${err.message}`));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) reject(new Error(`claude -p exited with code ${code}: ${stderr.slice(0, 500)}`));
      else resolve(stdout);
    });
    child.stdin.write(prompt);
    child.stdin.end();
  });

  const wrapper = JSON.parse(raw);
  if (wrapper.is_error) throw new Error(`claude -p returned an error: ${wrapper.result}`);
  return wrapper.result as string;
}

// The model is asked for bare JSON, but be tolerant of code fences or prose
// around it.
export function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error(`no JSON object found in model output: ${text.slice(0, 200)}`);
  return JSON.parse(text.slice(start, end + 1));
}
