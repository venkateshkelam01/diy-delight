import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCatalog } from '../services/CatalogAPI.jsx'
import { getItem, updateItem } from '../services/ItemsAPI.jsx'
import { calcTotal, centsToUSD } from '../utilities/calcPrice.js'
import { hasImpossibleCombo } from '../utilities/validation.js'
import Tabs from '../components/Tabs.jsx'
import OptionGrid from '../components/OptionGrid.jsx'
import CustomizerPreview from '../components/CustomizerPreview.jsx'

const TAB_ORDER = ['exterior', 'roof', 'wheels', 'interior']

export default function EditItem() {
    const { id } = useParams()
    const [catalog, setCatalog] = useState({ features: [], options: [], incompat: [] })
    const [title, setTitle] = useState('')
    const [basePrice, setBasePrice] = useState(0)
    const [notes, setNotes] = useState('')
    const [selections, setSelections] = useState({})
    const [activeTab, setActiveTab] = useState('exterior')
    const [error, setError] = useState('')
    const nav = useNavigate()

    useEffect(() => {
        (async () => {
            try {
                const [cat, item] = await Promise.all([getCatalog(), getItem(id)])
                setCatalog(cat)
                setTitle(item.title)
                setBasePrice(item.base_price_cents)
                setNotes(item.notes || '')
                const mapping = {}
                item.selected.forEach(s => { mapping[s.feature_id] = s.option_id })
                setSelections(mapping)
            } catch (e) { setError(e.message) }
        })()
    }, [id])

    const tabs = useMemo(() => (
        TAB_ORDER.map(k => {
            const f = catalog.features.find(f => f.name === k)
            return f ? { key: k, label: f.display_name, feature_id: f.id } : null
        }).filter(Boolean)
    ), [catalog])

    function setFeature(feature_id, option_id) {
        setSelections(prev => ({ ...prev, [feature_id]: option_id }))
    }

    const selectedOptionObjs = Object.entries(selections).map(([fid, oid]) =>
        ({ feature_id: Number(fid), ...catalog.options.find(o => o.id === oid) })
    ).filter(Boolean)

    const total = calcTotal(basePrice, selectedOptionObjs)
    const incompatible = hasImpossibleCombo(Object.values(selections), catalog.incompat)

    async function onSubmit(e) {
        e.preventDefault()
        setError('')
        try {
            const payload = {
                title, base_price_cents: basePrice, notes,
                selections: Object.entries(selections).map(([feature_id, option_id]) => ({ feature_id, option_id }))
            }
            await updateItem(id, payload)
            nav(`/items/${id}`)
        } catch (e) { setError(e.message) }
    }

    const activeFeature = catalog.features.find(f => f.name === activeTab)
    const activeOptions = activeFeature ? catalog.options.filter(o => o.feature_id === activeFeature.id) : []

    return (
        <div>
            <h1>Edit Car</h1>
            {error && <div className="error">{error}</div>}

            <div className="grid" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
                <div>
                    <div className="card">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <div style={{ fontSize: 12, color: '#9ca3af' }}>Build Name</div>
                                <input value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: '#9ca3af' }}>Base Price (cents)</div>
                                <input type="number" value={basePrice} onChange={e => setBasePrice(Number(e.target.value) || 0)} />
                            </div>
                        </div>
                        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>Notes</div>
                        <textarea rows="3" value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>

                    <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

                    {activeFeature && (
                        <OptionGrid
                            feature={activeFeature}
                            options={activeOptions}
                            value={selections[activeFeature.id]}
                            onChange={(val) => setFeature(activeFeature.id, val)}
                        />
                    )}
                </div>

                <div>
                    <CustomizerPreview selectionsByFeature={selections} catalog={catalog} />
                    <div className="card">
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>Price</div>
                        <div className="price">{centsToUSD(total)}</div>
                    </div>
                    {incompatible && <div className="error">This selection combo is not allowed. Try different options.</div>}
                    <button onClick={onSubmit}>Save Changes</button>
                </div>
            </div>
        </div>
    )
}
