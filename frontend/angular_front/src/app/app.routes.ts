import { Routes } from '@angular/router';
import { ListMedia } from './list-media/list-media';
import { ShowBookDetails } from './show-book-details/show-book-details';
import { EditBookDetailsComponent } from './edit-book-details/edit-book-details';
import { QueryBuilder } from './query-builder/query-builder';
import { AddMediaComponent } from './add-media/add-media';
import { EditMediaComponent } from './edit-media/edit-media';
import { ShowMediaDetailsComponent } from './show-media-details/show-media-details';

export const routes: Routes = [

	// Base URL

	{ path: '', component: ListMedia },

	{ path: 'book/:key', component: ShowMediaDetailsComponent },

	{ path: 'movie/:key', component: ShowMediaDetailsComponent },

	{ path: 'music/:key', component: ShowMediaDetailsComponent },

	{ path: 'book/:key/edit', component: EditMediaComponent },

	{ path: 'movie/:key/edit', component: EditMediaComponent },
	
	{ path: 'music/:key/edit', component: EditMediaComponent },	

	{ path: 'query', component: QueryBuilder },

	{ path: 'add', component: AddMediaComponent }

];
