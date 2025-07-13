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
    Annotation,
    Hex
} from "golem-base-sdk"
import { readFileSync } from "fs";
import jsonData from './data.json' with { type: 'json' };
//import { decode } from "punycode";

// TODO: Move interfaces to their own file

type MediaType = "book" | "movie" | "music";

interface Book {
  type: "book";
  title: string;
  description: string;
  author: string;
  genre: string;
  rating: number;
  owned: boolean;
  year: number;
}

interface Movie {
  type: "movie";
  title: string;
  description: string;
  director: string;
  genre: string;
  rating: number;
  watched: boolean;
  year: number;
}

interface Music {
  type: "music";
  title: string;
  description: string;
  artist: string;
  genre: string;
  rating: number;
  favorite: boolean;
  year: number;
}

type MediaItem = Book | Movie | Music;

interface Searches {
    directors: string[];
    artists: string[];
    authors: string[];
    movie_genres: string[];
    music_genres: string[];
    book_genres: string[];
}

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
    const genreList = searches[map.genreKey];

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

function transformSearchesToKeyValuePairs(searches: Searches): Annotation<string>[] {
    return Object.entries(searches).map(([key, value]) => {
        const finalKey = key; //.replace(/_/g, '-'); // turn underscores into dashes
        const sortedValues = [...value].sort((a, b) => a.localeCompare(b));
        return new Annotation(finalKey, sortedValues.join(','));
    });
}

export const sendSampleData = async () => {

    // TODO: Check if sample data already exists by quering the items. Maybe we could query each item individually and only add it if it doesn't already exist...

    let creates:GolemBaseCreate[] = [];

    for (let i = 0; i < jsonData.length; i++) {
        creates.push(convertToCreate(jsonData[i]));
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

    searches.stringAnnotations.push(new Annotation("app", "golembase-media_demo"));
    searches.stringAnnotations.push(new Annotation("type", "searches"));

    creates.push(searches)

    const receipts = await client.createEntities(creates);

    console.log(receipts);

    return 10;
}

export const convertToCreate = (mediaItem: any) => {

    // Construct the data value from the type, name, and description

    const data_value:any = `${mediaItem?.type?.toUpperCase()}: ${mediaItem?.title} - ${mediaItem?.description}`;
    console.log(data_value);

    let result:GolemBaseCreate = {
        data: data_value,
        btl: 25,
        stringAnnotations: [new Annotation("app", "golembase-media_demo")],
        numericAnnotations: []
    };

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

    let result:any = {};

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
    const rawResult: any = await client.queryEntities(queryString);

    // This part is annoying; we have to decode every payload.
    let result:QueryResult[] = [];

    for (let i=0; i<rawResult.length; i++) {
        const metadata: any = await getItemByEntityKey(rawResult[i].entityKey);
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

export const getSearchEntity = async() => {
    // This is an example where for the "full" app we would also include userid or username in the query
    const entities = await client.queryEntities('app="golembase-media_demo" && type="searches"');
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
        const output = metadata.stringAnnotations.reduce(
            (acc, {key, value}) => {
                // Skip the app and type annotations but include all the rest
                if (key == "app" || key == "type") {
                    return acc;
                }
                acc[key] = value.split(',');
                return acc;
            },
            {} as Record<string, string[]>
        );

        console.log(output);
        return output;

    }
    return {};
}

export const getMetadata = async(hash: Hex) => {
    const metadata = await client.getEntityMetaData(hash);
    console.log(metadata);
}