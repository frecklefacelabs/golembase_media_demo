import { Routes } from '@angular/router';
import { ListMedia } from './list-media/list-media';
import { ShowBookDetails } from './show-book-details/show-book-details';
import { EditBookDetailsComponent } from './edit-book-details/edit-book-details';
import { QueryBuilder } from './query-builder/query-builder';
import { AddMediaComponent } from './add-media/add-media';

export const routes: Routes = [

	// Base URL

	{ path: '', component: ListMedia },

	{ path: 'book/:key', component: ShowBookDetails },

	{ path: 'book/:key/edit', component: EditBookDetailsComponent},

	{ path: 'query', component: QueryBuilder },

	{ path: 'add', component: AddMediaComponent }

];
