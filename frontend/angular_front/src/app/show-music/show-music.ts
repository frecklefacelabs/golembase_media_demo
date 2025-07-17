import { Component, input } from '@angular/core';
import { Api } from '../api';
import { Music } from '../media';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-music',
  imports: [RouterLink],
  templateUrl: './show-music.html',
  styleUrl: './show-music.css'
})
export class ShowMusic {

    public music = input.required<Music>(); // New type of input!

    constructor(private apiService: Api) {}
  
  }
