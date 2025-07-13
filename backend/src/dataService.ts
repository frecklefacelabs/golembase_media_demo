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

const encoder = new TextEncoder();

const keyBytes = readFileSync('./private.key');

export const sendSampleData = async () => {

    const key: AccountData = new Tagged("privatekey", keyBytes);


    const client = await createClient(1337, key, 'http://localhost:8545', 'ws://localhost:8545');

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
            result.stringAnnotations.push(new Annotation(key, String(value)));

        }
        //console.log(`Annotation ${key}:${value}, type of value; ${typeof(value)}`)
    }

    return result;


}
