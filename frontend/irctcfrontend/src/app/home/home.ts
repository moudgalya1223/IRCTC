import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../theme.service';
import { ThemeToggle } from '../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ThemeToggle],
  templateUrl: './home.html',
})
export class Home {
  private readonly theme = inject(ThemeService);
  protected readonly isDarkMode = this.theme.isDarkMode;

}
