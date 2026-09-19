---
name: Logbox Display
description: Exibe exemplos visuais de diferentes caixas de código e alertas Markdown quando solicitado.
---

# Logbox Display

Esta skill serve para demonstrar visualmente como diferentes linguagens e estilos de Markdown são renderizados no chat.

## Gatilho
O usuário deve enviar uma mensagem contendo o padrão:
`/// logbox : <tipo>`

Exemplos:
- `/// logbox : diff`
- `/// logbox : alert`
- `/// logbox : json`

## Procedimento

1.  **Identificar o Tipo**:
    *   Leia o comando do usuário e extraia o valor após `logbox :`.
    *   Remova espaços em branco extras e converta para minúsculas.

2.  **Selecionar e Exibir o Exemplo**:
    *   Responda IMEDIATAMENTE com o bloco de código correspondente ao tipo solicitado abaixo. Não precisa de explicações longas, apenas o exemplo visual.

    ### Catálogo de Tipos

    **Se tipo == "diff"**:
    ```markdown
    Aqui está um exemplo de **DIFF** (Verde/Vermelho):
    ```diff
    + ✅ Linha adicionada (Verde)
    - ❌ Linha removida (Vermelho)
    ! ⚠️ Linha modificada (Laranja - nem sempre suportado)
    # Comentário cinza
    ```
    ```

    **Se tipo == "alert" ou "alerts"**:
    ```markdown
    Aqui estão os **Alertas GitHub**:
    > [!NOTE]
    > Nota azul de informação.

    > [!TIP]
    > Dica verde de sucesso.

    > [!IMPORTANT]
    > Importante (Roxo).

    > [!WARNING]
    > Aviso amarelo de atenção.

    > [!CAUTION]
    > Cuidado vermelho de erro.
    ```

    **Se tipo == "json"**:
    ```markdown
    Exemplo de **JSON** (Destaque de chaves e valores):
    ```json
    {
      "status": "success",
      "code": 200,
      "data": {
        "message": "Operação realizada",
        "ids": [1, 2, 3]
      }
    }
    ```
    ```

    **Se tipo == "js" ou "javascript"**:
    ```markdown
    Exemplo de **JavaScript**:
    ```javascript
    function hello(name) {
        const message = `Olá, ${name}!`;
        console.log(message);
        return true;
    }
    ```
    ```

    **Se tipo == "all" ou "todos"**:
    *   Exiba todos os exemplos acima em sequência.

    **Se tipo não for reconhecido**:
    *   Responda: "Tipo de logbox desconhecido. Tente: diff, alert, json, js".

3.  **Finalização**:
    *   Pergunte se esse é o estilo que o usuário procurava.
