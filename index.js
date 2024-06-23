const puppeteer = require('puppeteer');

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

    // Lista de mensagens a serem enviadas
    const messages = [
        'Oiii, tudo bem?',
        'Espero que sim.',
        'Criei um canal sobre ciência e espaço.'
    ];

    // Função para enviar mensagens com pausa entre elas
    async function sendMessages() {
        for (let message of messages) {
            try {
                await page.waitForSelector('div[contenteditable="true"]', { timeout: 5000 });
                const messageBox = await page.$('div[contenteditable="true"]');
                await messageBox.type(message);
                await page.keyboard.press('Enter');
                console.log(`Mensagem enviada: ${message}`);
                await page.waitForTimeout(1000); // Pausa de 1 segundo entre mensagens
            } catch (error) {
                console.log(`Erro ao enviar mensagem: ${message}`, error);
            }
        }
    }

    // Enviar mensagens
    await sendMessages();
    console.log(`Mensagens enviadas para o grupo: ${groupName}`);

    // Feche o navegador
    await browser.close();
})();
