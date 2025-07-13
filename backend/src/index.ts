import express from 'express';
import { sendSampleData, query, getSearchEntity, getMetadata } from './dataService.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Golem-base!');
});

app.get('/load-data', async (req, res) => {
    // Add try-catch and send a simple message about not having enough funds
    await sendSampleData()
    res.send('OK');
});

app.post('/save-new', async (req, res) => {
    console.log(req.body);
    res.send('OK');
});

// TODO: Really we need to just accept an incoming query string in case they need "OR" clauses...
// Maybe we can have more than one query API; one that parses query strings as ANDs and one that just takes a pre-built query string
app.get('/query', async (req, res) => {

    // Run through each item; convert nums to numbers

    let queryMap:any = {};

    for (let key in req.query) {
        const value:any = req.query[key];
        console.log(value);
        console.log(isNaN(value));
        if (isNaN(Number(value))) {
            queryMap[key] = value;
        }
        else {
            queryMap[key] = Number(value);
        }
    }

    let queryString:string = 'app="golembase-media_demo"';
    for (let key in queryMap) {
        let value:any = queryMap[key];

        if (typeof(value) == 'number') {
            queryString += ' && ' + `${key}=${value}`;
        }
        else {
            queryString += ' && ' + `${key}="${value}"`;
        }
    }
    
    console.log(queryString);

    const result:any = await query(queryString);
    res.send(result);
})

app.get('/test', async (req, res) => {
    res.send(await getSearchEntity());
    //await getMetadata("0x834ffe2a1604d8bfa20c7a52f4533b118b4e5eafa907b3b413db836c045b84ee");
})

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

