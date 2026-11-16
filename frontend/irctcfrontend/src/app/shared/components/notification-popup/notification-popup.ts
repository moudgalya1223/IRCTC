import { Component, OnDestroy, OnInit, input, output } from '@angular/core';

@Component({
  selector: 'app-notification-popup',
  standalone: true,
  templateUrl: './notification-popup.html',
})
export class NotificationPopup implements OnInit, OnDestroy {
  readonly message = input.required<string>();
  readonly variant = input<'success' | 'error'>('success');
  readonly closed = output<void>();

  private dismissTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.dismissTimer = setTimeout(() => this.close(), 4000);
  }

  ngOnDestroy(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
    }
  }

  protected close(): void {
    this.closed.emit();
  }
}
