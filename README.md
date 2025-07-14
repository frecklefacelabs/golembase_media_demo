# golembase_media_demo
A demo of one way Golem Base can be used: We're going to store books, movies, and music, and allow them to be queried.

To test locally: TODO: Expand these...

1. Clone and start golembase-op-geth locally

2. Run golembase cmd to add funds (I do it five or six times)

3. Start the backend of this app

4. Go to http://localhost:3000/load-data to preload the sample data and create the searches entity.

5. Try searching: 

	* Query all books: http://localhost:3000/query?type=book
	* Query all movies: http://localhost:3000/query?type=movie
	* Query all music: http://localhost:3000/query?type=music
	* Query Christopher Nolan movies: http://localhost:3000/query?type=movie&director=Christopher%20Nolan
	* Query Christopher Nolan movies from 2000: http://localhost:3000/query?type=movie&director=Christopher%20Nolan&year=2000

	Here's a sample output from searching for Christopher Nolan movies, http://localhost:3000/query?type=movie&director=Christopher%20Nolan

	```json
	[
	{
		"key": "0x33ddcaa07cfd88dfc056eea937d35a687318cbf646b6c1dc37b3afe2da22df60",
		"auto_generated": "MOVIE: Inception - A mind-bending dream within a dream",
		"type": "movie",
		"title": "Inception",
		"description": "A mind-bending dream within a dream",
		"director": "Christopher Nolan",
		"genre": "sci-fi",
		"watched": "true",
		"rating": 5,
		"year": 2010
	},
	{
		"key": "0xd0ba5b539ec7fd94778b589d3e3fd093dac86a8cb7096f7d06af29d2ae7a9b7d",
		"auto_generated": "MOVIE: Memento - A man with no short-term memory pieces together a murder",
		"type": "movie",
		"title": "Memento",
		"description": "A man with no short-term memory pieces together a murder",
		"director": "Christopher Nolan",
		"genre": "thriller",
		"watched": "true",
		"rating": 5,
		"year": 2000
	}
	]
	```

6. Look at the searches options: http://localhost:3000/search-options

	The results from this are for use in prepopulating dropdown boxes with search options. (I'll be building a front end demo soon.)

	Example output:

	```json
	{
	"directors": [
		"Christopher Nolan",
		"Denis Villeneuve",
		"Gareth Edwards",
		"Robert Zemeckis",
		"Terry Gilliam"
	],
	"artists": [
		"Neil Young",
		"Parliament",
		"Pink Floyd",
		"Rush",
		"The Midnight",
		"Vangelis",
		"Yes"
	],
	"authors": [
		"George R. R. Martin",
		"Neal Stephenson",
		"Robert A. Heinlein",
		"William Gibson"
	],
	"movie_genres": [
		"dystopian",
		"sci-fi",
		"thriller"
	],
	"music_genres": [
		"ambient",
		"folk",
		"funk",
		"prog rock",
		"synthwave"
	],
	"book_genres": [
		"cyberpunk",
		"fantasy",
		"sci-fi"
	]
	}
	```

7. Try adding a media item. Use Postman. But FIRST, query on sci-fi books:

	http://localhost:3000/query?type=book&genre=sci-fi

	Result:
	```json
	[
	{
		"key": "0x74ab22b851c420ac0b7873e7aa44625e9bebbb81df1f412137f0cdd832d92c53",
		"auto_generated": "BOOK: The Moon is a Harsh Mistress - A lunar revolution with libertarian flair",
		"type": "book",
		"title": "The Moon is a Harsh Mistress",
		"description": "A lunar revolution with libertarian flair",
		"author": "Robert A. Heinlein",
		"genre": "sci-fi",
		"owned": "true",
		"rating": 5,
		"year": 1966
	}
	]
	```

	Now go to Postman and try adding a book:

	Method: POST

	URL: localhost:3000/save-new

	Body/JSON:

	```json
	{
		"type": "book",
		"title": "The Moon is a Harsh Mistress",
		"description": "A lunar revolution with libertarian flair",
		"author": "Robert A. Heinlein",
		"genre": "sci-fi",
		"rating": 5,
		"owned": true,
		"year": 1966
	}
	```

	After sending...

	Query again!

	http://localhost:3000/query?type=book&genre=sci-fi

	Results show two books now!

	```json
	[
	{
		"key": "0x74ab22b851c420ac0b7873e7aa44625e9bebbb81df1f412137f0cdd832d92c53",
		"auto_generated": "BOOK: The Moon is a Harsh Mistress - A lunar revolution with libertarian flair",
		"type": "book",
		"title": "The Moon is a Harsh Mistress",
		"description": "A lunar revolution with libertarian flair",
		"author": "Robert A. Heinlein",
		"genre": "sci-fi",
		"owned": "true",
		"rating": 5,
		"year": 1966
	},
	{
		"key": "0x26883fb7dbab0c435ce6928f756b7b2369015d39f580c070c8fb4ad277d57082",
		"auto_generated": "BOOK: The Moon is a Harsh Mistress - A lunar revolution with libertarian flair",
		"type": "book",
		"title": "The Moon is a Harsh Mistress",
		"description": "A lunar revolution with libertarian flair",
		"author": "Robert A. Heinlein",
		"genre": "sci-fi",
		"owned": "true",
		"rating": 5,
		"year": 1966
	}
	]
	```

# Coming Soon!

* Front end
* More advanced querying along with front-end support with dropdown boxes, including "OR" (so they can query certain books along with certain movies, etc)
* Ability to edit and delete media items
* Ability to "favorite" items (really just editing, but specialized :-) 
* Advanced querying by splitting names into individual parts as separate string annotations
* Users! That way people can have their own media library

