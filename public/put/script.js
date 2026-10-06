const searchForm = document.querySelector("#search-form");
const personForm = document.querySelector("#person-form");
const message = document.querySelector("#message");
const personId = document.querySelector("#person-id");
const cancelButton = document.querySelector("#cancel-edit");
let cpfOriginal = "";

CrudApp.configurarMascaras();

function preencherFormulario(pessoa) {
  personId.value = pessoa.id;
  cpfOriginal = pessoa.cpf;
  Object.entries(pessoa).forEach(([key, value]) => {
    if (personForm.elements[key]) personForm.elements[key].value = value;
  });
  personForm.hidden = false;
}

function fecharFormulario() {
  personForm.reset();
  personForm.hidden = true;
  personId.value = "";
  cpfOriginal = "";
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  CrudApp.ocultarMensagem(message);
  fecharFormulario();
  const cpf = searchForm.elements.cpfSearch.value;
  if (!CrudApp.cpfValido(cpf)) {
    CrudApp.exibirMensagem(
      message,
      "Informe um CPF válido para realizar a busca.",
      "error",
    );
    return;
  }
  try {
    const pessoa = await CrudApp.buscarPorCpf(cpf);
    if (!pessoa)
      throw new Error("Nenhum cadastro foi encontrado para este CPF.");
    preencherFormulario(pessoa);
    CrudApp.exibirMensagem(
      message,
      "Cadastro carregado. Edite os campos e salve as alterações.",
      "info",
    );
  } catch (error) {
    CrudApp.exibirMensagem(message, error.message, "error");
  }
});

personForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (
    !personForm.reportValidity() ||
    !CrudApp.cpfValido(personForm.cpf.value)
  ) {
    CrudApp.exibirMensagem(
      message,
      "Revise os campos destacados antes de continuar.",
      "error",
    );
    return;
  }
  const submitButton = personForm.querySelector('[type="submit"]');
  submitButton.disabled = true;
  try {
    const dados = CrudApp.dadosDoFormulario(personForm);
    if (dados.cpf !== cpfOriginal) {
      const duplicado = await CrudApp.buscarPorCpf(dados.cpf);
      if (duplicado && String(duplicado.id) !== String(personId.value))
        throw new Error("O novo CPF já pertence a outro cadastro.");
    }
    const response = await fetch(`${CrudApp.API_URL}/${personId.value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    const pessoa = await CrudApp.respostaJson(response);
    searchForm.reset();
    fecharFormulario();
    CrudApp.exibirMensagem(
      message,
      `Cadastro de ${pessoa.nome} ${pessoa.sobrenome} atualizado com sucesso.`,
    );
  } catch (error) {
    CrudApp.exibirMensagem(message, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

cancelButton.addEventListener("click", () => {
  fecharFormulario();
  CrudApp.ocultarMensagem(message);
});
