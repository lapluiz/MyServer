---
name: Open Localhost
description: Abre a aplicação local (http://localhost:3000) no navegador Chrome.
---

# Open Localhost

Esta skill instrui o agente a abrir a URL do localhost no navegador do usuário quando o gatilho for detectado.

## Gatilho
`/// open localhost`

## Procedimento

1.  **Identificar Intenção**:
    *   Verificar se o usuário digitou exatamente `/// open localhost` ou variações próximas.

2.  **Executar Comando de Abertura**:
    *   Como o usuário está no Windows, o comando para abrir o Chrome especificamente é `start chrome http://localhost:3000`.
    *   Caso queira usar o navegador padrão, use `start http://localhost:3000`.
    *   **Ação**: Execute `run_command` com `CommandLine: "start chrome http://localhost:3000"`.

3.  **Feedback**:
    *   Responda com um feedback visual:
        ```diff
        + 🚀 Abrindo http://localhost:3000 no Chrome...
        ```
