import { useEffect, useState } from 'react'
import { listItems } from '../services/ItemsAPI'
import ItemCard from '../components/ItemCard'

export default function ItemsList() {
    const [items, setItems] = useState([])
    const [error, setError] = useState('')
    useEffect(() => {
        (async () => {
            try { setItems(await listItems()) }
            catch (e) { setError(e.message) }
        })()
    }, [])

    return (
        <div>
            <h1>All Custom Items</h1>
            {error && <div className="error">{error}</div>}
            <div className="grid">
                {items.map(it => <ItemCard key={it.id} item={it} />)}
            </div>
        </div>
    )
}
