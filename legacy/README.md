# legacy/

Módulos da versão anterior do MyServer, **desativados**: não são carregados pelo servidor nem servidos ao navegador.
Ficam aqui para serem reintegrados depois como módulos da nova estrutura (`src/routes`, `src/sockets` etc.).

> ⚠️ Os caminhos de `require`/`import` dentro destes arquivos refletem a estrutura antiga e **não funcionam** como estão.

| Módulo | Arquivos | Dependências npm que precisará reinstalar |
|---|---|---|
| WhatsApp (Geniuz) | `server/BCKND-script-whats.js`, `js/FNTND-script-whats.js`, `pages/index_whats.html` | `axios` (ou trocar por `fetch` nativo) |
| ESP32 | `server/BCKND-script-esp32.js`, `js/FNTND-script-esp32.js`, `pages/index_esp32.html` | nenhuma (usa Socket.io, já na base) |
| Gemini / IA | `js/FNTND-script-main.js`, `json/JSON-IASchemas.json`, `routes/api.routes.js` (`/api/config`) | `@google/generative-ai`. ⚠️ A chave deve ficar no backend, nunca ir para o navegador |
| CRUD MySQL | `server/BCKND-mySQL.js`, `server/BCKND-serv-dinamiccrud.js`, `server/BCKND-script-crudController.js`, `routes/crud.routes.js` | `mysql2` |
| Teste MongoDB | `server/BCKND-model-product.js`, `routes/test.routes.js`, `js/FNTND-script-mongoCrud.js`, `js/FNTND-script-requests.js` | `mongoose` |
| App antigo | `server/BCKND-script-app.js` (entrypoint antigo, substituído por `src/server.js`) | `cors`, `body-parser`, `dotenv` (não são mais necessários) |
| Páginas antigas | `pages/hello-world.html` (antigo `index.html` da raiz), `pages/localhost-dash.html` (antigo `public/index.html`) | — |

