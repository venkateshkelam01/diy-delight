// Visual preview now reflects: exterior color (body), roof type shade, and wheel ring color by wheel code
export default function CustomizerPreview({ selectionsByFeature, catalog }) {
    const key = k => (catalog.features.find(f => f.name === k) || {}).id

    const extId = selectionsByFeature[key('exterior')]
    const roofId = selectionsByFeature[key('roof')]
    const whlId = selectionsByFeature[key('wheels')]
    const intId = selectionsByFeature[key('interior')]

    const ext = catalog.options.find(o => o.id === extId)
    const roof = catalog.options.find(o => o.id === roofId)
    const whl = catalog.options.find(o => o.id === whlId)
    const int = catalog.options.find(o => o.id === intId)

    const bodyColor = ext?.swatch || '#64748b'
    const roofColor =
        roof?.code === 'ROOF_TRANSPARENT' ? 'rgba(255,255,255,0.45)'
            : roof?.code === 'ROOF_VISIBLE_CARBON' ? '#111827'
                : bodyColor

    const wheelBorder =
        whl?.code?.includes('RED_STR') ? '#ef4444'
            : whl?.code?.includes('GLOSS_BLACK') ? '#f8fafc'
                : '#9ca3af'

    return (
        <div className="preview">
            <div className="car">
                <div className="roof" style={{ background: roofColor }} />
                <div className="body" style={{ background: bodyColor }} />
                <div className="wheel left" style={{ borderColor: wheelBorder }} />
                <div className="wheel right" style={{ borderColor: wheelBorder }} />
            </div>
            <div style={{ marginTop: 8, opacity: .7 }}>
                Interior: <span style={{
                    display: 'inline-block', width: 14, height: 14, background: int?.swatch || '#e5e7eb',
                    borderRadius: 4, verticalAlign: 'middle', margin: '0 6px'
                }} /> {int?.label || '—'}
            </div>
        </div>
    )
}
