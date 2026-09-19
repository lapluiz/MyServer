export const Pages = {
    home: () => `
        <div class="Gcard" el="card">
            <h1 class="Gtext" el="text" style="font-size: 2.5rem; color: #2c3e50;">Bem-vindo ao Dynamic Node Skeleton</h1>
            <p class="Gtext" el="text" style="color: #666; font-size: 1.1rem; line-height: 1.6;">
                Esta é uma aplicação SPA robusta utilizando:<br>
                <strong>Node.js + Express + MySQL + Sass + Vanilla JS</strong>
            </p>
            <div style="margin-top: 20px;">
                <button class="btn btn-primary" onclick="Router.navigateTo('/products')">Ver Produtos</button>
                <button class="btn btn-secondary" onclick="Router.navigateTo('/contact')">Fale Conosco</button>
            </div>
        </div>
    `,

    products: () => `
        <div class="Gcard" el="card-full" style="--card-max-w: 900px;">
            <h2 class="Gtext" el="text" style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Lista de Produtos</h2>
            
            <div class="Gcontent" el="content" style="--content-dsp: grid; --content-grid-tc: repeat(auto-fill, minmax(200px, 1fr)); --content-gapv: 20px; --content-gaph: 20px;">
                <!-- Itens -->
                <div class="Gsubcard" el="subcard">
                    <div style="width: 50px; height: 50px; background: #ddd; border-radius: 50%; margin-bottom: 10px;"></div>
                    <strong class="Gtext" el="text">Produto A</strong>
                    <span class="Gtext" el="text" style="font-size: 0.9em; color: #888;">R$ 99,90</span>
                </div>
                 <div class="Gsubcard" el="subcard">
                    <div style="width: 50px; height: 50px; background: #ddd; border-radius: 50%; margin-bottom: 10px;"></div>
                    <strong class="Gtext" el="text">Produto B</strong>
                    <span class="Gtext" el="text" style="font-size: 0.9em; color: #888;">R$ 149,90</span>
                </div>
            </div>
            
            <p class="Gtext" el="text" style="margin-top: 20px; font-style: italic; color: #777;">Dados carregados dinamicamente via JS.</p>
        </div>
    `,

    about: () => `
        <div class="Gcard" el="card" style="--card-clrbg: #f9f9f9;">
            <h2 class="Gtext" el="text">Sobre Nós</h2>
            <p class="Gtext" el="text" style="margin-top: 15px;">
                Somos uma startup focada em criar esqueletos de aplicações Node.js performáticas e escaláveis.
                Utilizamos o conceito de <strong>ClassModel</strong> para estilização dinâmica.
            </p>
        </div>
    `,

    contact: () => `
        <div class="Gcard" el="card-short">
            <h2 class="Gtext" el="text" style="text-align: center; margin-bottom: 20px;">Contato</h2>
            <form id="contactForm" style="display: flex; flex-direction: column; gap: 15px;">
                <input type="text" placeholder="Seu Nome" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                <input type="email" placeholder="Seu Email" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                <textarea rows="4" placeholder="Sua Mensagem" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                <button type="submit" class="btn btn-primary">Enviar Mensagem</button>
            </form>
        </div>
    `,

    notFound: () => `
        <div class="Gcard" el="card-short" style="--card-clrbg: #fff0f0; --card-brd-clr: #ffcccc; --card-brd-sz: 1px; text-align: center;">
            <h1 class="Gtext" el="text" style="color: #d9534f;">404</h1>
            <p class="Gtext" el="text">Página não encontrada.</p>
            <button class="btn btn-secondary" style="margin-top: 15px;" onclick="Router.navigateTo('/')">Voltar ao Início</button>
        </div>
    `,

    // Lifecycle Hook
    onMount: (page) => {
        console.log(`Page mounted: ${page}`);
        if (page === '/contact') {
            const form = document.getElementById('contactForm');
            if (form) {
                form.onsubmit = (e) => {
                    e.preventDefault();
                    alert('Mensagem enviada (simulação)!');
                }
            }
        }
    }
};


