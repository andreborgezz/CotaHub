const MOEDAS = [
    { id: 'dolar',         code: 'USD', label: 'Dólar Americano',  endpoint: '/api/cotacoes/dolar' },
    { id: 'euro',          code: 'EUR', label: 'Euro',             endpoint: '/api/cotacoes/euro' },
    { id: 'peso-argentino',code: 'ARS', label: 'Peso Argentino',   endpoint: '/api/cotacoes/peso-argentino' },
    { id: 'peso-chileno',  code: 'CLP', label: 'Peso Chileno',     endpoint: '/api/cotacoes/peso-chileno' },
    { id: 'peso-uruguaio', code: 'UYU', label: 'Peso Uruguaio',    endpoint: '/api/cotacoes/peso-uruguaio' },
];

document.addEventListener('DOMContentLoaded', () => {
    if (!getToken()) {
        window.location.href = 'index.html';
        return;
    }

    const usuario = getUsuario();

    document.getElementById('user-name').textContent = usuario?.nome || usuario?.email || 'Usuário';
    document.getElementById('btn-logout').addEventListener('click', () => {
        limparSessao();
        window.location.href = 'index.html';
    });

    document.getElementById('btn-refresh').addEventListener('click', carregarCotacoes);

    setupTrocaSenha(usuario);
    carregarCotacoes();
});

function fmt(valor) {
    if (valor == null) return '—';
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function variacao(compra, fechoAnterior) {
    if (!compra || !fechoAnterior) return null;
    return ((compra - fechoAnterior) / fechoAnterior) * 100;
}

function variacaoEl(pct) {
    if (pct == null) return '<span class="card-variation flat">—</span>';
    const sinal = pct >= 0 ? '+' : '';
    const cls   = pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat';
    return `<span class="card-variation ${cls}">${sinal}${pct.toFixed(2)}%</span>`;
}

function renderSkeleton() {
    return `
      <div class="card-loading">
        <div class="card-header">
          <div>
            <div class="skeleton sk-code"></div>
            <div class="skeleton sk-name" style="margin-top:8px"></div>
          </div>
        </div>
        <div class="card-prices">
          <div>
            <div class="skeleton sk-label"></div>
            <div class="skeleton sk-price"></div>
          </div>
          <div>
            <div class="skeleton sk-label"></div>
            <div class="skeleton sk-price"></div>
          </div>
        </div>
        <div class="card-footer">
          <div class="skeleton sk-footer"></div>
        </div>
      </div>`;
}

function renderCard(moeda, data) {
    const pct = variacao(data.compra, data.fechoAnterior);
    return `
      <div class="card-header">
        <div>
          <span class="currency-code">${moeda.code}</span>
          <div class="currency-name">${data.nome || moeda.label}</div>
        </div>
        ${variacaoEl(pct)}
      </div>
      <div class="card-prices">
        <div class="price-item">
          <div class="price-label">Compra</div>
          <div class="price-value buy">R$ ${fmt(data.compra)}</div>
        </div>
        <div class="price-item">
          <div class="price-label">Venda</div>
          <div class="price-value">R$ ${fmt(data.venda)}</div>
        </div>
      </div>
      <div class="card-footer">
        <span class="prev-close-label">Fechamento ant.</span>
        <span class="prev-close-value">R$ ${fmt(data.fechoAnterior)}</span>
      </div>
      <div class="card-timestamp">${data.dataAtualizacao || ''}</div>`;
}

function renderError(moeda) {
    return `
      <div class="card-error">
        <div class="card-error-icon">&#x26A0;</div>
        <div class="card-error-msg">Falha ao carregar<br>${moeda.code}</div>
        <button class="btn btn-ghost btn-sm" onclick="recarregarCard('${moeda.id}')">Tentar novamente</button>
      </div>`;
}

async function carregarCard(moeda) {
    const el = document.getElementById(`card-${moeda.id}`);
    el.innerHTML = renderSkeleton();

    try {
        const res = await apiFetch(moeda.endpoint);
        if (!res.ok) throw new Error();
        const data = await res.json();
        el.innerHTML = renderCard(moeda, data);
    } catch {
        el.innerHTML = renderError(moeda);
    }
}

function carregarCotacoes() {
    atualizarHoraRefresh();
    MOEDAS.forEach(m => carregarCard(m));
}

window.recarregarCard = function(id) {
    const moeda = MOEDAS.find(m => m.id === id);
    if (moeda) carregarCard(moeda);
};

function atualizarHoraRefresh() {
    const el = document.getElementById('last-update');
    if (el) {
        el.textContent = new Date().toLocaleTimeString('pt-BR');
    }
}

function setupTrocaSenha(usuario) {
    const form      = document.getElementById('form-senha');
    const alertEl   = document.getElementById('alert-senha');
    const btnText   = document.getElementById('btn-senha-text');
    const spinner   = document.getElementById('btn-senha-spinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const novaSenha    = form['nova-senha'].value;
        const confirma     = form['confirma-senha'].value;

        hideAlert(alertEl);

        if (novaSenha.length < 6) {
            showAlert(alertEl, 'A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        if (novaSenha !== confirma) {
            showAlert(alertEl, 'As senhas não coincidem.', 'error');
            return;
        }

        setLoading(true, btnText, spinner, form);

        try {
            const res = await apiFetch(`/api/usuarios/${usuario.id}`, {
                method: 'PUT',
                body: JSON.stringify({ senha: novaSenha }),
            });

            const data = await res.json();

            if (!res.ok) {
                showAlert(alertEl, data.erro || 'Erro ao atualizar senha.', 'error');
                return;
            }

            showAlert(alertEl, 'Senha atualizada com sucesso.', 'success');
            form.reset();
        } catch (err) {
            if (err.message !== 'Sessão expirada.') {
                showAlert(alertEl, 'Não foi possível conectar ao servidor.', 'error');
            }
        } finally {
            setLoading(false, btnText, spinner, form);
        }
    });
}

function setLoading(on, btnText, spinner, form) {
    form.querySelector('button[type="submit"]').disabled = on;
    btnText.textContent = on ? 'Salvando...' : 'Salvar nova senha';
    spinner.style.display = on ? 'inline-block' : 'none';
}

function showAlert(el, msg, type) {
    el.textContent = msg;
    el.className = `alert alert-${type} show`;
}

function hideAlert(el) {
    el.className = 'alert';
}
