import Swatch from './Swatch.jsx'

export default function OptionGrid({ feature, options, value, onChange }){
  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', marginBottom:10}}>
        <div style={{fontSize:12, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'.08em'}}>
          {feature.display_name}
        </div>
      </div>
      <div className="option-grid">
        {options.map(o => (
          <Swatch
            key={o.id}
            option={o}
            selected={value===o.id}
            onClick={()=>onChange(o.id)}
          />
        ))}
      </div>
    </div>
  )
}
