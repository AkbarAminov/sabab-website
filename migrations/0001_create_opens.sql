-- Tracks every PDF (portfolio/services) that actually gets served, for the
-- password-protected /stats page.
CREATE TABLE IF NOT EXISTS opens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  opened_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  file TEXT NOT NULL,
  locale TEXT NOT NULL,
  country TEXT
);

CREATE INDEX IF NOT EXISTS opens_opened_at_idx ON opens (opened_at);
