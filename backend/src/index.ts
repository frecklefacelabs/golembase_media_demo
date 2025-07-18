import express from 'express';
import { GOLEM_BASE_APP_NAME, sendSampleData, query, getSearchEntity, getMetadata, createOrUpdateMediaItem, getItemByEntityKey, purge } from './dataService.js';
import cors from 'cors';
import { Hex } from 'golem-base-sdk';
import { MediaItem, Searches } from './media.js';
const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:4200' 
};
app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Golem-base!');
});

// Pre-load sample data
app.get('/load-data', async (req, res) => {
    // Add try-catch and send a simple message about not having enough funds
    await sendSampleData()
    res.send({"status": "OK"});
});

// Save a new media item
app.post('/save', async (req, res) => {
    // TODO: Verify data before blindly sending it

    let result:any;

    // If the request has a key already with it, it's an update.
    if (req.body.key) {
        result = await createOrUpdateMediaItem(req.body, req.body.key);
    }
    else {
        result = await createOrUpdateMediaItem(req.body);
    }
    res.send(result);
});

// This can be used to populate dropdown boxes for searches
app.get('/search-options', async (req, res) => {
    let searches:Searches = await getSearchEntity();
    delete searches.entityKey;

    res.send(searches);
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

    console.log('Building query string');
    let queryString:string = `app="${GOLEM_BASE_APP_NAME}"`;
    console.log(queryString);
    for (let key in queryMap) {
        let value:any = queryMap[key];
        console.log(value);

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

app.get('/purge', async (req, res) => {

    res.send(await purge());

});

app.get('/key/:id', async (req, res) => {

    let id:string = req.params.id;

    // Prepend '0x' if it's missing
    if (!id.startsWith('0x')) {
        id = '0x' + id;
        console.log('Updated id with 0x:', id);
    }
    
    console.log('Loading by key!');
    console.log('id is:', req.params.id);
    res.send(await getItemByEntityKey(req.params.id as Hex));
})

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

