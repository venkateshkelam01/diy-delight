import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCatalog } from '../services/CatalogAPI.jsx'
import { createItem } from '../services/ItemsAPI.jsx'
import { calcTotal, centsToUSD } from '../utilities/calcPrice.js'
import { hasImpossibleCombo } from '../utilities/validation.js'
import Tabs from '../components/Tabs.jsx'
import OptionGrid from '../components/OptionGrid.jsx'
import CustomizerPreview from '../components/CustomizerPreview.jsx'

const TAB_ORDER = ['exterior', 'roof', 'wheels', 'interior']

export default function CreateItem() {
    const [catalog, setCatalog] = useState({ features: [], options: [], incompat: [] })
    const [title, setTitle] = useState('My Corvette')
    const [basePrice, setBasePrice] = useState(7500000) // $75,000.00
    const [notes, setNotes] = useState('')
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('exterior')
    const nav = useNavigate()

    // selections: { [feature_id]: option_id }
    const [selections, setSelections] = useState({})

    useEffect(() => {
        (async () => {
            try { setCatalog(await getCatalog()) } catch (e) { setError(e.message) }
        })()
    }, [])

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
            await createItem(payload)
            nav('/')
        } catch (e) { setError(e.message) }
    }

    // Options for the active tab
    const activeFeature = catalog.features.find(f => f.name === activeTab)
    const activeOptions = activeFeature ? catalog.options.filter(o => o.feature_id === activeFeature.id) : []

    return (
        <div>
            <h1>Customize Your Car</h1>
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
                        <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em' }}>Price</div>
                        <div className="price">{centsToUSD(total)}</div>
                    </div>
                    {incompatible && <div className="error">This selection combo is not allowed. Try different options.</div>}
                    <button
                        disabled={!Object.keys(selections).length || incompatible}
                        onClick={onSubmit}
                    >
                        Save Car
                    </button>
                </div>
            </div>
        </div>
    )
}
