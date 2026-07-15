document.addEventListener('DOMContentLoaded', () => {
    if (getToken()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form    = document.getElementById('form-login');
    const alert   = document.getElementById('alert');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('btn-spinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true);
        hideAlert();

        const email = form.email.value.trim();
        const senha = form.senha.value;

        try {
            const res = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            const data = await res.json();

            if (!res.ok) {
                showAlert(data.erro || 'Credenciais inválidas.');
                return;
            }

            salvarSessao(data.token, data.usuario);
            window.location.href = 'dashboard.html';
        } catch {
            showAlert('Não foi possível conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(on) {
        form.querySelector('button[type="submit"]').disabled = on;
        btnText.textContent = on ? 'Entrando...' : 'Entrar';
        spinner.style.display = on ? 'inline-block' : 'none';
    }

    function showAlert(msg) {
        alert.textContent = msg;
        alert.className = 'alert alert-error show';
    }

    function hideAlert() {
        alert.className = 'alert';
    }
});
