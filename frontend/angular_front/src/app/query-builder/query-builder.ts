import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchOptions } from '../media';
import { Api } from '../api';

@Component({
  selector: 'app-query-builder',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './query-builder.html',
  styleUrl: './query-builder.css'
})
export class QueryBuilder {
  private apiService = inject(Api);
  private fb = inject(FormBuilder);

  public searchOptions = signal<SearchOptions | null>(null);
  public queryForm: FormGroup;
  public queryResult = signal<any | null>(null);

  constructor() {
    // Initialize the form structure
    this.queryForm = this.fb.group({
      type: ['Movie'], // Default type
      criteria: this.fb.array([])
    });
  }

  ngOnInit() {
    // Fetch options when the component loads
    this.apiService.getSearchOptions().subscribe(options => {
     this.searchOptions.set(options);
    });

    // Listen for changes to the main 'type' dropdown
    this.queryForm.get('type')?.valueChanges.subscribe(() => {
      if (this.criteria.length > 0) {
        if (window.confirm('This will remove the rest of the query. Are you sure?')) {
          this.criteria.clear();
        }
      }
    });
  }

  // Getter for easy access to the criteria FormArray in the template
  get criteria(): FormArray {
    return this.queryForm.get('criteria') as FormArray;
  }

  // Adds a new, empty criterion row to the form
  addCriterion() {
    const criterionGroup = this.fb.group({
      field: [''],
      value: ['']
    });
    this.criteria.push(criterionGroup);
  }

  // Removes a criterion row by its index
  removeCriterion(index: number) {
    this.criteria.removeAt(index);
  }

  // Dynamically get the field options based on the selected media type
  getFieldOptions(): string[] {
    const type = this.queryForm.get('type')?.value;
    switch (type) {
      case 'Movie': return ['Director', 'Genre', 'Year'];
      case 'Book': return ['Author', 'Genre', 'Year'];
      case 'Music': return ['Artist', 'Genre', 'Year'];
      default: return [];
    }
  }

  // Dynamically get the value options based on the selected field
  getValueOptions(criterionGroup: AbstractControl): string[] {
    const type = this.queryForm.get('type')?.value;
    const field = criterionGroup.get('field')?.value;
    const options = this.searchOptions();

    if (!options) return [];

    switch (field) {
      case 'Director': return options.directors;
      case 'Author': return options.authors;
      case 'Artist': return options.artists;
      case 'Genre':
        if (type === 'Movie') return options.movie_genres;
        if (type === 'Book') return options.book_genres;
        if (type === 'Music') return options.music_genres;
        return [];
      default: return [];
    }
  }

  // Builds and logs the final query string when "Go" is clicked
  executeQuery() {
    const formValue = this.queryForm.value;
    let queryString = `type=${formValue.type}`.toLowerCase();

    formValue.criteria.forEach((crit: { field: string, value: string }) => {
      if (crit.field && crit.value) {
        const fieldKey = crit.field.toLowerCase();
        queryString += `&${fieldKey}=${crit.value}`;
      }
    });

    console.log('Executing Query:', queryString);

    this.apiService.executeQuery(queryString).subscribe({
      next: (results) => {
        console.log('API Response from /search-options:', results);
        this.queryResult.set(results);
      },
      error: (err) => {
        console.error('Error fetching search options:', err);
      }
    });

  }
}
