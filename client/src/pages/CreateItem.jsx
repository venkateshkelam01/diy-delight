import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCatalog } from '../services/CatalogAPI.jsx'
import { createItem } from '../services/ItemsAPI.jsx'
import { calcTotal, centsToUSD } from '../utilities/calcPrice.js'
import { hasImpossibleCombo } from '../utilities/validation.js'
import OptionSelector from '../components/OptionSelector.jsx'
import CustomizerPreview from '../components/CustomizerPreview.jsx'

export default function CreateItem() {
    const [catalog, setCatalog] = useState({ features: [], options: [], incompat: [] })
    const [title, setTitle] = useState('My Custom Car')
    const [base, setBase] = useState(2000000)
    const [notes, setNotes] = useState('')
    const [error, setError] = useState('')
    const nav = useNavigate()

    const [selections, setSelections] = useState({}) // feature_id -> option_id

    useEffect(() => {
        (async () => {
            try { setCatalog(await getCatalog()) } catch (e) { setError(e.message) }
        })()
    }, [])

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
            await createItem(payload)
            nav('/')
        } catch (e) { setError(e.message) }
    }

    return (
        <div>
            <h1>Create Item</h1>
            {error && <div className="error">{error}</div>}
            <div className="grid">
                <div>
                    <div className="card">
                        <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em' }}>Title</div>
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
                        <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em' }}>Price</div>
                        <div className="price">{centsToUSD(total)}</div>
                    </div>
                    {incompatible && <div className="error">Heads up: This selection is impossible. Try different options.</div>}
                    <button disabled={!Object.keys(selections).length} onClick={onSubmit}>Save Item</button>
                </div>
            </div>
        </div>
    )
}
