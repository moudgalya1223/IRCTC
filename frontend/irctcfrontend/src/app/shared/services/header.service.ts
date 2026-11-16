import { Injectable, signal } from '@angular/core';

export interface HeaderLink {
  label: string;
  route: string;
}

@Injectable({ providedIn: 'root' })
export class HeaderService {
  readonly links = signal<readonly HeaderLink[]>([
    { label: 'HOME', route: '/home' },
    { label: 'TRAINS', route: '/train-search' },
    { label: 'LOGIN', route: '/login' },
    { label: 'REGISTER', route: '/classic-enroll' },
  ]);
}
