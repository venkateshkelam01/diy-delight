INSERT INTO features (name) VALUES
  ('exterior'),
  ('wheels'),
  ('trim')
ON CONFLICT (name) DO NOTHING;

WITH f AS (SELECT id FROM features WHERE name='exterior')
INSERT INTO options (feature_id, label, price_cents, code, icon) VALUES
  ((SELECT id FROM f), 'Red', 0, 'EXT_RED', '🟥'),
  ((SELECT id FROM f), 'Blue', 0, 'EXT_BLUE', '🟦'),
  ((SELECT id FROM f), 'Matte Black', 15000, 'EXT_MATTE_BLACK', '⬛')
ON CONFLICT DO NOTHING;

WITH f AS (SELECT id FROM features WHERE name='wheels')
INSERT INTO options (feature_id, label, price_cents, code, icon) VALUES
  ((SELECT id FROM f), 'Standard', 0, 'WHL_STD', '⭕'),
  ((SELECT id FROM f), 'Sport', 20000, 'WHL_SPORT', '🏎️'),
  ((SELECT id FROM f), 'Chrome', 30000, 'WHL_CHROME', '✨')
ON CONFLICT DO NOTHING;

WITH f AS (SELECT id FROM features WHERE name='trim')
INSERT INTO options (feature_id, label, price_cents, code, icon) VALUES
  ((SELECT id FROM f), 'Base', 0, 'TRM_BASE', '🧰'),
  ((SELECT id FROM f), 'Premium', 50000, 'TRM_PREMIUM', '💎')
ON CONFLICT DO NOTHING;

INSERT INTO incompatible_option_pairs (option_a, option_b)
SELECT a.id, b.id
FROM options a, options b
WHERE a.code='EXT_MATTE_BLACK' AND b.code='WHL_CHROME'
ON CONFLICT DO NOTHING;
