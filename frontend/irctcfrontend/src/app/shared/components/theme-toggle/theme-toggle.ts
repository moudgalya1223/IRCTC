import { Component, inject } from '@angular/core';

import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.html',
})
export class ThemeToggle {
  private readonly theme = inject(ThemeService);
  protected readonly isDarkMode = this.theme.isDarkMode;

  protected toggle(): void {
    this.theme.toggle();
  }
}
