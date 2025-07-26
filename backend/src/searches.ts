// The "searches" object holds index information on the existing entities.

import { Annotation, Hex } from "golem-base-sdk";
import { GOLEM_BASE_APP_NAME, MediaItem, MediaType, Searches } from "./media.js";
import { client } from "./dataService.js";
import { transformAnnotationsToListPOJO, transformListPOJOToAnnotations } from "@freckleface/golembase-js-transformations";

// Mapping from media type to the person + genre keys. This way we can add additional media types later on without having to make major rewrites
const MEDIA_MAP: Record<MediaType, { personKey: keyof Searches; genreKey: keyof Searches; sourcePersonField: string }> = {
  book: { personKey: "authors", genreKey: "book_genres", sourcePersonField: "author" },
  movie: { personKey: "directors", genreKey: "movie_genres", sourcePersonField: "director" },
  music: { personKey: "artists", genreKey: "music_genres", sourcePersonField: "artist" },
};



// This takes an existing Searches (a set of lists), and adds in additional items, but checks for existence first, and only adds if they aren't already there
// We also use the above so we're not hardcoding "director" "movie_genre" etc. in case we want to add additional media types later.
export const updateSearchesFromItem = (searches: Searches, item: MediaItem): void => {

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

export const transformSearchesToKeyValuePairs = (searches: Omit<Searches, 'entityKey'>): Annotation<string>[] => {

    console.log('SEARCHES UPDATE:')
    const result2: any = transformListPOJOToAnnotations(searches).stringAnnotations;
    console.log(result2);
    
    return result2;
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

        const output: any = transformAnnotationsToListPOJO(metadata, false);

        // Remove the app and type as we don't need it here
        delete output.app;
        delete output.type;

        // Add in the entity key
        output.entityKey = search_hash;
        console.log('SEARCHES:');
        console.log(output);
        return output;
    }
    return {} as Searches; // Again, to get TS to quiet down
}