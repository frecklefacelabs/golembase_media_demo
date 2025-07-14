import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListMedia } from './list-media/list-media'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListMedia],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular_front');
}
