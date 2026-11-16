import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  WritableSignal,
  inject,
  output,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { NotificationPopup } from '../shared/components/notification-popup/notification-popup';
import { NotificationService } from '../shared/services/notification.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NotificationPopup, RouterLink],
  templateUrl: './login.html',
})
export class Login implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  protected readonly notification = inject(NotificationService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  protected readonly notificationMessage = this.notification.notification;
  protected readonly heroTitle = signal('');
  protected readonly heroAccent = signal('');
  protected readonly heroDescription = signal('');
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected isSubmitting = false;
  readonly closed = output<void>();
  private typingTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.typeText('Journey smarter,', this.heroTitle, () => {
      this.typeText('travel together.', this.heroAccent, () => {
        this.typeText(
          'Access bookings, live train status, and seamless travel planning from one secure portal.',
          this.heroDescription,
        );
      });
    });
  }

  ngOnDestroy(): void {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.close();
  }

  protected close(): void {
    this.closed.emit();
    this.router.navigate(['/home']);
  }

  protected openRegistration(): void {
    this.router.navigate(['/classic-enroll']);
  }

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { email, password } = this.loginForm.getRawValue();

    this.loginService.login(email, password).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        this.isSubmitting = false;
        this.router.navigate(['/train-search']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.notification.showError(this.getErrorMessage(error));
      },
    });
  }

  private typeText(
    text: string,
    target: WritableSignal<string>,
    onComplete?: () => void,
  ): void {
    let characterIndex = 0;
    target.set('');

    const typeNextCharacter = (): void => {
      target.set(text.slice(0, characterIndex + 1));
      characterIndex += 1;

      if (characterIndex < text.length) {
        this.typingTimer = setTimeout(typeNextCharacter, 45);
      } else {
        onComplete?.();
      }
    };

    this.typingTimer = setTimeout(typeNextCharacter, 250);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const response = error.error;
    const responseMessage =
      typeof response === 'string'
        ? response
        : response?.detail ?? response?.message;

    if (error.status === 401) {
      return `401: ${responseMessage || 'Unauthorized user.'}`;
    }

    return responseMessage || 'Unable to log in. Please try again.';
  }
}
