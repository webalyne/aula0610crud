const searchForm = document.querySelector("#search-form");
const message = document.querySelector("#message");
const confirmation = document.querySelector("#confirmation");
const personName = document.querySelector("#person-name");
const personDetails = document.querySelector("#person-details");
const deleteButton = document.querySelector("#delete-button");
const cancelButton = document.querySelector("#cancel-delete");
let selectedPerson = null;

CrudApp.configurarMascaras();

function limparSelecao() {
  selectedPerson = null;
  confirmation.hidden = true;
  personName.textContent = "";
  personDetails.textContent = "";
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  CrudApp.ocultarMensagem(message);
  limparSelecao();
  const cpf = searchForm.elements.cpf.value;
  if (!CrudApp.cpfValido(cpf)) {
    CrudApp.exibirMensagem(
      message,
      "Informe um CPF válido para realizar a busca.",
      "error",
    );
    return;
  }
  try {
    selectedPerson = await CrudApp.buscarPorCpf(cpf);
    if (!selectedPerson)
      throw new Error("Nenhum cadastro foi encontrado para este CPF.");
    personName.textContent = `${selectedPerson.nome} ${selectedPerson.sobrenome}`;
    personDetails.textContent = [
      selectedPerson.cpf,
      selectedPerson.email,
      `${selectedPerson.cidade}/${selectedPerson.estado}`,
    ].join(" · ");
    confirmation.hidden = false;
    CrudApp.exibirMensagem(
      message,
      "Registro encontrado. Confira os dados antes de excluir.",
      "info",
    );
  } catch (error) {
    CrudApp.exibirMensagem(message, error.message, "error");
  }
});

deleteButton.addEventListener("click", async () => {
  if (!selectedPerson) return;
  deleteButton.disabled = true;
  try {
    const name = `${selectedPerson.nome} ${selectedPerson.sobrenome}`;
    const response = await fetch(`${CrudApp.API_URL}/${selectedPerson.id}`, {
      method: "DELETE",
    });
    await CrudApp.respostaJson(response);
    searchForm.reset();
    limparSelecao();
    CrudApp.exibirMensagem(
      message,
      `Cadastro de ${name} excluído com sucesso.`,
    );
  } catch (error) {
    CrudApp.exibirMensagem(message, error.message, "error");
  } finally {
    deleteButton.disabled = false;
  }
});

cancelButton.addEventListener("click", () => {
  limparSelecao();
  searchForm.reset();
  CrudApp.ocultarMensagem(message);
});
