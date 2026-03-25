// script.js
let listaProdutos = [];

// Carrega os dados com uma nova chave para evitar conflitos de versões anteriores
window.onload = function () {
  const dadosSalvos = localStorage.getItem("seControla_v3_lista");
  const limiteSalvo = localStorage.getItem("seControla_v3_limite");

  if (dadosSalvos) {
    listaProdutos = JSON.parse(dadosSalvos);
  }

  if (limiteSalvo) {
    document.getElementById("limite-usuario").value = limiteSalvo;
  }

  atualizarInterface();
};

function salvarLimite() {
  const limite = document.getElementById("limite-usuario").value;
  localStorage.setItem("seControla_v3_limite", limite);
  atualizarInterface();
}

function adicionar() {
  const inputNome = document.getElementById("nome-item");
  const inputQtd = document.getElementById("qtd-item");
  const inputPreco = document.getElementById("preco-item");

  const nome = inputNome.value;
  const qtd = parseInt(inputQtd.value);
  const preco = parseFloat(inputPreco.value);

  // Validação rigorosa para evitar NaN
  if (
    nome.trim() === "" ||
    isNaN(preco) ||
    preco <= 0 ||
    isNaN(qtd) ||
    qtd <= 0
  ) {
    const errorColor = "#e53e3e";
    inputNome.style.borderColor = nome.trim() === "" ? errorColor : "#e2e8f0";
    inputPreco.style.borderColor =
      isNaN(preco) || preco <= 0 ? errorColor : "#e2e8f0";
    inputQtd.style.borderColor =
      isNaN(qtd) || qtd <= 0 ? errorColor : "#e2e8f0";

    setTimeout(() => {
      inputNome.style.borderColor = "#e2e8f0";
      inputPreco.style.borderColor = "#e2e8f0";
      inputQtd.style.borderColor = "#e2e8f0";
    }, 2000);
    return;
  }

  // Salvando com nomes de propriedades claros
  listaProdutos.push({
    id: Date.now(),
    nome: nome,
    preco: preco,
    qtd: qtd,
  });

  salvarEDesenhar();

  inputNome.value = "";
  inputPreco.value = "";
  inputQtd.value = "1";
  inputNome.focus();
}

function remover(id) {
  listaProdutos = listaProdutos.filter(item => item.id !== id);
  salvarEDesenhar();
}

function salvarEDesenhar() {
  localStorage.setItem("seControla_v3_lista", JSON.stringify(listaProdutos));
  atualizarInterface();
}

function atualizarInterface() {
  const listaUI = document.getElementById("lista-produtos");
  const displayTotal = document.getElementById("display-total");
  const cardStatus = document.getElementById("status-card");
  const limite = parseFloat(localStorage.getItem("seControla_v3_limite")) || 0;

  let totalGeral = 0;
  listaUI.innerHTML = "";

  if (listaProdutos.length === 0) {
    listaUI.innerHTML = `<li class="product-item" style="justify-content: center; color: #718096; font-size: 0.9rem;">Sua lista está vazia.</li>`;
  }

  listaProdutos.forEach(item => {
    // Fallback para 1 caso a qtd seja undefined por erro de dado antigo
    const quantidade = item.qtd || 1;
    const precoUnitario = item.preco || 0;
    const subtotal = precoUnitario * quantidade;

    totalGeral += subtotal;

    const li = document.createElement("li");
    li.className = "product-item";
    li.innerHTML = `
            <div class="item-main-info">
                <div class="item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                </div>
                <div>
                    <p class="item-name">${item.nome} <small style="font-weight:400; color:#718096">(${quantidade}x)</small></p>
                    <p class="item-price-small">R$ ${precoUnitario.toFixed(2)} por unidade</p>
                </div>
            </div>
            <div class="item-actions">
                <span class="item-price-final">R$ ${subtotal.toFixed(2)}</span>
                <button class="btn-delete" onclick="remover(${item.id})" title="Remover ${item.nome}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `;
    listaUI.appendChild(li);
  });

  displayTotal.innerText = `R$ ${totalGeral.toFixed(2)}`;

  if (limite > 0 && totalGeral > limite) {
    cardStatus.classList.add("excedido");
  } else {
    cardStatus.classList.remove("excedido");
  }
}
