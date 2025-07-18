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
    type GolemBaseUpdate,
    type GolemBaseTransaction,
    StringAnnotation,
    NumericAnnotation,
    Annotation,
    Hex
} from "golem-base-sdk"
import { readFileSync } from "fs";
import jsonData from './data.json' with { type: 'json' };
import { MediaItem, MediaType, Searches } from "./media";

export const GOLEM_BASE_APP_NAME = 'golembase-media_demo_v0.5';

// Mapping from media type to the person + genre keys. This way we can add additional media types later on without having to make major rewrites
const MEDIA_MAP: Record<MediaType, { personKey: keyof Searches; genreKey: keyof Searches; sourcePersonField: string }> = {
  book: { personKey: "authors", genreKey: "book_genres", sourcePersonField: "author" },
  movie: { personKey: "directors", genreKey: "movie_genres", sourcePersonField: "director" },
  music: { personKey: "artists", genreKey: "music_genres", sourcePersonField: "artist" },
};

interface QueryResult {
    key: string;
    auto_generated: string;
    type: string;
    title: string;
    description: string;
    // This next line means we can have any additional properties we want, provided their values are string, or number
    [key: string]: string | number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();


const keyBytes = readFileSync('./private.key');
const key: AccountData = new Tagged("privatekey", keyBytes);
const client = await createClient(1337, key, 'http://localhost:8545', 'ws://localhost:8545');
//const client = await createClient(600606, key, 'https://rpc.kaolin.holesky.golem-base.io', 'wss://ws.rpc.kaolin.holesky.golem-base.io');

// This takes an existing Searches (a set of lists), and adds in additional items, but checks for existence first, and only adds if they aren't already there
// We also use the above so we're not hardcoding "director" "movie_genre" etc. in case we want to add additional media types later.
function updateSearchesFromItem(searches: Searches, item: MediaItem): void {

    if (!item || !item.type) {
        return; // invalid data, skip
    }

    const map = MEDIA_MAP[item.type];

    if (!map) {
        return; // invalid data, skip
    }

    const personValue: string = (item as any)[map.sourcePersonField];
    const genreValue: string = item.genre;

    const personList = searches[map.personKey] as string[];
    const genreList = searches[map.genreKey] as string[];

    // Normalize for comparison
    const personValueLower = personValue.toLowerCase();
    const genreValueLower = genreValue.toLowerCase();

    // Case-insensitive check for person
    if (!personList.some(p => p.toLowerCase() === personValueLower)) {
        personList.push(personValue);
    }

    // Case-insensitive check for genre
    if (!genreList.some(g => g.toLowerCase() === genreValueLower)) {
        genreList.push(genreValue);
    }
}

function transformSearchesToKeyValuePairs(searches: Omit<Searches, 'entityKey'>): Annotation<string>[] {
    return Object.entries(searches).map(([key, value]) => {
        const finalKey = key; //.replace(/_/g, '-'); // turn underscores into dashes
        const sortedValues = [...value].sort((a, b) => a.localeCompare(b));
        return new Annotation(finalKey, sortedValues.join(','));
    });
}

export const sendSampleData = async () => {

    // TODO: Check if sample data already exists by quering the items. Maybe we could query each item individually and only add it if it doesn't already exist...

    // TODO: This step is optional, but it creates the important searches entity.
    // Instead, when the app starts, let's check if the searches entity exists, and if not create it.
    // Then here in this function, don't create it; instead update it.
    // (That means it will share code with addMediaItem, in which case let's move it to its own function.)
    // (It also means we need to update this function to call a transaction with both CREATE and UPDATE.)

    let creates:GolemBaseCreate[] = [];

    for (let i = 0; i < jsonData.length; i++) {
        creates.push(convertToCreateOrUpdate(jsonData[i]));
    }
    
    // Gather up authors, directors, artists, book-genres, movie-genres, music-genres so we can provide some search dropdowns
    // This will be built into a single entity that we'll also send over.
    // TODO: Move this to its own function

    let searchesTest:Searches = {
        directors: [],
        artists: [],
        authors: [],
        movie_genres: [],
        music_genres: [],
        book_genres: []
    }

    for (let i = 0; i < jsonData.length; i++) {
        updateSearchesFromItem(searchesTest, jsonData[i] as MediaItem);
    }

    let searches:GolemBaseCreate = {
        data: encoder.encode("searches"),
        btl: 25,
        stringAnnotations: transformSearchesToKeyValuePairs(searchesTest),
        numericAnnotations: []
    };

    searches.stringAnnotations.push(new Annotation("app", GOLEM_BASE_APP_NAME));
    searches.stringAnnotations.push(new Annotation("type", "searches"));

    creates.push(searches)

    const receipts = await client.createEntities(creates);

    console.log(receipts);

    return 10;
}

export const purge = async() => {
    // First query all with the current golem app id

    let queryString = `app="${GOLEM_BASE_APP_NAME}"`;
    console.log(queryString);
    const result:any = await client.queryEntities(queryString);
    const keys = result.map((item: any) => {
        return item.entityKey;
    })

    await client.deleteEntities(keys);
    return result;

}

export const createOrUpdateMediaItem = async (mediaItem: MediaItem, updateKey?: Hex) => {
    // Convert to a CreateEntity item
    let creates:GolemBaseCreate[] = [];
    let updates:GolemBaseUpdate[] = [];

    // TODO: Verify schema
    if (updateKey) {
        updates.push(convertToCreateOrUpdate(mediaItem, updateKey) as GolemBaseUpdate);
    }
    else {
        creates.push(convertToCreateOrUpdate(mediaItem));
    }

    // Grab the current Searches entity

    let searches:Searches = await getSearchEntity();

    // Add in the people and genres

    updateSearchesFromItem(searches, mediaItem);

    // Create an Update with the Searches entity
    // TODO: Move this into its own function
    // TODO: I'm already omitting entityKey in the transform function, so no reason for this
    const entityKey = searches.entityKey;
    delete searches.entityKey;

    let searchesUpdate:GolemBaseUpdate = {
        entityKey: entityKey as Hex,
        data: encoder.encode('searches'),
        btl: 25,
        stringAnnotations: transformSearchesToKeyValuePairs(searches),
        numericAnnotations: []
    }
    searchesUpdate.stringAnnotations.push(new Annotation("app", GOLEM_BASE_APP_NAME));
    searchesUpdate.stringAnnotations.push(new Annotation("type", "searches"));
    updates.push(searchesUpdate);

    // Send both the Create and the Update as a single transaction
    const receipt = await client.sendTransaction(creates, updates, [], []);
    console.log(receipt);
    return receipt; // For now we'll just return the receipt; probably need to clean it up into a more user-friendly struct

}

export const convertToCreateOrUpdate = (mediaItem: any, updateKey?: Hex) => {

    // Construct the data value from the type, name, and description

    // TODO: Add in the auto_generated part... Or remove it completely?

    const data_value:any = `${mediaItem?.type?.toUpperCase()}: ${mediaItem?.title} - ${mediaItem?.description}`;
    console.log(data_value);

    let result:GolemBaseCreate|GolemBaseUpdate;

    if (updateKey) {
        result = {
            entityKey: updateKey,
            data: data_value,
            btl: 25,
            stringAnnotations: [new Annotation("app", GOLEM_BASE_APP_NAME)],
            numericAnnotations: []
        }
    }
    else {
        result = {
            data: data_value,
            btl: 25,
            stringAnnotations: [new Annotation("app", GOLEM_BASE_APP_NAME)],
            numericAnnotations: []
        }
    }

    for (const key of Object.keys(mediaItem)) {
        const value = (mediaItem as any)[key];
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

export const getItemByEntityKey = async (hash: Hex) => {
    const metadata: any = await client.getEntityMetaData(hash);

    let result:any = {
        key: hash
    };

    for (let i=0; i<metadata.stringAnnotations.length; i++) {
        const key = metadata.stringAnnotations[i].key;
        const value = metadata.stringAnnotations[i].value;
        result[key] = value;
    }

    for (let i=0; i<metadata.numericAnnotations.length; i++) {
        const key = metadata.numericAnnotations[i].key;
        const value = metadata.numericAnnotations[i].value;
        result[key] = value;
    }

    return result;
}

export const query = async (queryString: string) => {
    console.log('Querying...');
    console.log(queryString);
    const rawResult: any = await client.queryEntities(queryString);

    // This part is annoying; we have to decode every payload.
    let result:QueryResult[] = [];

    for (let i=0; i<rawResult.length; i++) {
        console.log(i);
        const metadata: any = await getItemByEntityKey(rawResult[i].entityKey);
        console.log(metadata);
        let item:QueryResult = {
            key: rawResult[i].entityKey,
            auto_generated: decoder.decode(rawResult[i].storageValue),
            type: metadata.type,
            title: metadata.title,
            description: metadata.description
        }
        // Loop through members of metadata, skipping type, title, description TODO: Do we really want the interface?
        for (const key of Object.keys(metadata)) {
            if (key != "type" && key != "title" && key != "description" && key != "app") {
                const value = (metadata as any)[key];
                item[key] = value;
            }
        }
        console.log(item);
        result.push(item);
    }

    console.log(result);

    return result;
}

export const getSearchEntity = async(): Promise<Searches> => {
    // This is an example where for the "full" app we would also include userid or username in the query
    const entities = await client.queryEntities(`app="${GOLEM_BASE_APP_NAME}" && type="searches"`);
    if (entities.length > 0) {
        
        // There should always be exactly one, but just in case...
        let search_hash: Hex = entities[0].entityKey;

        // Grab the metadata
        const metadata = await client.getEntityMetaData(search_hash);

        console.log(metadata);

        // TODO: Move this to a function and put the mapping functions in their own file
        // Build the search options as a single object
        // Let's use the built in reduce function to transform this into an object
        // (Instead of harcoding "director", "author" etc. That way if we add 
        // Additional media types later on, we won't have to change this code.)
        const output:Searches = metadata.stringAnnotations.reduce(
            (acc, {key, value}) => {
                // Skip the app and type annotations but include all the rest
                if (key == "app" || key == "type") {
                    return acc;
                }
                acc[key] = value.split(',');
                return acc;
            },
            {} as Record<string, string[]>
        ) as unknown as Searches; // Those are just to get the TS compiler to shut up ;-)

        output.entityKey = search_hash;

        console.log(output);
        return output;

    }
    return {} as Searches; // Again, to get TS to quiet down
}

export const getMetadata = async(hash: Hex) => {
    const metadata = await client.getEntityMetaData(hash);
    console.log(metadata);
}