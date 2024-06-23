const puppeteer = require('puppeteer');


// const searchEl = document.querySelectorAll('div')[31];

// const group = document.querySelector('span[title="Test"]');


// const menuDoGrupo = document.querySelectorAll('div[title="Menu"]')[1];

// const menuOpcaoGrupoInfo = document.querySelector('div[aria-label="Group info"]');

// const mostraUmaPequenaParte = document.querySelectorAll('div[id="pane-side"]')[1]

// const botaoDeVerTodos = document.querySelector('div[data-ignore-capture="any"]');

// const buscaTodosOsContatos = document.querySelectorAll('div[role="listitem"][style]'); // retorna uma lista



// // exemplo de busca buscaTodosOsContatos[8].firstChild.firstChild.lastChild

// const mensagemParaPessoa = document.querySelectorAll('li')[2].click(); // o modal

// const campoParaEnviarMensagem = document.querySelectorAll('div[role="textbox"]')[1];

(async () => {
    // Caminho para o executável do Chrome
    const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'; // Atualize este caminho conforme necessário

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: chromePath,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');

    // Aguarde até que o usuário esteja logado
    console.log('Por favor, escaneie o QR code e faça login no WhatsApp Web.');

    // Espera até que o QR code desapareça indicando que o login foi concluído
    await page.waitForFunction(() => {
        return document.querySelector('canvas') === null;
    }, { timeout: 0 });
    console.log('Login concluído.');


    // Navegue até o grupo específico
    const groupName = 'Test';
    await page.waitForSelector('[aria-label="Search input textbox"]', { timeout: 30000 }); // Espera pelo seletor da barra de pesquisa
    await page.type('[aria-label="Search input textbox"]', groupName);
    await page.waitForSelector(`span[title='${groupName}']`, { timeout: 5000 });
    const group = await page.$(`span[title='${groupName}']`);
    if (group) {
        await group.click();
    } else {
        console.log(`Grupo ${groupName} não encontrado`);
        await browser.close();
        return;
    }

    // Acessa as informações do grupo
    await page.waitForSelector('header span[data-testid="menu"]', { timeout: 5000 });
    await page.click('header span[data-testid="menu"]');
    await page.waitForSelector('div[role="button"][title="Group info"]', { timeout: 5000 });
    await page.click('div[role="button"][title="Group info"]');

    // Espera pela aba de membros
    await page.waitForSelector('span[data-icon="menu"]', { timeout: 5000 });
    const el = await page.$$('span[data-icon="menu"]');
    if (el.length > 1) {
        await page.evaluate(el => el.setAttribute("id", "_menu"), el[1]);
    } else {
        console.log('Não foi possível encontrar o seletor esperado.');
        await browser.close();
        return;
    }

    // Espera pelo seletor de lista de membros
    await page.waitForSelector('#_menu', { timeout: 5000 });
    await page.waitForSelector('div[role="button"]', { timeout: 5000 });
    const listMembers = await page.$$('div[role="button"]');
    if (listMembers.length <= 26) {
        console.log('Não há membros suficientes no grupo.');
        await browser.close();
        return;
    }
    await page.evaluate(el => el.setAttribute("id", "_members"), listMembers[26]);

    // Obtém a lista de membros
    await page.waitForSelector('#_members', { timeout: 5000 });
    const members = await page.$$(
        'div[aria-label="Group info"] div[role="button"]'
    );

    if (members.length > 2) {
        for (let i = 2; i < members.length; i++) {
            const member = members[i];
            await member.click();

            // Espera pelo campo de mensagem
            await page.waitForSelector('div[contenteditable="true"]', { timeout: 5000 });
            const messageBox = await page.$('div[contenteditable="true"]');

            // Lista de mensagens a serem enviadas
            const messages = [
                'Oiii, tudo bem?',
                'Espero que sim.',
                'Criei um canal sobre ciência e espaço.'
            ];

            // Envia as mensagens
            for (let message of messages) {
                await messageBox.type(message);
                await page.keyboard.press('Enter');
                console.log(`Mensagem enviada: ${message}`);
                await page.waitForTimeout(1000); // Pausa de 1 segundo entre mensagens
            }

            // Volta para a lista de membros
            await page.waitForSelector('button[data-testid="back"]', { timeout: 5000 });
            await page.click('button[data-testid="back"]');
            await page.waitForTimeout(1000); // Pausa para garantir que a transição ocorra corretamente
        }
        console.log('Mensagens enviadas para todos os membros do grupo.');
    } else {
        console.log('Não há membros suficientes no grupo.');
    }

    // Feche o navegador
    await browser.close();
})();