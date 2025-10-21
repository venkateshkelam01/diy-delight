CREATE TABLE IF NOT EXISTS features (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS options (
  id SERIAL PRIMARY KEY,
  feature_id INTEGER NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price_cents INT NOT NULL DEFAULT 0,
  code TEXT NOT NULL,
  icon TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS incompatible_option_pairs (
  id SERIAL PRIMARY KEY,
  option_a INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  option_b INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  CONSTRAINT unique_pair UNIQUE(option_a, option_b),
  CONSTRAINT not_same CHECK (option_a <> option_b)
);

CREATE TABLE IF NOT EXISTS custom_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  base_price_cents INT NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS item_options (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES custom_items(id) ON DELETE CASCADE,
  feature_id INTEGER NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  option_id INTEGER NOT NULL REFERENCES options(id) ON DELETE CASCADE,
  CONSTRAINT unique_feature_per_item UNIQUE(item_id, feature_id)
);
