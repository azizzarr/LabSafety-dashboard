import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket$ = webSocket('wss://localhost:8090/stomp-endpoint');
    this.socket$.subscribe(
      () => console.log('WebSocket connection established.'),
      error => {
        console.error('WebSocket connection error:', error);
        // Attempt to reconnect after a delay
      //  setTimeout(() => this.connect(), 5000);
      },
      () => console.log('WebSocket connection closed.'),
    );
  }

  // Method to get chart data from WebSocket
  getChartData(): Observable<any> {
    return this.socket$.asObservable().pipe(
      catchError(err => {
        console.error('WebSocket error:', err);
        return throwError(err);
      })
    );
  }

  // Method to check WebSocket connection status
  checkConnectionStatus(): void {
    const socket = new WebSocket('wss://localhost:8090/stomp-endpoint');
    socket.onopen = () => console.log('WebSocket is open');
    socket.onmessage = event => console.log('Received:', event.data);
    socket.onerror = error => console.error('WebSocket error:', error);
    socket.onclose = () => console.log('WebSocket is closed');
  }
}
