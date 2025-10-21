import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCatalog } from '../services/CatalogAPI.jsx'
import { getItem, updateItem } from '../services/ItemsAPI.jsx'
import { calcTotal, centsToUSD } from '../utilities/calcPrice.js'
import { hasImpossibleCombo } from '../utilities/validation.js'
import OptionSelector from '../components/OptionSelector.jsx'
import CustomizerPreview from '../components/CustomizerPreview.jsx'

export default function EditItem() {
    const { id } = useParams()
    const [catalog, setCatalog] = useState({ features: [], options: [], incompat: [] })
    const [title, setTitle] = useState('')
    const [base, setBase] = useState(0)
    const [notes, setNotes] = useState('')
    const [selections, setSelections] = useState({})
    const [error, setError] = useState('')
    const nav = useNavigate()

    useEffect(() => {
        (async () => {
            try {
                const [cat, item] = await Promise.all([getCatalog(), getItem(id)])
                setCatalog(cat)
                setTitle(item.title)
                setBase(item.base_price_cents)
                setNotes(item.notes || '')
                const mapping = {}
                item.selected.forEach(s => { mapping[s.feature_id] = s.option_id })
                setSelections(mapping)
            } catch (e) { setError(e.message) }
        })()
    }, [id])

    function setFeature(feature_id, option_id) {
        setSelections(prev => ({ ...prev, [feature_id]: option_id }))
    }

    const selectedOptionObjs = Object.entries(selections).map(([fid, oid]) =>
        ({ feature_id: Number(fid), ...catalog.options.find(o => o.id === oid) })
    ).filter(Boolean)

    const total = calcTotal(base, selectedOptionObjs)
    const incompatible = hasImpossibleCombo(Object.values(selections), catalog.incompat)

    async function onSubmit(e) {
        e.preventDefault()
        setError('')
        try {
            const payload = {
                title, base_price_cents: base, notes,
                selections: Object.entries(selections).map(([feature_id, option_id]) => ({ feature_id, option_id }))
            }
            await updateItem(id, payload)
            nav(`/items/${id}`)
        } catch (e) { setError(e.message) }
    }

    return (
        <div>
            <h1>Edit Item</h1>
            {error && <div className="error">{error}</div>}
            <div className="grid">
                <div>
                    <div className="card">
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>Title</div>
                        <input value={title} onChange={e => setTitle(e.target.value)} />
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>Base Price (cents)</div>
                        <input type="number" value={base} onChange={e => setBase(Number(e.target.value) || 0)} />
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>Notes</div>
                        <textarea rows="3" value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                    {catalog.features.map(f => (
                        <OptionSelector key={f.id}
                            feature={f}
                            options={catalog.options.filter(o => o.feature_id === f.id)}
                            value={selections[f.id]}
                            onChange={(val) => setFeature(f.id, val)}
                        />
                    ))}
                </div>
                <div>
                    <CustomizerPreview selectionsByFeature={selections} catalog={catalog} />
                    <div className="card">
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>Price</div>
                        <div className="price">{centsToUSD(total)}</div>
                    </div>
                    {incompatible && <div className="error">Heads up: This selection is impossible. Try different options.</div>}
                    <button onClick={onSubmit}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}
