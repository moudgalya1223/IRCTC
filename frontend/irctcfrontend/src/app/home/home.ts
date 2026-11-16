import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  private readonly theme = inject(ThemeService);
  protected readonly isDarkMode = this.theme.isDarkMode;

}
