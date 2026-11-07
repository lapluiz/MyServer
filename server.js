const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
        const file = fs.readFileSync(
            path.join(__dirname, "index.html"),
            "utf8"
        );

        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(file);
        return;
    }

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Página não encontrada");
});

server.listen(3000, "0.0.0.0", () => {
    console.log("Aplicação Node.js rodando na porta 3000");
});