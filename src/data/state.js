import fs from 'node:fs/promises';
import path from 'node:path';

export async function loadIllinoisAverages() {
  try {
    const file = path.join(process.cwd(), 'data', 'state-averages.json');
    const contents = await fs.readFile(file, 'utf-8');
    return JSON.parse(contents);
  } catch {
    return null;
  }
}