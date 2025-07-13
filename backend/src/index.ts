import express from 'express';
import { sendSampleData, query } from './dataService.js';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello from Golem-base!');
});

app.get('/load-data', async (req, res) => {
    // Add try-catch and send a simple message about not having enough funds
    await sendSampleData()
    res.send('OK');
})

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

    let queryString:string = '';
    let and:string = '';

    for (let key in queryMap) {
        let value:any = queryMap[key];

        if (typeof(value) == 'number') {
            queryString += and + `${key}=${value}`;
        }
        else {
            queryString += and + `${key}="${value}"`;
        }
        and = ' || ';
    }


    const result:any = await query(queryString);
    res.send(result);
})

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

