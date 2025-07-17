import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule for pipes
import { Api } from '../api';
import { MediaItem } from '../media';

@Component({
  selector: 'app-show-media-details', // Renamed selector
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './show-media-details.html',
  styleUrl: './show-media-details.css'
})
export class ShowMediaDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(Api);

  // Use the generic MediaItem type for the signal
  public mediaItem = signal<MediaItem | undefined>(undefined);

  ngOnInit() {
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