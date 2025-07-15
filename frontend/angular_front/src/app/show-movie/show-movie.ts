import { Component, input } from '@angular/core';
import { Movie } from '../media';
import { Api } from '../api';

@Component({
  selector: 'app-show-movie',
  imports: [],
  templateUrl: './show-movie.html',
  styleUrl: './show-movie.css'
})
export class ShowMovie {

    public movie = input.required<Movie>(); // New type of input!

    constructor(private apiService: Api) {}
}
