const sqlite = require("better-sqlite3");
const DB = new sqlite("./agdb.sqlite");

const schema = `
CREATE TABLE IF NOT EXISTS users(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS posts(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    thumbnail TEXT NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    brief TEXT NOT NULL,
    content TEXT NOT NULL,
    posted_date DATE DEFAULT CURRENT_TIMESTAMP,
    updated_date DATE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS events(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    date DATE NOT NULL,
    posted_date DATE DEFAULT CURRENT_TIMESTAMP
);

`;

DB.exec(schema);

module.exports = DB;
