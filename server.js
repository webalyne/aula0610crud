const path = require("path");
const express = require("express");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const publicDirectory = path.join(__dirname, "public");
const port = process.env.PORT || 3000;

server.disable("x-powered-by");
server.use(express.static(publicDirectory));
server.use(jsonServer.bodyParser);

server.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

server.get("/", (_request, response) => {
  response.sendFile(path.join(publicDirectory, "index.html"));
});

server.use("/api", router);

server.use((_request, response) => {
  response.status(404).sendFile(path.join(publicDirectory, "404.html"));
});

server.listen(port, () => {
  console.log(`Servidor disponível em http://localhost:${port}`);
});
