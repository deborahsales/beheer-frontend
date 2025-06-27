import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { UserService } from './user.service';

interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = enviroment.apiUrl;

  constructor(private http: HttpClient, private userService: UserService) {}

  autenticar(
    email: string,
    senha: string
  ): Observable<HttpResponse<AuthResponse>> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/auth`,
        {
          email,
          senha,
        },
        { observe: 'response' }
      )
      .pipe(
        tap((response) => {
          const authToken = response.body?.access_token || '';
          this.userService.storeToken(authToken);
        })
      );
  }
}
