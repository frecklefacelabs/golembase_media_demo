import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../api';
import { Book } from '../media';

@Component({
  selector: 'app-edit-book-details',
  standalone: true,
  imports: [ReactiveFormsModule], // <-- Import for forms
  templateUrl: './edit-book-details.html',
  styleUrl: './edit-book-details.css'
})

export class EditBookDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(Api);
  private fb = inject(FormBuilder);

  public book = signal<Book | undefined>(undefined);
  public editForm!: FormGroup;

  ngOnInit() {
    this.initializeForm();

    if (history?.state?.data) {
      this.populateForm(history.state.data);
    } else {
      const key = this.route.snapshot.paramMap.get('key');
      if (key) {
        this.apiService.getByKey(key).subscribe(bookValue => {
          this.populateForm(bookValue as Book);
        });
      }
    }
  }

  initializeForm() {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      author: [''],
      description: [''],
      genre: [''],
      rating: [0],
      owned: [false],
      year: [0]
    });
  }

  populateForm(bookData: Book) {
    this.book.set(bookData);
    this.editForm.patchValue(bookData);
  }

  save() {
    if (this.editForm.valid) {
      const updatedBookData = { ...this.book(), ...this.editForm.value };
      console.log('Saving data:', updatedBookData);
      
      // In a real app, you would call your API service here:
      // this.apiService.save(updatedBookData).subscribe(() => {
      //   this.router.navigate(['/book', this.book()!.key]);
      // });

      // For now, we'll just navigate back
      this.router.navigate(['/book', this.book()!.key]);
    }
  }

  cancel() {
    // Navigate back to the details view without saving
    this.router.navigate(['/book', this.book()!.key]);
  }
}