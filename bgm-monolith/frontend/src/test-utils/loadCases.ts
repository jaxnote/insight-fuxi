import { readFileSync } from 'fs'
import { parse } from 'yaml'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CASES_DIR = resolve(__dirname, '../../../test-cases')

export function loadCases(suitePath: string, tags?: string[]) {
  const raw = readFileSync(resolve(CASES_DIR, suitePath), 'utf8')
  const data = parse(raw)
  let cases = data.cases as Array<{ tags?: string[] }>
  if (tags) {
    cases = cases.filter((c) => c.tags?.some((t) => tags.includes(t)))
  }
  return cases
}
