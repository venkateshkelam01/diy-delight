import { Link } from 'react-router-dom'

export default function NavBar() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
        }}>
            <Link to="/">
                <h1 style={{
                    margin: 0,
                    padding: '6px 12px',
                    borderRadius: 12,
                    background: 'rgba(12,18,32,0.55)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px) saturate(140%)'
                }}>
                    Bolt Bucket ⚡️
                </h1>
            </Link>
            <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/"><button className="secondary">View Cars</button></Link>
                <Link to="/create"><button>Customize</button></Link>
            </div>
        </div>
    )
}
