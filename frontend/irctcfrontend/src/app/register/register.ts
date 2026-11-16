import { Component, HostListener, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { NotificationPopup } from '../shared/components/notification-popup/notification-popup';
import { NotificationService } from '../shared/services/notification.service';
import { ThemeService } from '../theme.service';
import { env } from '../../environments/env';
import { getHttpErrorMessage, isConflictError } from '../shared/errors/http-error';
import {
  RegistrationRequest,
  RegistrationService,
} from './services/registration.service';
import { PhoneVerificationService } from './services/phone-verification.service';

const PASSWORD_PATTERN =
  /^(?=.{11,15}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])(?!.*(.)\1\1)\S+$/;
const FORBIDDEN_SEQUENCES = [
  '012', '123', '234', '345', '456', '567', '678', '789',
  '987', '876', '765', '654', '543', '432', '321', '210',
  'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij',
  'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr',
  'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz',
];

function passwordPolicy(control: AbstractControl): ValidationErrors | null {
  const password = control.value as string;
  const normalizedPassword = password.toLowerCase();

  return PASSWORD_PATTERN.test(password) &&
    !FORBIDDEN_SEQUENCES.some((sequence) => normalizedPassword.includes(sequence))
    ? null
    : { passwordPolicy: true };
}

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NotificationPopup],
  templateUrl: './register.html',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly registrationService = inject(RegistrationService);
  private readonly phoneVerificationService = inject(PhoneVerificationService);
  private readonly theme = inject(ThemeService);
  protected readonly notification = inject(NotificationService);
  protected readonly notificationMessage = this.notification.notification;
  protected readonly requiresPhoneVerification = env.requirePhoneVerification;
  protected readonly isDarkMode = this.theme.isDarkMode;
  protected isSubmitting = false;
  protected showPassword = false;
  protected showConfirmPassword = false;
  protected isSendingOtp = false;
  protected isVerifyingOtp = false;
  protected otpSent = false;
  protected phoneVerified = false;

  protected readonly registrationForm = this.formBuilder.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.maxLength(99)]],
      documentName: ['', [Validators.required, Validators.maxLength(110)]],
      password: ['', [Validators.required, passwordPolicy]],
      confirmPassword: ['', Validators.required],
      mobileNumber: [
        '',
        [
          ...(env.requirePhoneVerification ? [Validators.required] : []),
          Validators.pattern(/^\+[1-9]\d{7,14}$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.pattern(/^\d{6}$/)]],
      idToken: ['', env.requirePhoneVerification ? Validators.required : []],
    },
    { validators: passwordsMatch },
  );

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.close();
  }

  protected close(): void {
    this.router.navigate(['/login']);
  }

  protected submit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const values = this.registrationForm.getRawValue();
    const request: RegistrationRequest = {
      username: values.username,
      password: values.password,
      mobilenumber: values.mobileNumber || null,
      document_As_per_document: values.documentName,
      email: values.email,
      id_token: values.idToken || null,
    };

    this.registrationService.register(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse | Error) => {
        this.isSubmitting = false;
        if (isConflictError(error)) {
          this.router.navigate(['/login']);
          return;
        }

        this.notification.showError(this.getErrorMessage(error));
      },
    });
  }

  protected async sendOtp(): Promise<void> {
      const mobileNumber = this.registrationForm.controls.mobileNumber;
      mobileNumber.markAsTouched();

      if (mobileNumber.invalid) {
        return;
      }

      this.isSendingOtp = true;
      try {
        await this.phoneVerificationService.sendOtp(mobileNumber.value);
        this.otpSent = true;
        this.phoneVerified = false;
        this.registrationForm.controls.idToken.reset();
        this.notification.showSuccess('OTP sent to your mobile number.');
      } catch (error: unknown) {
        this.notification.showError(this.getErrorMessage(error));
      } finally {
        this.isSendingOtp = false;
      }
    }

  protected async verifyOtp(): Promise<void> {
      const otp = this.registrationForm.controls.otp;
      otp.markAsTouched();

      if (otp.invalid) {
        return;
      }

      this.isVerifyingOtp = true;
      try {
        const idToken = await this.phoneVerificationService.verifyOtp(otp.value);
        this.registrationForm.controls.idToken.setValue(idToken);
        this.phoneVerified = true;
        this.notification.showSuccess('Phone number verified successfully.');
      } catch (error: unknown) {
        this.phoneVerified = false;
        this.registrationForm.controls.idToken.reset();
        this.notification.showError(this.getErrorMessage(error));
      } finally {
        this.isVerifyingOtp = false;
      }
    }

  protected resetPhoneVerification(): void {
    this.otpSent = false;
    this.phoneVerified = false;
    this.registrationForm.controls.otp.reset();
    this.registrationForm.controls.idToken.reset();
  }

  private getErrorMessage(error: unknown): string {
    return getHttpErrorMessage(error, 'Unable to complete registration. Please try again.');
  }
}
