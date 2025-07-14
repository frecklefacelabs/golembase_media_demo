import { Component, input } from '@angular/core';
import { Book } from '../media';
import { Api } from '../api';

@Component({
    selector: 'app-show-book',
    imports: [],
    templateUrl: './show-book.html',
    styleUrl: './show-book.css'
})
export class ShowBook {

    public book = input.required<Book>(); // New style input!

    constructor(private apiService: Api) {}

    // From gemini:
    //
    // // Example of calling the GET method
    // fetchPosts(): void {
    //     this.apiService.getPosts().subscribe({
    //         next: (posts) => {
    //             console.log('GET Request Successful:', posts);
    //         },
    //         error: (err) => {
    //             console.error('Error fetching posts:', err);
    //         }
    //     });
    // }

    // // Example of calling the POST method
    // addPost(): void {
    //     const newPost: Post = {
    //         title: 'My New Post',
    //         body: 'This is the body of the post.',
    //         userId: 1
    //     };

    //     this.apiService.createPost(newPost).subscribe({
    //         next: (createdPost) => {
    //             console.log('POST Request Successful:', createdPost);
    //         },
    //         error: (err) => {
    //             console.error('Error creating post:', err);
    //         }
    //     });
    // }
}
