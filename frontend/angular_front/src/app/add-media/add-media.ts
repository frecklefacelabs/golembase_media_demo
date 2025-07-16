import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api } from '../api';
import { MediaItem } from '../media';

@Component({
  selector: 'app-add-media',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-media.html',
  styleUrl: './add-media.css'
})
export class AddMediaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(Api);

  public addMediaForm: FormGroup;
  public selectedType: 'Book' | 'Movie' | 'Music' = 'Book'; // Default selection

  constructor() {
    // Initialize the form with a type control
    this.addMediaForm = this.fb.group({
      type: ['Book', Validators.required]
    });
  }

  ngOnInit() {
    // Set the initial form fields for the default type
    this.setFormFields(this.selectedType);

    // Listen for changes to the type dropdown and swap the form fields
    this.addMediaForm.get('type')?.valueChanges.subscribe(type => {
      this.selectedType = type;
      this.setFormFields(type);
    });
  }

  // Dynamically sets the form controls based on the selected media type
  setFormFields(type: 'Book' | 'Movie' | 'Music') {
    // Clear existing controls (except for 'type') to start fresh
    Object.keys(this.addMediaForm.controls).forEach(key => {
      if (key !== 'type') {
        this.addMediaForm.removeControl(key);
      }
    });

    // Add common fields for all types
    this.addMediaForm.addControl('title', this.fb.control('', Validators.required));
    this.addMediaForm.addControl('description', this.fb.control(''));
    this.addMediaForm.addControl('genre', this.fb.control(''));
    this.addMediaForm.addControl('rating', this.fb.control(null, [Validators.min(0), Validators.max(10)]));
    this.addMediaForm.addControl('year', this.fb.control(null, [Validators.min(1000), Validators.max(new Date().getFullYear())]));

    // Add controls specific to the selected type
    if (type === 'Book') {
      this.addMediaForm.addControl('author', this.fb.control('', Validators.required));
      this.addMediaForm.addControl('owned', this.fb.control(false));
    } else if (type === 'Movie') {
      this.addMediaForm.addControl('director', this.fb.control('', Validators.required));
      this.addMediaForm.addControl('watched', this.fb.control(false));
    } else if (type === 'Music') {
      this.addMediaForm.addControl('artist', this.fb.control('', Validators.required));
      this.addMediaForm.addControl('favorite', this.fb.control(false));
    }
  }

  // Handles the form submission
  saveMedia() {
    if (this.addMediaForm.valid) {
      
      const formValue = this.addMediaForm.value;
      const mediaItem: MediaItem = {
        ...formValue,
        type: formValue.type.toLowerCase()
      }
      console.log('Saving item:', mediaItem);

      this.apiService.save(mediaItem).subscribe({
        next: (response) => {
          console.log('Save successful!', response);
          // Optionally, reset the form or navigate away
          this.addMediaForm.reset({ type: this.selectedType });
        },
        error: (err) => {
          console.error('Save failed:', err);
        }
      });
    } else {
      console.error('Form is invalid.');
    }
  }
}