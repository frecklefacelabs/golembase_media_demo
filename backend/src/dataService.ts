import {
    type GolemBaseCreate,
    StringAnnotation,
    NumericAnnotation,
    Annotation
} from "golem-base-sdk"

import { readFileSync } from "fs";

export const sendSampleData = () => {
    // Read the sample data in

    const rawData = readFileSync('./data.json', 'utf-8')
    const jsonData = JSON.parse(rawData);

    let creates:GolemBaseCreate[] = [];


    for (let i = 0; i < jsonData.length; i++) {
        creates.push(convertToCreate(jsonData[i]));
    }

    console.log(creates);

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
        console.log(`Annotation ${key}:${value}, type of value; ${typeof(value)}`)
    }

    return result;


}
