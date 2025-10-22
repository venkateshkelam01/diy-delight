import { pool } from '../config/database.js'

export async function getCatalog(req, res) {
    try {
        const features = (await pool.query('SELECT * FROM features ORDER BY id')).rows
        const options = (await pool.query('SELECT * FROM options ORDER BY id')).rows
        const incompat = (await pool.query('SELECT * FROM incompatible_option_pairs')).rows
        res.json({ features, options, incompat })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to load catalog' })
    }
}

export async function listItems(req, res) {
    try {
        const items = (await pool.query(
            `SELECT id, title, base_price_cents, created_at, updated_at
       FROM custom_items ORDER BY id DESC`
        )).rows

        const withOptions = await Promise.all(items.map(async (it) => {
            const sel = (await pool.query(
                `SELECT io.feature_id, io.option_id, f.name AS feature_key, f.display_name, o.label, o.price_cents, o.code, o.media, o.swatch
         FROM item_options io
         JOIN features f ON io.feature_id = f.id
         JOIN options o  ON io.option_id  = o.id
         WHERE io.item_id=$1
         ORDER BY io.feature_id`, [it.id]
            )).rows
            return { ...it, selected: sel }
        }))

        res.json(withOptions)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to list items' })
    }
}

export async function getItem(req, res) {
    try {
        const { id } = req.params
        const item = (await pool.query('SELECT * FROM custom_items WHERE id=$1', [id])).rows[0]
        if (!item) return res.status(404).json({ error: 'Not found' })

        const selected = (await pool.query(
            `SELECT io.feature_id, io.option_id, f.name AS feature_key, f.display_name, o.label, o.price_cents, o.code, o.media, o.swatch
       FROM item_options io
       JOIN features f ON io.feature_id = f.id
       JOIN options o  ON io.option_id  = o.id
       WHERE io.item_id=$1
       ORDER BY io.feature_id`, [id]
        )).rows

        res.json({ ...item, selected })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to get item' })
    }
}

function normalizeSelections(selections) {
    if (!Array.isArray(selections)) return []
    return selections.map(s => ({ feature_id: Number(s.feature_id), option_id: Number(s.option_id) }))
}

async function validateImpossibleCombo(selections) {
    if (selections.length < 2) return null
    const optionIds = selections.map(s => s.option_id)
    const { rows } = await pool.query(
        `SELECT 1 FROM incompatible_option_pairs
     WHERE (option_a = ANY($1) AND option_b = ANY($1))
     LIMIT 1`, [optionIds]
    )
    if (rows.length) return 'Selected options include an impossible combination.'
    return null
}

export async function createItem(req, res) {
    const { title, base_price_cents = 0, notes = '', selections = [] } = req.body
    if (!title || !Array.isArray(selections) || !selections.length) {
        return res.status(400).json({ error: 'title and selections are required' })
    }
    const normalized = normalizeSelections(selections)
    try {
        const impossible = await validateImpossibleCombo(normalized)
        if (impossible) return res.status(400).json({ error: impossible })

        const { rows } = await pool.query(
            `INSERT INTO custom_items (title, base_price_cents, notes)
       VALUES ($1,$2,$3) RETURNING *`, [title, base_price_cents, notes]
        )
        const item = rows[0]

        for (const sel of normalized) {
            await pool.query(
                `INSERT INTO item_options (item_id, feature_id, option_id)
         VALUES ($1,$2,$3)
         ON CONFLICT (item_id, feature_id) DO UPDATE SET option_id=EXCLUDED.option_id`,
                [item.id, sel.feature_id, sel.option_id]
            )
        }

        res.status(201).json(item)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to create item' })
    }
}

export async function updateItem(req, res) {
    const { id } = req.params
    const { title, base_price_cents, notes, selections } = req.body
    try {
        const exists = (await pool.query('SELECT id FROM custom_items WHERE id=$1', [id])).rows[0]
        if (!exists) return res.status(404).json({ error: 'Not found' })

        const normalized = normalizeSelections(selections || [])
        const impossible = await validateImpossibleCombo(normalized)
        if (impossible) return res.status(400).json({ error: impossible })

        await pool.query(
            `UPDATE custom_items
       SET title=COALESCE($1, title),
           base_price_cents=COALESCE($2, base_price_cents),
           notes=COALESCE($3, notes),
           updated_at=NOW()
       WHERE id=$4`, [title, base_price_cents, notes, id]
        )

        if (normalized.length) {
            for (const sel of normalized) {
                await pool.query(
                    `INSERT INTO item_options (item_id, feature_id, option_id)
           VALUES ($1,$2,$3)
           ON CONFLICT (item_id, feature_id) DO UPDATE SET option_id=EXCLUDED.option_id`,
                    [id, sel.feature_id, sel.option_id]
                )
            }
        }

        res.json({ message: 'Updated' })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to update item' })
    }
}

export async function deleteItem(req, res) {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM custom_items WHERE id=$1', [id])
        res.json({ message: 'Deleted' })
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to delete item' })
    }
}
