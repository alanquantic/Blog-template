// Direct DB approach: bypasses Payload entirely.
// Reads DATABASE_URL from .env and updates users_roles table.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '..', '.env')
const envContent = readFileSync(envPath, 'utf8')

const parseEnv = (raw) => {
  const out = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (trimmed.length === 0 || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

const env = parseEnv(envContent)
const databaseUrl = env.DATABASE_URL
const email = process.argv[2]

if (!databaseUrl) throw new Error('DATABASE_URL missing in .env')
if (!email) throw new Error('Usage: node scripts/promote-admin.mjs <email>')

const client = new pg.Client({ connectionString: databaseUrl })
await client.connect()

const tablesQuery = `
  SELECT table_name FROM information_schema.tables
  WHERE table_schema='public' AND (table_name LIKE 'users%' OR table_name='users')
  ORDER BY table_name;
`
const tables = await client.query(tablesQuery)
console.log('Users-related tables:')
for (const r of tables.rows) console.log('  -', r.table_name)

const userRows = await client.query('SELECT id, email FROM users WHERE email=$1', [email])
if (userRows.rowCount === 0) {
  await client.end()
  throw new Error(`No user with email=${email}`)
}
const userId = userRows.rows[0].id
console.log(`\nFound user id=${userId} email=${email}`)

const rolesTable = 'users_roles'
const colsQuery = `
  SELECT column_name FROM information_schema.columns
  WHERE table_schema='public' AND table_name=$1
  ORDER BY ordinal_position;
`
const cols = await client.query(colsQuery, [rolesTable])
console.log(`\nColumns of ${rolesTable}:`)
for (const c of cols.rows) console.log('  -', c.column_name)

const before = await client.query(`SELECT * FROM ${rolesTable} WHERE parent_id=$1`, [userId])
console.log('\nBefore:')
for (const r of before.rows) console.log('  ', r)

await client.query(`DELETE FROM ${rolesTable} WHERE parent_id=$1`, [userId])
await client.query(
  `INSERT INTO ${rolesTable} ("order", parent_id, value) VALUES ($1, $2, $3)`,
  [1, userId, 'admin'],
)

const after = await client.query(`SELECT * FROM ${rolesTable} WHERE parent_id=$1`, [userId])
console.log('\nAfter:')
for (const r of after.rows) console.log('  ', r)

await client.end()
console.log('\nDone.')
