const API_URL = "/api/pessoas";

function somenteDigitos(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatarCpf(value) {
  const digits = somenteDigitos(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarTelefone(value) {
  const digits = somenteDigitos(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function cpfValido(value) {
  const cpf = somenteDigitos(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigito = (length) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(cpf[index]) * (length + 1 - index);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calcularDigito(9) === Number(cpf[9]) &&
    calcularDigito(10) === Number(cpf[10])
  );
}

function configurarMascaras(root = document) {
  root.querySelectorAll('[data-mask="cpf"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = formatarCpf(input.value);
      input.setCustomValidity(
        cpfValido(input.value) ? "" : "Informe um CPF válido.",
      );
    });
  });

  root.querySelectorAll('[data-mask="telefone"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = formatarTelefone(input.value);
    });
  });
}

function exibirMensagem(element, text, type = "success") {
  element.textContent = text;
  element.className = `message message--${type}`;
  element.hidden = false;
  element.focus();
}

function ocultarMensagem(element) {
  element.hidden = true;
  element.textContent = "";
}

async function respostaJson(response) {
  if (!response.ok) {
    let detail = "";
    try {
      const payload = await response.json();
      detail = payload.message || payload.error || "";
    } catch (_error) {
      detail = "";
    }
    throw new Error(
      detail || `Não foi possível concluir a operação (${response.status}).`,
    );
  }
  return response.status === 204 ? null : response.json();
}

async function buscarPorCpf(cpf) {
  const response = await fetch(
    `${API_URL}?cpf=${encodeURIComponent(formatarCpf(cpf))}`,
  );
  const pessoas = await respostaJson(response);
  return pessoas[0] || null;
}

function dadosDoFormulario(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    cpf: formatarCpf(data.cpf),
    nome: data.nome.trim(),
    sobrenome: data.sobrenome.trim(),
    email: data.email.trim().toLowerCase(),
    idade: Number(data.idade),
    telefone: formatarTelefone(data.telefone),
    rua: data.rua.trim(),
    bairro: data.bairro.trim(),
    cidade: data.cidade.trim(),
    estado: data.estado.trim().toUpperCase(),
    rg: data.rg.trim(),
  };
}

function escaparHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.CrudApp = {
  API_URL,
  buscarPorCpf,
  configurarMascaras,
  cpfValido,
  dadosDoFormulario,
  escaparHtml,
  exibirMensagem,
  formatarCpf,
  ocultarMensagem,
  respostaJson,
};
