import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { env } from '../../../environments/env';

export interface RegistrationRequest {
  username: string;
  password: string;
  mobilenumber: string | null;
  document_As_per_document: string;
  email: string;
  id_token: string | null;
}

export interface RegistrationResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly http = inject(HttpClient);
  private readonly registrationUrl = `${env.apiBaseUrl}/classic-enroll`;

  register(request: RegistrationRequest): Observable<RegistrationResponse> {
    if (env.useMockApi) {
      return of({ message: 'Mock registration completed successfully.' });
    }

    if (env.requirePhoneVerification && !request.id_token) {
      return throwError(() => new Error('Complete phone verification before registering.'));
    }

    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      });

      return this.http.post<RegistrationResponse>(this.registrationUrl, request, {
        headers,
      });
    }

    return this.http.post<RegistrationResponse>(this.registrationUrl, request);
  }
}
