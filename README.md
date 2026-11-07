# MyServer

Aplicação Node.js base para testes locais em `http://localhost:3000`.

**Stack:** Node.js 22 · Express 5 · Socket.io 4 · HTML/CSS/JS puro (sem build)

## Requisitos

- Node.js **22.13.1** ou superior (`node -v`)

## Como rodar

```bash
npm install          # primeira vez
npm run dev          # desenvolvimento: reinicia sozinho ao salvar arquivos de src/
# ou
npm start            # execução normal
```

Abra **http://localhost:3000**. A página inicial testa:

- **Servidor:** consulta `GET /api/health` a cada 10 s
- **Tempo real:** conexão Socket.io, clientes online e latência (ping/ack)
- **API:** botões que chamam as rotas e mostram a resposta JSON (incluindo um 404)

Para parar: `Ctrl + C`.

## Configuração (`.env`)

Copie `.env.example` para `.env`. O arquivo é lido nativamente pelo Node (`process.loadEnvFile`), sem `dotenv`.

| Variável   | Padrão        | Descrição |
|------------|---------------|-----------|
| `PORT`     | `3000`        | Porta HTTP |
| `HOST`     | `localhost`   | Interface de escuta (`0.0.0.0` para aceitar outros dispositivos da rede) |
| `NODE_ENV` | `development` | Em `production`, erros 500 não expõem detalhes |

## Estrutura

```
MyServer/
├─ public/                 ← única pasta exposta ao navegador
│  ├─ index.html           ← página de teste
│  ├─ css/app.css
│  └─ js/app.js
├─ src/
│  ├─ server.js            ← entrypoint: HTTP + Socket.io + listen + shutdown
│  ├─ app.js               ← Express: middlewares, estáticos, rotas
│  ├─ config/env.js        ← leitura e validação do .env
│  ├─ routes/              ← index.js (/api), health.routes.js (/api/health)
│  ├─ middlewares/         ← notFound.js, errorHandler.js
│  ├─ sockets/index.js     ← eventos do Socket.io
│  ├─ scss/, assets/, svg-icon/, js/, json/   ← design system / front antigo (ainda não integrado)
├─ legacy/                 ← módulos antigos desativados (ver legacy/README.md)
└─ oldProject/             ← apenas referência, fora do projeto
```

## API

| Método | Rota          | Resposta |
|--------|---------------|----------|
| GET    | `/api`        | Lista de endpoints |
| GET    | `/api/health` | `status`, `env`, `node`, `uptime`, `timestamp`, `sockets` |

Rotas inexistentes em `/api/*` retornam `404` em JSON: `{ "error": { "status": 404, "message": "..." } }`.

## Socket.io

| Direção           | Evento          | Dados |
|-------------------|-----------------|-------|
| servidor → cliente | `clients:count` | número de clientes conectados |
| cliente → servidor | `ping:client`   | `(payload, ack)`, e o ack recebe `{ serverTime, echo }` |

Nas rotas, o `io` fica acessível via `req.app.get('io')`.

