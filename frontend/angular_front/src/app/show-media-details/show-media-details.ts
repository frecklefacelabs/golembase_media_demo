import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api } from '../api';
import { MediaItem } from '../media';

@Component({
  selector: 'app-show-media-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './show-media-details.html',
  styleUrl: './show-media-details.css'
})
export class ShowMediaDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(Api);

  // 1. Add a new optional input to receive data directly
  public itemInput = input<MediaItem | undefined>(undefined);

  // 2. The internal signal that the template will use
  public mediaItem = signal<MediaItem | undefined>(undefined);

  constructor() {
    // 3. Use an effect to automatically update the internal signal when the input changes
    effect(() => {
      if (this.itemInput()) {
        this.mediaItem.set(this.itemInput());
      }
    });
  }

  ngOnInit() {
    // 4. Only check the route/state if no data was passed via input
    if (!this.itemInput()) {
      if (history?.state?.data) {
        this.mediaItem.set(history.state.data);
      } else {
        const key = this.route.snapshot.paramMap.get('key');
        if (key) {
          this.apiService.getByKey(key).subscribe(itemValue => {
            this.mediaItem.set(itemValue as MediaItem);
          });
        }
      }
    }
  }
}