import { Link } from 'react-router-dom'
import { centsToUSD, calcTotal } from '../utilities/calcPrice'

export default function ItemCard({ item }) {
    const total = calcTotal(item.base_price_cents, item.selected || [])
    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em' }}>Item</div>
                    <h3 style={{ margin: '6px 0' }}>{item.title}</h3>
                    <div style={{ fontSize: 12, color: '#93c5fd' }}>Created {new Date(item.created_at).toLocaleString()}</div>
                </div>
                <div className="price">{centsToUSD(total)}</div>
            </div>
            <div style={{ marginTop: 10 }}>
                {(item.selected || []).map(s => <span key={s.feature_id} style={{ marginRight: 8 }}>{s.icon} {s.label}</span>)}
            </div>
            <div style={{ marginTop: 12 }}>
                <Link to={`/items/${item.id}`}><button>View</button></Link>
            </div>
        </div>
    )
}
