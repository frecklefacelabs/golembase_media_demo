import { Component, inject, inputBinding, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../api';
import { Book } from '../media';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-show-book-details',
    imports: [RouterLink],
    templateUrl: './show-book-details.html',
    styleUrl: './show-book-details.css'
})
export class ShowBookDetails {
    private route = inject(ActivatedRoute);
    private apiService = inject(Api);

    public book = signal<Book | undefined>(undefined); // the undefined is in case we land on this page without clicking from the media list

    ngOnInit() {
        // Here we're going to handle two situations:
        // 1. If they click on the media list, we're filling in the book through the [state]=" data: book()"
        // 2. If they come to this URL directly, the book isn't getting filled in automatically.
        //    In that case, we'll obtain it from the back end. (This also covers bookmarking!)

        if (history?.state?.data) {
            console.log('Retreiving data from state!')
            this.book.set(history.state.data);
        }
        else {
            console.log('Retreiving data from API!');
            const key = this.route.snapshot.paramMap.get('key');
            console.log('Key is:', key)
            if (key) {
                this.apiService.getByKey(key as string).subscribe(bookValue => {
                    console.log('Data retreived:')
                    console.log(bookValue);
                    this.book.set(bookValue as Book);
                })
            }
        }
    }
}
