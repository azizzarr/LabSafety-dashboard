import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { SignUpRequest } from '../models/signup-request.model';
import {Role} from '../models/role.model';
import {Permission} from "../models/permission.model";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private signupUrl = 'http://localhost:8097/api/auth/signup';
  private signinUrl = 'http://localhost:8097/api/auth/signin';
  private addUserUrl = 'http://localhost:8097/users/addUser';
  private rolesUrl = 'http://localhost:8097/role/getRole';
  private apiUrl = 'http://localhost:8097';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ID_KEY = 'user_id';
  private readonly EMAIL = 'email';
  private importUsersUrl = 'http://localhost:8097/users/import';
  private getPdfUrl = 'http://localhost:8097/users/pdf';
  private updateUserUrl = 'http://localhost:8097/users/updateUser';
  private permissionsUrl = 'http://localhost:8097/users/getpermissions';
  private checkPermissionUrl = 'http://localhost:8097/users/checkPermission';
  private deleteUserUrl = 'http://localhost:8097/users/delete';
  private secondAppUrl = 'http://localhost:65495'; // Replace with your second app's URL
  private allowedOrigin = 'http://localhost:65495'
  constructor(private http: HttpClient) {}
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    // Add more robust token validation logic here if needed
    return !!token;
  }

  signup(signUpRequest: SignUpRequest): Observable<any> {
    return this.http.post(this.signupUrl, signUpRequest).pipe(
      tap(response => console.log('Signup success:', response)),
      catchError(error => {
        console.log('Signup error:', error);
        return throwError(error);
      })
    );
  }

  signin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/signin`, data).pipe(
      tap(result => {
        console.log('signin result:', result);
        const token = (result as { token: string }).token;

        // Store the token locally in the first app
        this.storeToken(token);

        // Send the token to the second app
        this.sendTokenToSecondApp(token);

        const userId = +(result as { userId: string }).userId;
        this.storeUserId(userId);
      }),
      catchError(error => {
        console.error(error);
        return throwError(error);
      })
    );
  }





  private sendTokenToSecondApp(token: string): void {
    // Check if window.postMessage is supported
    if (window.postMessage) {
      // Send message to second app
      window.postMessage({ token: token }, this.secondAppUrl);
    } else {
      console.warn('window.postMessage is not supported in this browser.');
    }
  }
  addUser(data: any): Observable<any> {
    return this.http.post<any>(this.signupUrl, data).pipe(
      catchError(error => {
        console.error('Error adding user:', error);
        return throwError(error);
      })
    );
  }
  updateUser(user: any, userID: number): Observable<any> {
    return this.http.post<any>(`${this.updateUserUrl}/${userID}`, user).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(error);
      })
    );
  }
  addPermissionToUser(userName: string, permissionName: string): Observable<any> {
    const url = `${this.apiUrl}/users/addPermissionToUser`;

    const body = {
      userName: userName, // Update to "userName"
      permissionName: permissionName,
    };

    return this.http.post(url, body).pipe(
      catchError(error => {
        console.error('Error adding permission to user:', error);
        return throwError(error);
      })
    );
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/getAllUsers`);
  }
  getUsersByRoleRH(): Observable<User[]> {
    const url = `${this.apiUrl}/users/ROLE_RH`; // Endpoint URL for fetching users with ROLE_RH role
    return this.http.get<User[]>(url);
  }
  getUsersByRoleAdmin(): Observable<User[]> {
    const url = `${this.apiUrl}/users/ROLE_ADMIN`; // Endpoint URL for fetching users with ROLE_RH role
    return this.http.get<User[]>(url);
  }
  sendPasswordResetEmail(email: string): Observable<any> {
    // Store email in local storage
    localStorage.setItem('resetEmail', email);

    const url = `${this.apiUrl}/users/email/${email}`;
    return this.http.post(url, null).pipe(
      catchError(error => {
        console.error('Error sending password reset email:', error);
        return throwError(error);
      })
    );
  }
  updatePasswordByEmail(newPassword: string): Observable<any> {
    // Retrieve email from local storage
    const email = localStorage.getItem('resetEmail');

    // Check if email is available
    if (!email) {
      return throwError('Email not found in local storage');
    }

    // Construct the URL with email and new password
    const url = `${this.apiUrl}/users/password/${email}/${newPassword}`;

    // Make the HTTP PUT request
    return this.http.put(url, null).pipe(
      catchError(error => {
        console.error('Error updating password:', error);
        return throwError(error);
      })
    );
  }
  public storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public storeUserId(userId: number): void {
    localStorage.setItem(this.USER_ID_KEY, userId.toString());
  }

  getUserId(): Observable<number> {
    return new Observable<number>(observer => {
      const userIdStr = localStorage.getItem(this.USER_ID_KEY);
      const userId = userIdStr ? +userIdStr : undefined; // parse userId as a number
      observer.next(userId);
      observer.complete();
    });
  }

  registerUserForEvent(eventId: number, userId: number): Observable<string> {
    const url = `${this.apiUrl}/events/${eventId}/register/${userId}`;
    return this.http.post<string>(url, null);
  }

  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY) as string;
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.rolesUrl);
  }
  importUsers(filePath: string): Observable<any> {
    const url = `${this.importUsersUrl}?filePath=${encodeURIComponent(filePath)}`;
    return this.http.post(url, {}).pipe(
      catchError(error => {
        console.error('Error importing users:', error);
        return throwError(error);
      })
    );
  }
  getPdf(): Observable<HttpResponse<Blob>> {
    return this.http.get(this.getPdfUrl, {
      responseType: 'blob',
      observe: 'response',
    });
  }
  getUserById(userId: number): Observable<User> {
    const url = `${this.apiUrl}/users/${userId}`;
    return this.http.get<User>(url);
  }
  getUserPermissions(userName: string): Observable<Permission[]> {
    const url = `${this.permissionsUrl}/${userName}`;
    return this.http.get<Permission[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching user permissions:', error);
        return throwError(error);
      }),
    );
  }

  checkPermission(permissionName: string): Observable<any> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders({
      'Authorization': token
    });

    return this.http.post<any>(`${this.apiUrl}/users/checkPermission/${permissionName}`, null, { headers })
      .pipe(
        catchError(error => {
          console.error('Error checking permission:', error);
          return throwError(error); // Maintain error handling for non-200 statuses
        })
      );
  }

  checkPermission1(token: string, permissionName: string): Observable<any> {
    // Prepare the request headers with Authorization token
    const headers = new HttpHeaders({
      'Authorization': token
    });

    // Append the permissionName to the URL
    const url = `${this.checkPermissionUrl}/${permissionName}`;

    // Make the HTTP POST request to check permission with an empty body
    return this.http.post<any>(url, {}, { headers }).pipe(
      catchError(error => {
        if (error.status === 200) {
          // Handle successful response with status 200
          console.log('Permission check succeeded:', error);
          return of(error.error); // Return the successful response
        } else {
          // Handle other errors
          console.error('Error checking permission:', error);
          // Log the response body
          console.log('Error body:', error.error);
          // Log the request details
          console.log('Request URL:', url);
          console.log('Request Headers:', headers);
          return throwError(error);
        }
      })
    );
  }
  deleteUserById(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteUserUrl}/${userId}`).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(error);
      })
    );
  }
  countAdminUsers(): Observable<number> {
    const countAdminUsersUrl = `${this.apiUrl}/users/countAdminUsers`;
    return this.http.get<number>(countAdminUsersUrl).pipe(
      catchError(error => {
        console.error('Error counting admin users:', error);
        return throwError(error);
      })
    );
  }
  countRhUsers(): Observable<number> {
    const countRhUsersUrl = `${this.apiUrl}/users/countRhUsers`;
    return this.http.get<number>(countRhUsersUrl).pipe(
      catchError(error => {
        console.error('Error counting rh users:', error);
        return throwError(error);
      })
    );
  }
  countUserUsers(): Observable<number> {
    const countUserUsersUrl = `${this.apiUrl}/users/countUserUsers`;
    return this.http.get<number>(countUserUsersUrl).pipe(
      catchError(error => {
        console.error('Error counting user users:', error);
        return throwError(error);
      })
    );
  }
  exportUsers(): Observable<any> {
    const exportUsersUrl  = `${this.apiUrl}/users/export`;
    return this.http.get(exportUsersUrl, { responseType: 'text' }).pipe(
      catchError(error => {
        console.error('Error exporting users:', error);
        return throwError(error);
      })
    );
  }
}


class User {
  constructor(
    public username: string,
    public email: string,
    public password: string,
    public roles: string[], // added role property
  ) {}

  toSignUpRequest() {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      roles: this.roles.map(roleName => ({ name: roleName } as Role)),
    };
  }
/*
  static fromSignUpRequest(signUpRequest: SignUpRequest) {
    const roles = signUpRequest.roles.map(role => role.);
    return new User(
      signUpRequest.username,
      signUpRequest.email,
      signUpRequest.password,
      roles // Remove the .name from the role object
    );
  }
 */
}



