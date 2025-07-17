import { Component, input } from '@angular/core';
import { Movie } from '../media';
import { Api } from '../api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-movie',
  imports: [RouterLink],
  templateUrl: './show-movie.html',
  styleUrl: './show-movie.css'
})
export class ShowMovie {

    public movie = input.required<Movie>(); // New type of input!

    constructor(private apiService: Api) {}
}
