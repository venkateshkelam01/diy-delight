export default function OptionSelector({ feature, options, value, onChange }) {
    return (
        <div className="card">
            <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em' }}>{feature.name}</div>
            <select value={value || ''} onChange={e => onChange(Number(e.target.value))}>
                <option value="" disabled>Choose an option</option>
                {options.map(o => (
                    <option key={o.id} value={o.id}>
                        {o.icon ? `${o.icon} ` : ''}{o.label} {o.price_cents ? `(+$${(o.price_cents / 100).toFixed(2)})` : ''}
                    </option>
                ))}
            </select>
        </div>
    )
}
