const { Console } = require('console');
const fs = require('fs');
const http = require('http')
const url = require('url')
const replaceTemplate = require('./self-made-module/module')
const slugify = require('slugify')


/*************************        FILES SYSTEM        ****************************/

/* BLOCKING, SYNCRONUS JAVASCRIPT CODE */
// const readingFiles = fs.readFileSync('./txt/read-this.txt', 'utf-8')
// console.log(readingFiles)

// const writingFiles = `This is written by javascript fileSystem Module: ${readingFiles}\nCurrent time: ${Date.now()}`;
// fs.writeFileSync('./txt/write-this.txt', writingFiles);
// console.log('Writing File has Done')


/*NON-BLOCKING, ASYNCRONUS JAVASCRIPT CODE */
// fs.readFile('./txt/start.txt', 'utf-8', (error, data1)=>{
//     if (error){
//         return console.log(error)
//     }
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`, 'utf-8', (error, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, (error)=>{
//                 console.log('File have been writen');
//             });
//         });
//     });
// });
// console.log('Reading file is in process...');


/*************************        SURVER        ****************************/

const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);


// const slug = dataObj.map(eachelement => slugify(eachelement.productName, { lower: true }));
/** OR **/
const slug = dataObj.map((eachelement) => {
    return slugify(eachelement.productName, { lower: true })
});
console.log(slug)



const server = http.createServer((req, resp) => {
    // console.log(req.url)
    // console.log(url.parse(req.url, true))
    const { query, pathname } = url.parse(req.url, true);
    // const pathname = req.url;

    //Overview page
    if (pathname == '/' || pathname == '/overview') {
        resp.writeHead(200, { 'content-type': 'text/html' });
        const cardHtml = dataObj.map((element) => {
            return replaceTemplate(tempCard, element)
        })
        const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardHtml.join(''))

        resp.end(output);
    }
    // Product page
    else if (pathname == '/product') {
        resp.writeHead(200, {                // 200 --> all OK 
            'content-type': 'text/html'
        });
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        resp.end(output);
    }
    //API
    else if (pathname == '/api') {
        resp.writeHead(200, { 'content-type': 'application/json' });
        resp.end(data);
    }
    // Page not found
    else {
        resp.writeHead(404, {                // 404 --> Error 
            'content-type': 'text/html'
        });
        resp.end('<h1>Error! 404</h1><br>Page not found!')
    }
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Surver is running on port 3000');
});

