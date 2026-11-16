import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { env } from '../environments/env';
import { AppHeader } from './shared/components/app-header/app-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('irctcfrontend');
  protected readonly useMockApi = signal(false);

  ngOnInit(): void {
    this.useMockApi.set(env.useMockApi);
  }
}
