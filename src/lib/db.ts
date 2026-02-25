import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'linkforge.db');

let db: Database.Database;

function getDb(): Database.Database {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initDb(db);
    }
    return db;
}

function initDb(database: Database.Database) {
    database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT DEFAULT '',
      bio TEXT DEFAULT '',
      avatar_url TEXT DEFAULT '',
      theme TEXT DEFAULT 'midnight',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT DEFAULT '🔗',
      position INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      link_id TEXT NOT NULL,
      referrer TEXT DEFAULT '',
      country TEXT DEFAULT '',
      clicked_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
    );
  `);
}

// ---- User operations ----
export function createUser(id: string, username: string, email: string, passwordHash: string) {
    const stmt = getDb().prepare(
        'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)'
    );
    return stmt.run(id, username, email, passwordHash);
}

export function getUserByUsername(username: string) {
    const stmt = getDb().prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as UserRow | undefined;
}

export function getUserByEmail(email: string) {
    const stmt = getDb().prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as UserRow | undefined;
}

export function getUserById(id: string) {
    const stmt = getDb().prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as UserRow | undefined;
}

export function updateUserProfile(id: string, displayName: string, bio: string, avatarUrl: string, theme: string) {
    const stmt = getDb().prepare(
        'UPDATE users SET display_name = ?, bio = ?, avatar_url = ?, theme = ? WHERE id = ?'
    );
    return stmt.run(displayName, bio, avatarUrl, theme, id);
}

// ---- Link operations ----
export function createLink(id: string, userId: string, title: string, url: string, icon: string) {
    const maxPos = getDb().prepare('SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM links WHERE user_id = ?').get(userId) as { next_pos: number };
    const stmt = getDb().prepare(
        'INSERT INTO links (id, user_id, title, url, icon, position) VALUES (?, ?, ?, ?, ?, ?)'
    );
    return stmt.run(id, userId, title, url, icon, maxPos.next_pos);
}

export function getLinksByUserId(userId: string) {
    const stmt = getDb().prepare('SELECT * FROM links WHERE user_id = ? ORDER BY position ASC');
    return stmt.all(userId) as LinkRow[];
}

export function updateLink(id: string, userId: string, title: string, url: string, icon: string, active: boolean) {
    const stmt = getDb().prepare(
        'UPDATE links SET title = ?, url = ?, icon = ?, active = ? WHERE id = ? AND user_id = ?'
    );
    return stmt.run(title, url, icon, active ? 1 : 0, id, userId);
}

export function deleteLink(id: string, userId: string) {
    const stmt = getDb().prepare('DELETE FROM links WHERE id = ? AND user_id = ?');
    return stmt.run(id, userId);
}

export function incrementLinkClicks(id: string) {
    const stmt = getDb().prepare('UPDATE links SET clicks = clicks + 1 WHERE id = ?');
    return stmt.run(id);
}

export function recordClick(linkId: string, referrer: string, country: string) {
    incrementLinkClicks(linkId);
    const stmt = getDb().prepare(
        'INSERT INTO analytics (link_id, referrer, country) VALUES (?, ?, ?)'
    );
    return stmt.run(linkId, referrer, country);
}

export function getAnalyticsByUserId(userId: string) {
    const stmt = getDb().prepare(`
    SELECT l.title, l.url, l.clicks, COUNT(a.id) as recent_clicks
    FROM links l
    LEFT JOIN analytics a ON a.link_id = l.id AND a.clicked_at > datetime('now', '-7 days')
    WHERE l.user_id = ?
    GROUP BY l.id
    ORDER BY l.clicks DESC
  `);
    return stmt.all(userId);
}

export function getTotalClicks(userId: string): number {
    const stmt = getDb().prepare('SELECT COALESCE(SUM(clicks), 0) as total FROM links WHERE user_id = ?');
    const result = stmt.get(userId) as { total: number };
    return result.total;
}

export function getTotalUsers(): number {
    const stmt = getDb().prepare('SELECT COUNT(*) as total FROM users');
    const result = stmt.get() as { total: number };
    return result.total;
}

// ---- Types ----
export interface UserRow {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    display_name: string;
    bio: string;
    avatar_url: string;
    theme: string;
    created_at: string;
}

export interface LinkRow {
    id: string;
    user_id: string;
    title: string;
    url: string;
    icon: string;
    position: number;
    clicks: number;
    active: number;
    created_at: string;
}
