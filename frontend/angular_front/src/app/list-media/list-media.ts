import { Component, signal } from '@angular/core';
import { Api } from '../api';
import { MediaItem } from '../media';
import { isNgContainer } from '@angular/compiler';
import { ShowBook } from '../show-book/show-book'
import { ShowMusic } from '../show-music/show-music'
import { ShowMovie } from '../show-movie/show-movie'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-media',
  imports: [ ShowBook, ShowMusic, ShowMovie],
  templateUrl: './list-media.html',
  styleUrl: './list-media.css'
})
export class ListMedia {

    public demoDataPresent = false;

    public mediaList = signal<MediaItem[]>([]);

    constructor(private apiService: Api) {}

    ngOnInit(): void {
        this.loadMedia()
    }

    loadDemoData() {
        this.apiService.loadDemoDataIntoGolem().subscribe({
            next:(str) => {
                // After demo data is loaded into Golem, try again
                this.loadMedia();
            }
        });
    }

    loadMedia() {
        this.apiService.getAll().subscribe({
            next: (data) => {

                this.mediaList.set(data);
                console.log('Demo data:')
                console.log(data);

                this.demoDataPresent = data && data.length > 0;
            },
            error: (err) => { // todo - display a friendly error on the page
                console.log('Error loading media: ', err)
            }
        })
    }
}

