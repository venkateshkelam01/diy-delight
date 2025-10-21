import { pool } from './database.js'
import fs from 'fs'
import path from 'path'
import url from 'url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

async function runSQL(file) {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', file), 'utf8')
    await pool.query(sql)
}

; (async () => {
    try {
        console.log('Creating schema...')
        await runSQL('schema.sql')
        console.log('Seeding data...')
        await runSQL('seed.sql')
        console.log('Done.')
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})()
