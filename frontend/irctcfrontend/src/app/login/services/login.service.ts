import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  uuid: string;
  access_token: string;
  token_type: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly loginUrl = 'http://127.0.0.1:8000/getlogindetails';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, {
      username: email,
      password,
    });
  }
}
