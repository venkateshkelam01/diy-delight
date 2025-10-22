-- (Optional in dev) Uncomment to wipe and recreate from scratch
-- DROP TABLE IF EXISTS item_options CASCADE;
-- DROP TABLE IF EXISTS custom_items CASCADE;
-- DROP TABLE IF EXISTS incompatible_option_pairs CASCADE;
-- DROP TABLE IF EXISTS options CASCADE;
-- DROP TABLE IF EXISTS features CASCADE;

-- Features
CREATE TABLE IF NOT EXISTS features (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,         -- enforce unique feature keys
  display_name TEXT NOT NULL
);

-- Options
CREATE TABLE IF NOT EXISTS options (
  id SERIAL PRIMARY KEY,
  feature_id INTEGER NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price_cents INT NOT NULL DEFAULT 0,
  code TEXT NOT NULL,                -- canonical option code
  media TEXT DEFAULT '',
  swatch TEXT DEFAULT ''
);

-- retrofitted constraints (for existing DBs)
ALTER TABLE features
  ADD COLUMN IF NOT EXISTS display_name TEXT;

ALTER TABLE options
  ADD COLUMN IF NOT EXISTS media  TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS swatch TEXT DEFAULT '';

-- Enforce uniqueness so reseeds don't duplicate
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'options_code_unique'
  ) THEN
    ALTER TABLE options ADD CONSTRAINT options_code_unique UNIQUE (code);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'options_feature_code_unique'
  ) THEN
    ALTER TABLE options ADD CONSTRAINT options_feature_code_unique UNIQUE (feature_id, code);
  END IF;
END$$;

-- Incompatibilities
CREATE TABLE IF NOT EXISTS incompatible_option_pairs (
  id SERIAL PRIMARY KEY,
  option_a INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  option_b INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  CONSTRAINT unique_pair UNIQUE(option_a, option_b),
  CONSTRAINT not_same CHECK (option_a <> option_b)
);

-- Items
CREATE TABLE IF NOT EXISTS custom_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  base_price_cents INT NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Item selections (1 per feature)
CREATE TABLE IF NOT EXISTS item_options (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES custom_items(id) ON DELETE CASCADE,
  feature_id INTEGER NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  CONSTRAINT unique_feature_per_item UNIQUE(item_id, feature_id)
);
