const puppeteer = require('puppeteer');

const GROUP_NAME = "Test";
const inputSearchEIdentified = 'div[aria-label="Search input textbox"]';

(async () => {

    const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'; // Atualize este caminho conforme necessário

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: chromePath,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();
    await page.goto('https://web.whatsapp.com');

    console.log('Por favor, escaneie o QR code e faça login no WhatsApp Web.');

    await page.waitForFunction(() => {
        return document.querySelector('canvas') === null;
    }, { timeout: 0 });
    console.log('Login concluído.');

    await page.waitForSelector('div[aria-label="Search input textbox"]',  { timeout: 30000 });
    await page.type(inputSearchEIdentified, GROUP_NAME);
    console.log("DIGITOU O GRUPO NA BUSCA")

    await page.waitForSelector(`span[title='${GROUP_NAME}']`,  { timeout: 30000 })
    const group = await page.$(`span[title='${GROUP_NAME}']`);
    if (group) {
        await group.click();
        console.log("CLICOU NO GROPO")
    } else {
        console.log(`Grupo ${GROUP_NAME} não encontrado`);
        await browser.close();
        return;
    }


    console.log('PASSOU')
    // const menu = await page.waitForSelector('div[title="Menu"][1]');
    const menu = await page.waitForFunction(() => document.querySelectorAll('div[title="Menu"]')[1], { timeout: 30000 })
    menu.click()
    // console.log(menu, "IBAG MENU")
    console.log("CLICANDO NO ICONE DE MENU")

    // await page.waitForSelector('div[aria-label="Group info"]',  { timeout: 30000 }).then(then => {
    //     then.click();
    // });
    // // menuGroupInfo.click();

    const menuGroupInfo = await page.waitForSelector('div[aria-label="Group info"]');
    menuGroupInfo.click();
    console.log('SELECIONOU O "GROUP INFO"')

    // const moreContacts = await page.waitForSelector('div[data-ignore-capture="any"]');
    // moreContacts.click();
    
    // // await page.waitForSelector(`document.querySelectorAll('div[role="listitem"][style]')`);
    // await page.waitForFunction(() => {
    //     const todosContacts = document.querySelectorAll('div[role="listitem"][style]');
    //     todosContacts.forEach((contato => {

    //         try {

    //             contato.firstChild.firstChild.lastChild.click();
    //             console.log('CLICOU NO CONTATO')

    //             const sendMessageToPeople = document.querySelectorAll('li')[2];
    //             sendMessageToPeople.click();
    //             console.log('CLICOU NA TERCEIRA OPCAO')

    //             const textboxPrivatePeople = document.querySelectorAll("div[role='textbox']")[1];
    //             textboxPrivatePeople;
    //             console.log("SELECIONOU O TEXTBOX INPUT")



    //         } catch (erro) {
    //             return;
    //         }

    //         // const _contact = document.querySelectorAll('div[role="listitem"][style]')[6];
          

    //     }))
    // })



})();