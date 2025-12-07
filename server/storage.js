const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const DB_PATH = path.join(__dirname, 'data', 'users.json');

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  const content = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(content);
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function findUserByGoogleId(googleId) {
  const db = readDb();
  return db.users.find((user) => user.googleId === googleId) || null;
}

function findUserByEmail(email) {
  const db = readDb();
  return db.users.find((user) => user.email === email) || null;
}

function findUserById(id) {
  const db = readDb();
  return db.users.find((user) => user.id === id) || null;
}

function upsertGoogleUser(profile) {
  const db = readDb();
  let user = db.users.find((item) => item.googleId === profile.id || item.email === profile.email);

  if (user) {
    user.name = profile.displayName;
    user.email = profile.email;
    user.avatarUrl = profile.photo;
    user.updatedAt = new Date().toISOString();
  } else {
    user = {
      id: uuid(),
      googleId: profile.id,
      email: profile.email,
      name: profile.displayName,
      avatarUrl: profile.photo,
      provider: 'GOOGLE',
      createdAt: new Date().toISOString(),
      refreshTokens: [],
    };
    db.users.push(user);
  }

  writeDb(db);
  return user;
}

function persistRefreshToken(userId, refreshToken) {
  const db = readDb();
  const user = db.users.find((item) => item.id === userId);
  if (!user) return null;

  user.refreshTokens = [...new Set([...(user.refreshTokens || []), refreshToken])];
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return user;
}

module.exports = {
  findUserById,
  findUserByGoogleId,
  findUserByEmail,
  upsertGoogleUser,
  persistRefreshToken,
};
