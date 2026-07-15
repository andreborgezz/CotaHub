document.addEventListener('DOMContentLoaded', () => {
    const form    = document.getElementById('form-cadastro');
    const alert   = document.getElementById('alert');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('btn-spinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true);
        hideAlert();

        const nome  = form.nome.value.trim();
        const email = form.email.value.trim();
        const senha = form.senha.value;

        if (senha.length < 6) {
            showAlert('A senha deve ter pelo menos 6 caracteres.', 'error');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha }),
            });

            const data = await res.json();

            if (!res.ok) {
                showAlert(data.erro || 'Erro ao criar conta.', 'error');
                return;
            }

            showAlert('Conta criada com sucesso! Redirecionando...', 'success');
            setTimeout(() => { window.location.href = 'index.html'; }, 1500);
        } catch {
            showAlert('Não foi possível conectar ao servidor.', 'error');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(on) {
        form.querySelector('button[type="submit"]').disabled = on;
        btnText.textContent = on ? 'Criando conta...' : 'Criar conta';
        spinner.style.display = on ? 'inline-block' : 'none';
    }

    function showAlert(msg, type) {
        alert.textContent = msg;
        alert.className = `alert alert-${type} show`;
    }

    function hideAlert() {
        alert.className = 'alert';
    }
});
