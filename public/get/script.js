const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#cpf-search");
const tableBody = document.querySelector("#people-table");
const emptyState = document.querySelector("#empty");
const resultCount = document.querySelector("#result-count");
const message = document.querySelector("#message");
const showAllButton = document.querySelector("#show-all");

CrudApp.configurarMascaras();

function renderizarPessoas(pessoas) {
  tableBody.innerHTML = pessoas
    .map((pessoa) => {
      const nomeCompleto = `${pessoa.nome} ${pessoa.sobrenome}`;
      const cidadeEstado = `${pessoa.cidade}/${pessoa.estado}`;

      return `
        <tr>
          <td>${CrudApp.escaparHtml(pessoa.cpf)}</td>
          <td>${CrudApp.escaparHtml(nomeCompleto)}</td>
          <td>${CrudApp.escaparHtml(pessoa.email)}</td>
          <td>${CrudApp.escaparHtml(pessoa.idade)}</td>
          <td>${CrudApp.escaparHtml(pessoa.telefone)}</td>
          <td>${CrudApp.escaparHtml(cidadeEstado)}</td>
          <td>${CrudApp.escaparHtml(pessoa.rg)}</td>
        </tr>`;
    })
    .join("");

  emptyState.hidden = pessoas.length > 0;
  const rotulo =
    pessoas.length === 1 ? "registro encontrado" : "registros encontrados";
  resultCount.textContent = `${pessoas.length} ${rotulo}`;
}

async function carregarPessoas(url = CrudApp.API_URL) {
  CrudApp.ocultarMensagem(message);
  try {
    const response = await fetch(url);
    renderizarPessoas(await CrudApp.respostaJson(response));
  } catch (error) {
    renderizarPessoas([]);
    CrudApp.exibirMensagem(message, error.message, "error");
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!CrudApp.cpfValido(searchInput.value)) {
    CrudApp.exibirMensagem(
      message,
      "Informe um CPF válido para realizar a busca.",
      "error",
    );
    searchInput.focus();
    return;
  }
  const cpf = CrudApp.formatarCpf(searchInput.value);
  carregarPessoas(`${CrudApp.API_URL}?cpf=${encodeURIComponent(cpf)}`);
});

showAllButton.addEventListener("click", () => {
  searchForm.reset();
  carregarPessoas();
});
carregarPessoas();
