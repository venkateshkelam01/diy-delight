-- Upsert features (ensures display_name stays correct)
INSERT INTO features (name, display_name) VALUES
  ('exterior','EXTERIOR'),
  ('roof','ROOF'),
  ('wheels','WHEELS'),
  ('interior','INTERIOR')
ON CONFLICT (name) DO UPDATE
SET display_name = EXCLUDED.display_name;

-- =======================
-- EXTERIOR
-- =======================
WITH f AS (SELECT id FROM features WHERE name='exterior')
INSERT INTO options (feature_id, label, price_cents, code, media, swatch) VALUES
  ((SELECT id FROM f), 'Torch Red',               0,     'EXT_TORCH_RED',       'https://images.unsplash.com/photo-1606813908152-9b2b4c7fda3f?w=800', '#c1121f'),
  ((SELECT id FROM f), 'Amplify Orange Tint',     25000, 'EXT_AMPLIFY_ORANGE',  'https://images.unsplash.com/photo-1606813908238-5a67b93e2f38?w=800', '#f97316'),
  ((SELECT id FROM f), 'Silver Flare Metallic',   15000, 'EXT_SILVER_FLARE',    'https://images.unsplash.com/photo-1606813908100-6e0dbe3d61e4?w=800', '#cbd5e1'),
  ((SELECT id FROM f), 'Rapid Blue',              20000, 'EXT_RAPID_BLUE',      'https://images.unsplash.com/photo-1606813908197-f3e3b6e418c7?w=800', '#3b82f6'),
  ((SELECT id FROM f), 'Carbon Flash Metallic',   30000, 'EXT_CARBON_FLASH',    'https://images.unsplash.com/photo-1606813908027-89f63a6651dc?w=800', '#111827')
ON CONFLICT (feature_id, code) DO UPDATE
SET label = EXCLUDED.label,
    price_cents = EXCLUDED.price_cents,
    media = EXCLUDED.media,
    swatch = EXCLUDED.swatch;

-- =======================
-- ROOF
-- =======================
WITH f AS (SELECT id FROM features WHERE name='roof')
INSERT INTO options (feature_id, label, price_cents, code, media) VALUES
  ((SELECT id FROM f), 'Body Color',           0,     'ROOF_BODY_COLOR',     'https://images.unsplash.com/photo-1606813908139-9ecb4f84d4b7?w=800'),
  ((SELECT id FROM f), 'Transparent',          15000, 'ROOF_TRANSPARENT',    'https://images.unsplash.com/photo-1606813908210-1d17f9e7fcd3?w=800'),
  ((SELECT id FROM f), 'Visible Carbon Fiber', 35000, 'ROOF_VISIBLE_CARBON', 'https://images.unsplash.com/photo-1610903128120-962cb6eb8a09?w=800')
ON CONFLICT (feature_id, code) DO UPDATE
SET label = EXCLUDED.label,
    price_cents = EXCLUDED.price_cents,
    media = EXCLUDED.media;

-- =======================
-- WHEELS
-- =======================
WITH f AS (SELECT id FROM features WHERE name='wheels')
INSERT INTO options (feature_id, label, price_cents, code, media) VALUES
  ((SELECT id FROM f), 'Gloss Black 20 Spoke',             30000, 'WHL_GLOSS_BLACK_20', 'https://images.unsplash.com/photo-1610911009619-1c6e29045277?w=800'),
  ((SELECT id FROM f), 'Carbon Flash 20 Spoke Red Stripe', 45000, 'WHL_CF_20_RED_STR',  'https://images.unsplash.com/photo-1606813908277-795f8cfc9a9b?w=800'),
  ((SELECT id FROM f), 'Machined Face 5 Split Spoke',      20000, 'WHL_MACHINED_5',     'https://images.unsplash.com/photo-1606813908142-bd70af88f9b9?w=800')
ON CONFLICT (feature_id, code) DO UPDATE
SET label = EXCLUDED.label,
    price_cents = EXCLUDED.price_cents,
    media = EXCLUDED.media;

-- =======================
-- INTERIOR
-- =======================
WITH f AS (SELECT id FROM features WHERE name='interior')
INSERT INTO options (feature_id, label, price_cents, code, media, swatch) VALUES
  ((SELECT id FROM f), 'Sky Cool Gray',  0,     'INT_SKY_COOL_GRAY',  'https://images.unsplash.com/photo-1610903128160-586ecfb3a1c0?w=800', '#e5e7eb'),
  ((SELECT id FROM f), 'Natural Dipped', 20000, 'INT_NATURAL_DIPPED', 'https://images.unsplash.com/photo-1610903128182-3e1ccfd4b326?w=800', '#a16207'),
  ((SELECT id FROM f), 'Adrenaline Red', 25000, 'INT_ADRENALINE_RED', 'https://images.unsplash.com/photo-1610903128204-239b6872cf2b?w=800', '#b91c1c')
ON CONFLICT (feature_id, code) DO UPDATE
SET label = EXCLUDED.label,
    price_cents = EXCLUDED.price_cents,
    media = EXCLUDED.media,
    swatch = EXCLUDED.swatch;

-- =======================
-- Incompatibilities
-- =======================
INSERT INTO incompatible_option_pairs (option_a, option_b)
SELECT a.id, b.id
FROM options a, options b
WHERE a.code='EXT_CARBON_FLASH' AND b.code='ROOF_TRANSPARENT'
ON CONFLICT DO NOTHING;

INSERT INTO incompatible_option_pairs (option_a, option_b)
SELECT a.id, b.id
FROM options a, options b
WHERE a.code='EXT_AMPLIFY_ORANGE' AND b.code='WHL_CF_20_RED_STR'
ON CONFLICT DO NOTHING;
