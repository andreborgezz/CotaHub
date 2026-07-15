const API_BASE = 'http://localhost:3000';

function getToken() {
    return localStorage.getItem('cotahub_token');
}

function getUsuario() {
    const raw = localStorage.getItem('cotahub_usuario');
    return raw ? JSON.parse(raw) : null;
}

function salvarSessao(token, usuario) {
    localStorage.setItem('cotahub_token', token);
    localStorage.setItem('cotahub_usuario', JSON.stringify(usuario));
}

function limparSessao() {
    localStorage.removeItem('cotahub_token');
    localStorage.removeItem('cotahub_usuario');
}

function redirecionarLogin() {
    limparSessao();
    window.location.href = 'index.html';
}

async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
        redirecionarLogin();
        throw new Error('Sessão expirada.');
    }

    return res;
}
