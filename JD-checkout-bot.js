puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const locateChrome = require('chrome-location');

const prompt = require('prompt-sync')();

puppeteer.use(StealthPlugin());

async function run(){
    
    const browser = await puppeteer.launch({headless: false, executablePath: locateChrome})
    const page = await browser.newPage()

    //RED NIKE DUNKS

    await page.goto('https://www.jdsports.co.nz/product/red-nike-dunk-low/16172345_jdsportsnz/');

    let ShoeSize = prompt("Pick Size: ");

    let isAvailable = await page.evaluate((ShoeSize) => {
        let Shoes = document.querySelectorAll("button[data-e2e='pdp-productDetails-size']");

        let available = false

        for(i = 0; i < Shoes.length; i++){
            if(Shoes[i].innerText == ShoeSize){

                available = true
                Shoes[i].click()
                
            }
        }

        if(available){
            document.querySelector("button[data-e2e='pdp-productDetails-addToBasketBtn']").click()
        }

        return available

    } ,ShoeSize )

    if(isAvailable){
        await page.waitForNavigation();
        await checkout(page)
    } 
    else {
        console.log('Shoe not available')
    }

}

async function checkout(page){

    await page.waitForSelector("a[class='btn btn-level1 large wArro']"); // Wait for the button to appear
    await page.click("a[class='btn btn-level1 large wArro']"); // Click the button


    //await page.wait(3); // Wait for the button to appear

    async function wait(seconds) {
        return new Promise(resolve => {
            setTimeout(resolve, seconds * 1000);
        });
    }

    //await wait(10); // Wait for the button to appear

    await page.waitForNavigation();

    await page.type('#email-id', 'fugazi@gmail.com')

    await page.click('button[class="StyledButtonKind-sc-1vhfpnt-0 dhRMXm"]');

    //EMAIL CONTINUE BUTTON

    await wait(2);

    await page.click('button[class="StyledButtonKind-sc-1vhfpnt-0 dhRMXm"]');

    //CONTINUE AS GUEST

    await page.waitForNavigation();


    await InfoPage(page)
}

async function InfoPage(page){

    async function wait(seconds) {
        return new Promise(resolve => {
            setTimeout(resolve, seconds * 1000);
        });
    }

    await wait(2);

    await page.type('#firstName-id', 'fugazi')
    await page.type('#lastName-id', 'Loco')    
    await page.type('#phone-id', '0284531674')

    await page.click("button[class='StyledButtonKind-sc-1vhfpnt-0 cvxusu']"); //ENTER ADDRESS MANUALLY 


    await page.type('#address1-id', '222 Lambton Quay')
    await page.type('#town-id', 'Wellington')
    await page.type('#postcode-id', '6011')

    /////////////////////////////////////////


    await page.click("button[class='StyledButtonKind-sc-1vhfpnt-0 hytLEJ']"); //SAVE ADDRESS BTN

    await page.waitForSelector('button[class="StyledButtonKind-sc-1vhfpnt-0 iNnGgt"]');
    await Payment(page)
    
}

async function Payment(page){

    //---------------------- CARD ----------------------------------------------

    await page.evaluate((selector) => {
        document.querySelector(selector).click();
    }, 'input[name="radio"][value="CARD"]')

    //CLICKS CREDIT CARD

    async function wait(seconds) {
        return new Promise(resolve => {
            setTimeout(resolve, seconds * 1000);
        });
    }

    await page.type('#name-id', 'fugazi') //ENTER NAME ON CARD

    ////////////////////////////////////
   
    //CARD NO.
    await page.waitForSelector("iframe[title='Iframe for secured card number']");

    let iframe = await page.$("iframe[title='Iframe for secured card number']");

    await wait(3);

    let iframeElement = await iframe.contentFrame();

    await iframeElement.waitForSelector("input[id='encryptedCardNumber']");

    await iframeElement.type("input[id='encryptedCardNumber']",'4378 8001 0044 2945'); 
    //FAKE CREDIT CARD NO. :)

    //CARD EXP DATE.

    iframe = await page.$("iframe[title='Iframe for secured card expiry date']");

    iframeElement = await iframe.contentFrame();

    await iframeElement.type("input[id='encryptedExpiryDate']",'01/26');

    //CARD CVV.

    iframe = await page.$("iframe[title='Iframe for secured card security code']");

    iframeElement = await iframe.contentFrame();

    await iframeElement.type("input[id='encryptedSecurityCode']",'726');


    //--------------------END---------------------------

    await page.waitForSelector('.StyledButtonKind-sc-1vhfpnt-0');

    await page.click('.StyledButtonKind-sc-1vhfpnt-0');

}



run()


