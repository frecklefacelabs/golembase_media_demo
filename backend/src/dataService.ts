// Updates to the SDK
// Why do we need to call encoder.encode every time we pass a string for data? Can't the SDK detect it's a string and handle that for us?
// What's the point in having StringAnnotation and NumericAnnotation is we really can't use them? And we only have two, so why create a class Annotation<v> when we can't use them anyway? Just make two separate classes.
// What's up with the asyncFilter function in the sample? If we need that, why not put it in the SDK?
// The sample creates three separate clients and then only uses one
// Why the "Tagged" thing?

import {
    createClient,
    AccountData,
    Tagged,
    type GolemBaseCreate,
    StringAnnotation,
    NumericAnnotation,
    Annotation
} from "golem-base-sdk"
import { readFileSync } from "fs";
import jsonData from './data.json' with { type: 'json' };
//import { decode } from "punycode";

// TODO: Move this to its own file
interface QueryResult {
    key: string;
    description: string; // Be careful! It's not always a string, but in this app it is.
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();


const keyBytes = readFileSync('./private.key');
const key: AccountData = new Tagged("privatekey", keyBytes);
const client = await createClient(1337, key, 'http://localhost:8545', 'ws://localhost:8545');

export const sendSampleData = async () => {

    // TODO: Check if sample data already exists by quering the items. Maybe we could query each item individually and only add it if it doesn't already exist...

    let creates:GolemBaseCreate[] = [];

    for (let i = 0; i < jsonData.length; i++) {
        creates.push(convertToCreate(jsonData[i]));
    }

    const receipts = await client.createEntities(creates);

    console.log(receipts);

    return 10;
}

export const convertToCreate = (mediaItem: any) => {

    let result:GolemBaseCreate = {
        data: mediaItem.data_value,
        btl: 25,
        stringAnnotations: [],
        numericAnnotations: []
    };

    for (const key of Object.keys(mediaItem.annotations)) {
        const value = (mediaItem.annotations as any)[key];
        if (typeof(value) == 'number') {
            result.numericAnnotations.push(new Annotation(key, value));

        }
        else if (typeof(value) == 'string') {
            result.stringAnnotations.push(new Annotation(key, value));
        }
        else {
            let newValue = String(value);
            if (String(value).toLowerCase() == 'true') {
                newValue = 'true';
            }
            else if (String(value).toLowerCase() == 'false') {
                newValue = 'false';
            }
            result.stringAnnotations.push(new Annotation(key, newValue));

        }
        //console.log(`Annotation ${key}:${value}, type of value; ${typeof(value)}`)
    }

    return result;
}

export const query = async (queryString: string) => {
    const rawResult: any = await client.queryEntities(queryString);
    console.log(rawResult);

    // This part is annoying; we have to decode every payload.
    let result:QueryResult[] = [];

    for (let i=0; i<rawResult.length; i++) {
        result.push({
            key: rawResult[i].entityKey,
            description: decoder.decode(rawResult[i].storageValue)
        })
    }

    console.log(result);

    return result;
}
