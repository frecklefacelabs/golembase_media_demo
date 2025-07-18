import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api } from '../api';
import { MediaItem, Book, Movie, Music } from '../media';

@Component({
  selector: 'app-edit-media',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-media.html',
  styleUrl: './edit-media.css'
})
export class EditMediaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(Api);
  private fb = inject(FormBuilder);

  public mediaItem = signal<MediaItem | undefined>(undefined);
  public editForm!: FormGroup;

  ngOnInit() {
    // Initialize with a placeholder form
    this.editForm = this.fb.group({});

    // Load data from state or API
    if (history?.state?.data) {
      this.setupFormForMedia(history.state.data);
    } else {
      const key = this.route.snapshot.paramMap.get('key');
      if (key) {
        this.apiService.getByKey(key).subscribe(item => {
          this.setupFormForMedia(item as MediaItem);
        });
      }
    }
  }

  setupFormForMedia(item: MediaItem) {
    this.mediaItem.set(item);

    // Common fields for all types
    this.editForm = this.fb.group({
      title: [item.title, Validators.required],
      description: [item.description],
      genre: [item.genre],
      rating: [item.rating, [Validators.min(0), Validators.max(10)]],
      year: [item.year, [Validators.min(1000), Validators.max(new Date().getFullYear())]],
    });

    // Add controls specific to the media type
    switch (item.type) {
      case 'book':
        this.editForm.addControl('author', this.fb.control((item as Book).author, Validators.required));
        this.editForm.addControl('owned', this.fb.control((item as Book).owned));
        break;
      case 'movie':
        this.editForm.addControl('director', this.fb.control((item as Movie).director, Validators.required));
        this.editForm.addControl('watched', this.fb.control((item as Movie).watched));
        break;
      case 'music':
        this.editForm.addControl('artist', this.fb.control((item as Music).artist, Validators.required));
        this.editForm.addControl('favorite', this.fb.control((item as Music).favorite));
        break;
    }
  }

  save() {
    if (this.editForm.valid && this.mediaItem()) {
      // Merge the original item (for key and type) with the form's values
      const updatedItem = { ...this.mediaItem(), ...this.editForm.value };
      console.log('Saving data:', updatedItem);

      this.apiService.save(updatedItem).subscribe(() => {
        this.navigateBack();
      });
    }
  }

  cancel() {
    this.navigateBack();
  }

  private navigateBack() {
    const item = this.mediaItem();
    if (item) {
      // Navigate back to the correct details view (e.g., '/book/key')
      this.router.navigate([`/${item.type}`, item.key]);
    }
  }
}