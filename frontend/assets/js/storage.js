// Persistência local (protótipo — nenhum dado sai deste dispositivo)

const DB_USERS = "safeher_users";
const DB_SESSION = "safeher_session";
const DB_HISTORY = "safeher_history";

function getUsers() {
    return JSON.parse(localStorage.getItem(DB_USERS) || "[]");
}

function saveUsers(users) {
    localStorage.setItem(DB_USERS, JSON.stringify(users));
}

function findUserByEmail(email) {
    return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function createUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
}

function updateUser(email, changes) {
    const users = getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...changes };
    saveUsers(users);
    return users[idx];
}

function setSession(usuarioObj) {
    localStorage.setItem(DB_SESSION, JSON.stringify(usuarioObj));
}

function getSession() {
    const data = localStorage.getItem(DB_SESSION);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

function clearSession() {
    localStorage.removeItem(DB_SESSION);
}

function getHistory(email) {
    const all = JSON.parse(localStorage.getItem(DB_HISTORY) || "{}");
    return all[email] || [];
}

function addHistoryEntry(email, entry) {
    const all = JSON.parse(localStorage.getItem(DB_HISTORY) || "{}");
    if (!all[email]) all[email] = [];
    all[email].unshift(entry);
    localStorage.setItem(DB_HISTORY, JSON.stringify(all));
}
