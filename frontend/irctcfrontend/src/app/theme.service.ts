import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDarkMode = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      this.isDarkMode.set(window.localStorage.getItem('irctc-theme') === 'dark');
      this.applyTheme();
    }
  }

  toggle(): void {
    const isDarkMode = !this.isDarkMode();
    this.isDarkMode.set(isDarkMode);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('irctc-theme', isDarkMode ? 'dark' : 'light');
      this.applyTheme();
    }
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle('dark', this.isDarkMode());
  }
}
