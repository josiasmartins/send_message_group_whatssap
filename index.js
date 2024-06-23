const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Abre o navegador em modo não-headless para ver as ações
    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');

    // Aguarde até que o usuário esteja logado
    console.log('Por favor, escaneie o QR code e faça login no WhatsApp Web.');
    await page.waitForSelector('._1jJ70', { timeout: 0 }); // Espera pela presença do seletor após o login

    // Navegue até o grupo específico
    const groupName = 'Nome do Grupo';
    await page.type('._3FRCZ', groupName);
    await page.waitForSelector(`span[title='${groupName}']`, { timeout: 5000 });
    const group = await page.$(`span[title='${groupName}']`);
    if (group) {
        await group.click();
    } else {
        console.log(`Grupo ${groupName} não encontrado`);
        await browser.close();
        return;
    }

    // Envie a mensagem
    const message = 'Sua mensagem específica aqui';
    await page.waitForSelector('._1awRl.copyable-text.selectable-text');
    const messageBox = await page.$('._1awRl.copyable-text.selectable-text');
    await messageBox.type(message);
    await page.keyboard.press('Enter');
    console.log(`Mensagem enviada para o grupo: ${groupName}`);

    // Feche o navegador
    await browser.close();
})();
