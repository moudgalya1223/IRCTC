import { Injectable } from '@angular/core';
import {
  ConfirmationResult,
  RecaptchaVerifier,
  UserCredential,
  getAuth,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';

import { env } from '../../../environments/env';

@Injectable({ providedIn: 'root' })
export class PhoneVerificationService {
  private confirmationResult: ConfirmationResult | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  async sendOtp(phoneNumber: string): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Phone verification is only available in a browser.');
    }

    const app = getApps().length > 0 ? getApps()[0] : initializeApp(env.firebase);
    const auth = getAuth(app);

    this.recaptchaVerifier?.clear();
    this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });

    this.confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      this.recaptchaVerifier,
    );
  }

  async verifyOtp(otp: string): Promise<string> {
    if (!this.confirmationResult) {
      throw new Error('Request an OTP before verifying it.');
    }

    const credential: UserCredential = await this.confirmationResult.confirm(otp);
    return credential.user.getIdToken();
  }
}
