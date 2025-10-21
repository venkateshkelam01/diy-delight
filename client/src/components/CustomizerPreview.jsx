export default function CustomizerPreview({ selectionsByFeature, catalog }) {
    const extFeature = catalog.features.find(f => f.name === 'exterior')
    const whlFeature = catalog.features.find(f => f.name === 'wheels')

    const exteriorOptionId = selectionsByFeature[extFeature?.id]
    const wheelOptionId = selectionsByFeature[whlFeature?.id]

    const ext = catalog.options.find(o => o.id === exteriorOptionId)
    const whl = catalog.options.find(o => o.id === wheelOptionId)

    const bodyColor =
        ext?.code === 'EXT_RED' ? '#ef4444' :
            ext?.code === 'EXT_BLUE' ? '#3b82f6' :
                ext?.code === 'EXT_MATTE_BLACK' ? '#0f172a' : '#94a3b8'

    const wheelBorder =
        whl?.code === 'WHL_CHROME' ? '#e5e7eb' :
            whl?.code === 'WHL_SPORT' ? '#60a5fa' : '#9ca3af'

    return (
        <div className="preview">
            <div className="car">
                <div className="roof" style={{ background: bodyColor }} />
                <div className="body" style={{ background: bodyColor }} />
                <div className="wheel left" style={{ borderColor: wheelBorder }} />
                <div className="wheel right" style={{ borderColor: wheelBorder }} />
            </div>
            <div style={{ marginTop: 8, opacity: .7 }}>Live Preview</div>
        </div>
    )
}
