-- Request-popup submissions ("Оставить заявку"), plus a separate table used
-- only to throttle /api/lead by IP (kept apart from `leads` itself so that
-- table's columns stay exactly what /stats displays).
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  name TEXT NOT NULL,
  company TEXT,
  contact TEXT NOT NULL,
  locale TEXT NOT NULL,
  country TEXT,
  telegram_status TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at);

CREATE TABLE IF NOT EXISTS lead_rate_limit (
  ip TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS lead_rate_limit_lookup_idx ON lead_rate_limit (ip, created_at);
