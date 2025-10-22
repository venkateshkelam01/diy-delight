import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getItem, deleteItem } from '../services/ItemsAPI'
import { centsToUSD, calcTotal } from '../utilities/calcPrice'

export default function ItemDetail() {
    const { id } = useParams()
    const nav = useNavigate()
    const [item, setItem] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        (async () => {
            try { setItem(await getItem(id)) } catch (e) { setError(e.message) }
        })()
    }, [id])

    async function onDelete() {
        if (!confirm('Delete this car?')) return
        try { await deleteItem(id); nav('/') } catch (e) { setError(e.message) }
    }

    if (!item) return <div>{error || 'Loading...'}</div>
    const total = calcTotal(item.base_price_cents, item.selected)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>{item.title}</h1>
                <div className="price">{centsToUSD(total)}</div>
            </div>
            <div className="card">
                {(item.selected || []).map(s => (
                    <div key={s.feature_id} style={{ marginBottom: 6 }}>
                        <b>{s.display_name}</b>: {s.label} <span className="badge mono">+${(s.price_cents / 100).toFixed(0)}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/items/${item.id}/edit`}><button>Edit</button></Link>
                <button className="secondary" onClick={onDelete}>Delete</button>
            </div>
        </div>
    )
}
