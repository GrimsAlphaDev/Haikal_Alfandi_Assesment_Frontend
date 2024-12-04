import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Cookies from 'js-cookie';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  responseResult: boolean;
  message: string;
  data?: dataResponse;
}

interface dataResponse {
  token: string;
  id_user: string;
  username: string;
  nama_lengkap: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://dev.patriotmed.id/dashboard-user/LoginDashboard';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: {
    username: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((response) => {
        if (response.responseResult) {
          localStorage.setItem('token', response.data!.token);
          Cookies.set('session', response.data!.token);
        } else {
          alert(response.message);
          throw new Error(response.message);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    Cookies.remove('session');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    // return !!Cookies.get('session');
    return !!localStorage.getItem('token');
  }
}
