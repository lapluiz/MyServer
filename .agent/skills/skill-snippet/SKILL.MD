---
name: Criar Snippet VS Code da Seleção
description: Cria um arquivo de snippet (.code-snippets) no projeto a partir do código selecionado pelo usuário.
---

# Criar Snippet VS Code da Seleção

Esta skill permite converter o código selecionado no editor em um snippet reutilizável do VS Code.

## Quando usar
Use esta skill quando o usuário tiver um código selecionado e pedir para "criar snippet", "gerar snippet" ou "salvar como snippet".

## Requisitos de Entrada
O usuário deve ter selecionado um bloco de código onde a **primeira linha** segue o padrão:
`/// linguagem, gatilho, descrição`
Ex: `/// javascript, log, Console Log Personalizado`

## Procedimento

1.  **Obter e Validar Seleção**:
    *   Leia o arquivo ativo usando `view_file`.
    *   Extraia APENAS o texto que foi selecionado pelo usuário.
    *   **Verificação**: Se não houver seleção ou se a primeira linha não começar com `///`, pare e peça ao usuário para formatar a seleção corretamente.

2.  **Processar Metadados (Header)**:
    *   Analise a primeira linha da seleção: `/// <lang>, <trigger>, <description>`
    *   `lang`: Linguagem alvo (ex: `javascript`, `html`, `css`). Define o nome do arquivo de destino (ex: `.vscode/javascript.code-snippets`).
    *   `trigger`: O prefixo que o usuário digitará para chamar o snippet.
    *   `description`: Resumo do que o snippet faz.

3.  **Processar o Corpo (Body)**:
    *   Pegue todo o conteúdo da seleção **após** a primeira linha.
    *   Transforme as linhas em um Array de Strings JSON:
        *   Escape aspas duplas (`"` vira `\"`).
        *   Mantenha a indentação original.
        *   Exemplo:
            ```javascript
            // Entrada:
            console.log("Oi");
            
            // Saída JSON:
            "body": [
                "console.log(\"Oi\");"
            ]
            ```

4.  **Salvar o Snippet**:
    *   Determine o arquivo de destino: `.vscode/<lang>.code-snippets`.
    *   Se o arquivo não existir, crie-o com a estrutura básica: `{}`.
    *   Se já existir, leia o conteúdo (JSON) e adicione a nova chave.
    *   **Formato Final a Inserir**:
        ```json
        "<description>": {
            "prefix": "<trigger>",
            "body": [
                "<linha1>",
                "<linha2>"
            ],
            "description": "<description>"
        }
        ```
    *   Use `tools` apropriadas para ler e editar o JSON do arquivo alvo.

6.  **Feedback**:
    *   Responda ao usuário com um bloco `diff` para simular a cor verde e use emojis:
        ```markdown
        ```✅ SUCESSO: Snippet Criado!
        + Trigger: <trigger>
        + Arquivo: .vscode/<lang>.code-snippets
        ```
        ```
