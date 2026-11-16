import { Injectable, signal } from '@angular/core';

export type NotificationVariant = 'success' | 'error';

export interface NotificationMessage {
  message: string;
  variant: NotificationVariant;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notification = signal<NotificationMessage | null>(null);

  showSuccess(message: string): void {
    this.notification.set({ message, variant: 'success' });
  }

  showError(message: string): void {
    this.notification.set({ message, variant: 'error' });
  }

  dismiss(): void {
    this.notification.set(null);
  }
}
