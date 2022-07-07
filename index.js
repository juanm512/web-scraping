const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

const tickets_finder = async (dia_viaje) => {
    try{
        
        
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://webventas.sofse.gob.ar/');
        
        // SELECTOR DE ORIGEN  id=origen-selectized
        await page.type('#origen-selectized', 'Buenos Aires');
        await page.keyboard.press('Enter');
        
        // SELECTOR DE destino  id=destino-selectized
        await page.type('#destino-selectized', 'Chivilcoy');
        await new Promise(resolve => setTimeout(resolve, 500))
        await page.keyboard.press('Enter');
        
        // SELECTOR DE adulto  id=adulto
        await new Promise(resolve => setTimeout(resolve, 500))
        await page.type('#adulto', '1');
        // await page.click("select[id='adulto']");
        // await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        
        const dia_selector = `td#cell${dia_viaje}-fecha_ida`;
        const fecha_ida = 'form#form_busqueda.form_busqueda_servicios.controlar_errores.row.mx-auto div.container div.row.pl-2.pr-2.pb-1 div.col-xl.col-md.col-sm.pr-1.pl-1 div.input-group a.datepicker-button.input-group-addon.btn.blue';
        await page.click(fecha_ida);
        
        await page.waitForSelector(dia_selector);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await page.click(dia_selector);
        
    
        const allResultsSelector = 'form#form_busqueda.form_busqueda_servicios.controlar_errores.row.mx-auto div.container div.row.pl-2.pr-2.pb-1 div.col-xl.col-sm.col-md.pl-1.pr-1 button.btn_gral.btn.btn-block';
        // await page.waitForSelector(allResultsSelector);
        await page.click(allResultsSelector);

        await new Promise(resolve => setTimeout(resolve, 500))
        // await page.screenshot({path: 'full.png', fullPage: true});



        //div.dia_disponible

        const disponibles = await page.evaluate( () => {
            const divs = document.querySelectorAll(`div[class='dia_disponible']`);
            let array = [];
                divs.forEach(div => {
                    array.push( 
                        `${div.children[0].children[0].children[0].innerText} - ${div.children[0].children[2].children[0].innerText}`
                    );
                });
            return array;
        }
        );

        const date = new Date();
        if(date.getDate()+7 == dia_viaje){
            console.log("\n\nEN ESTOS 7 DIAS: \n");
        } else if ( date.getDate()+14 == dia_viaje){
            console.log("\n\nSIGUIENTES 14 DIAS: \n");
        } else {
            console.log("\n\nMAS DE 14 DIAS: \n");
        }

        console.log(disponibles);

        await browser.close();
    } catch(err){
        console.log(err);
    }
};

const job = schedule.scheduleJob('*/5 * * * *', function(fireDate){
    console.log("SCRIPT EJECUTADO: ",fireDate);
    const date = new Date();
    let dia_viaje = date.getDate();
    
    
    tickets_finder(dia_viaje);
    
    dia_viaje = date.getDate()+7;
    tickets_finder(dia_viaje);
    
    dia_viaje = date.getDate()+14;
    tickets_finder(dia_viaje);
  });