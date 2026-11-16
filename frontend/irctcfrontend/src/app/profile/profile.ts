import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
})
export class Profile {
  private readonly router = inject(Router);
  protected readonly isOpen = signal(false);

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.isOpen.set(false);
  }

  protected toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  protected logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
