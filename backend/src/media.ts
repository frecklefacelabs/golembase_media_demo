import { Hex } from "golem-base-sdk";

export type MediaType = "book" | "movie" | "music";

export interface Book {
  type: "book";
  title: string;
  description: string;
  author: string;
  genre: string;
  rating: number;
  owned: boolean;
  year: number;
}

export interface Movie {
  type: "movie";
  title: string;
  description: string;
  director: string;
  genre: string;
  rating: number;
  watched: boolean;
  year: number;
}

export interface Music {
  type: "music";
  title: string;
  description: string;
  artist: string;
  genre: string;
  rating: number;
  favorite: boolean;
  year: number;
}

export type MediaItem = Book | Movie | Music;

export interface Searches {
	entityKey?: Hex; 
	directors: string[];
	artists: string[];
	authors: string[];
	movie_genres: string[];
	music_genres: string[];
	book_genres: string[];
}