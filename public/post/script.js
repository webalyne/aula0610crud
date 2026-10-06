const form = document.querySelector("#person-form");
const message = document.querySelector("#message");

CrudApp.configurarMascaras();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  CrudApp.ocultarMensagem(message);
  if (!form.reportValidity() || !CrudApp.cpfValido(form.cpf.value)) {
    CrudApp.exibirMensagem(
      message,
      "Revise os campos destacados antes de continuar.",
      "error",
    );
    return;
  }
  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  try {
    const existente = await CrudApp.buscarPorCpf(form.cpf.value);
    if (existente)
      throw new Error(
        "Este CPF já está cadastrado. Use a página Editar para alterar o registro.",
      );
    const response = await fetch(CrudApp.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(CrudApp.dadosDoFormulario(form)),
    });
    const pessoa = await CrudApp.respostaJson(response);
    form.reset();
    CrudApp.exibirMensagem(
      message,
      `Cadastro de ${pessoa.nome} ${pessoa.sobrenome} realizado com sucesso.`,
    );
  } catch (error) {
    CrudApp.exibirMensagem(message, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});
