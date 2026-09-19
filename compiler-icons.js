const fs = require('fs').promises;
const path = require('path');

// Configurações
const inputFolderPath = path.resolve(__dirname, 'src/svg-icon/');
const outputSpritePath = path.resolve(__dirname, 'src/assets/icons/icons-sprite.svg');

const objColor = [
    { "#E6F5FB": "var(--c01-bg, #ffffff)" },
    { "#B4E0F2": "var(--c01-ulgt, #ffffff)" },
    { "#81CBEA": "var(--c01-slgt, #ffffff)" },
    { "#4FB7E2": "var(--c01-lgt, #ffffff)" },
    { "#0498D5": "var(--c01-base, #ffffff)" },
    { "#037AAA": "var(--c01-drk, #ffffff)" },
    { "#025B80": "var(--c01-sdrk, #ffffff)" },
    { "#012E40": "var(--c01-udrk, #ffffff)" },
    { "#FF6600": "var(--clr-icon, #ffffff)" },
    { "yellow": "var(--clr-icon, #ffffff)" },
    { "#FF0000": "var(--clr-icon-out, #ffffff)" },
    { "#F7ADAF": "var(--clr-state, #ffffff)" },
    { "white": "var(--clr-white, #ffffff)" },
    { "#F7F7F7": "var(--clr-board-lgt, #ffffff)" },
    { "#F0F0F0": "var(--clr-board, #ffffff)" },
    { "#D9D9D9": "var(--clr-bg, #ffffff)" },
    { "#CCCCCC": "var(--clr-sys-off, #ffffff)" },
    { "#4D4D4D": "var(--clr-sys-low, #ffffff)" },
    { "black": "var(--clr-black, #ffffff)" },
    { "lime": "var(--c02-base, #ffffff)" }
];

const genericReplacements = [
    { find: "fill-rule:nonzero", replace: "" },
    { find: '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', replace: "" },
    { find: '<?xml version="1.0" encoding="UTF-8"?>', replace: "" },
    { find: 'xmlns:xlink="http://www.w3.org/1999/xlink"', replace: "" },
    { find: 'xmlns:xodm="http://www.corel.com/coreldraw/odm/2003"', replace: "" },
    { find: 'xmlns="http://www.w3.org/2000/svg"', replace: "" }
];

function replaceAllPolyfill(str, find, replace) {
    return str.split(find).join(replace);
}

async function transformSVGContent(svgContent) {
    let modifiedContent = svgContent;

    // 1. Tenta processar Styles/Classes (sua lógica original corrigida)
    const defsMatch = modifiedContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (defsMatch && defsMatch[1]) {
        let styleContent = defsMatch[1].replace('<![CDATA[', '').replace(']]>', '');
        const rules = styleContent.trim().split('}');

        rules.forEach(rule => {
            const parts = rule.split('{');
            if (parts.length === 2) {
                const className = parts[0].trim().replace('.', '');
                let properties = parts[1];

                objColor.forEach(colorObj => {
                    for (const [oldCol, newCol] of Object.entries(colorObj)) {
                        const reg = new RegExp(oldCol, 'gi');
                        properties = properties.replace(reg, newCol);
                    }
                });

                // Aplica a troca de classe por atributo fill direto para simplificar o sprite
                const classRegex = new RegExp(`class="${className}"`, 'gi');
                const fillMatch = properties.match(/fill:\s*([^;]+)/i);
                if (fillMatch) {
                    modifiedContent = modifiedContent.replace(classRegex, `fill="${fillMatch[1].trim()}"`);
                }
            }
        });
    }

    // 2. Processa cores em atributos diretos (fill="#xxxx")
    objColor.forEach(colorObj => {
        for (const [oldCol, newCol] of Object.entries(colorObj)) {
            const attrRegex = new RegExp(`fill="${oldCol}"`, 'gi');
            modifiedContent = modifiedContent.replace(attrRegex, `fill="${newCol}"`);
        }
    });

    // 3. Limpeza Geral
    let previousContent;
    do {
        previousContent = modifiedContent;
        modifiedContent = modifiedContent.replace(/<g[^>]*>([\s\S]*?)<\/g>/gi, '$1');
    } while (modifiedContent !== previousContent);

    genericReplacements.forEach(r => {
        modifiedContent = replaceAllPolyfill(modifiedContent, r.find, r.replace);
    });

    // Remove tags de abertura/fechamento e metadados, sobrando apenas o conteúdo interno
    return modifiedContent
        .replace(/<svg[^>]*>/i, '')
        .replace(/<\/svg>/i, '')
        .replace(/<defs>[\s\S]*?<\/defs>/gi, '')
        .trim();
}

async function buildBundle() {
    try {
        const files = await fs.readdir(inputFolderPath);
        const svgFiles = files.filter(f => f.toLowerCase().endsWith('.svg'));

        if (svgFiles.length === 0) {
            console.log("Nenhum arquivo SVG encontrado na pasta.");
            return;
        }

        let spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="display:none">\n`;

        for (const file of svgFiles) {
            const filePath = path.join(inputFolderPath, file);
            const rawContent = await fs.readFile(filePath, 'utf8');

            // Extrair o viewBox original para manter a proporção correta
            const viewBoxMatch = rawContent.match(/viewBox="([^"]+)"/i);
            const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 512 512";

            const cleanInnerContent = await transformSVGContent(rawContent);
            // Evita prefixo duplo se o nome do arquivo já começar com o prefixo desejado
            let finalName = path.parse(file).name;
            if (finalName.startsWith('icon-GEN-')) {
                // Se o prefixo já existe no nome do arquivo, usa como está
            } else {
                finalName = `icon-GEN-${finalName}`;
            }
            const id = finalName;

            spriteContent += `  <symbol id="${id}" viewBox="${viewBox}">\n    ${cleanInnerContent}\n  </symbol>\n`;
            console.log(`✓ Processado: ${id}`);
        }

        spriteContent += `</svg>`;
        await fs.writeFile(outputSpritePath, spriteContent, 'utf8');
        console.log(`\n🚀 Sucesso! Arquivo gerado: ${outputSpritePath}`);

    } catch (error) {
        console.error('Erro crítico:', error);
    }
}

buildBundle();