# CRUD de pessoas com busca por CPF

Projeto acadêmico com as quatro operações CRUD em páginas separadas.
O Express publica o front-end e o JSON Server fornece a API REST
em `/api/pessoas`.

## Executar localmente

Requisitos: Node.js 18 ou superior.

```bash
npm install
npm start
```

Acesse `http://localhost:3000`.

O banco começa vazio. Use a página **Cadastrar** para incluir registros.

## Estrutura

- `public/post/`: cadastro de pessoas (POST)
- `public/get/`: listagem e busca por CPF (GET)
- `public/put/`: busca e edição por CPF (PUT)
- `public/delete/`: busca e exclusão por CPF (DELETE)
- `db.json`: banco de dados do JSON Server
- `server.js`: servidor Express e API REST

## Deploy no Render

1. Publique este diretório em um repositório do GitHub.
2. No Render, crie um **Web Service** conectado ao repositório.
3. Use `npm install` como Build Command.
4. Use `node server.js` como Start Command.
5. O arquivo `render.yaml` também permite criar o serviço como Blueprint.

> O sistema de arquivos do plano gratuito do Render é efêmero.
> Alterações feitas no `db.json` podem ser perdidas quando o serviço
> reinicia ou recebe um novo deploy. Para persistência definitiva,
> use um banco gerenciado ou um disco persistente.

## Rotas da API

| Método | Rota                   | Função                   |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/pessoas`         | Lista todos os registros |
| GET    | `/api/pessoas?cpf=...` | Busca um CPF             |
| POST   | `/api/pessoas`         | Cria um registro         |
| PUT    | `/api/pessoas/:id`     | Atualiza um registro     |
| DELETE | `/api/pessoas/:id`     | Exclui um registro       |
