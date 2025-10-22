import { useState } from 'react';

export default function Swatch({ option, selected, onClick }) {
  const [imgOk, setImgOk] = useState(true);
  const price = option.price_cents ? `+$${(option.price_cents / 100).toFixed(0)}` : '$0';
  const hasImage = typeof option.media === 'string' && option.media.length > 0;
  const showImage = hasImage && imgOk;

  return (
    <div
      className={`swatch ${selected ? 'selected' : ''}`}
      onClick={onClick}
      title={option.label}
      style={{ transition: 'border 0.15s ease-in-out' }}
    >
      {showImage ? (
        <img
          src={option.media}
          alt={option.label}
          onError={() => setImgOk(false)}
          style={{
            width: '100%',
            height: 90,
            borderRadius: 10,
            objectFit: 'cover',
            marginBottom: 8
          }}
          loading="lazy"
        />
      ) : (
        <div
          className="chip"
          style={{
            width: '100%',
            height: 90,
            borderRadius: 10,
            background: option.swatch || '#1f2937',
            marginBottom: 8
          }}
        />
      )}

      <div style={{ fontWeight: 700, fontSize: 14 }}>{option.label}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{price}</div>
    </div>
  );
}
