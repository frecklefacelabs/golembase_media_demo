export interface BookCreate {
    type: "book";
    title: string;
    description: string;
    author: string;
    genre: string;
    rating: number;
    owned: boolean;
    year: number;
}

export interface Book extends BookCreate {
    key: string;
    auto_generated: string;
}

export interface MovieCreate {
    type: "movie";
    title: string;
    description: string;
    director: string;
    genre: string;
    rating: number;
    watched: boolean;
    year: number;
}

export interface Movie extends MovieCreate {
    key: string;
    auto_generated: string;
}


export interface MusicCreate {
    type: "music";
    title: string;
    description: string;
    artist: string;
    genre: string;
    rating: number;
    favorite: boolean;
    year: number;
}

export interface Music extends MusicCreate {
    key: string;
    auto_generated: string;
}

export type MediaItem = Book | Movie | Music;

export interface SearchOptions {
  directors: string[];
  artists: string[];
  authors: string[];
  movie_genres: string[];
  music_genres: string[];
  book_genres: string[];
}
