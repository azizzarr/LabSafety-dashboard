// src/app/services/firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private baseUrl = 'http://localhost:8090/api/alerts'; // Replace with your backend URL

  constructor(private http: HttpClient) {}
 /* getAllAlerts(): Observable<Map<string, any>> {
    return this.http.get<Map<string, any>>(`${this.baseUrl}/all`);
  }*/
 /* private db: any;

  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyDOeDgMtb46BsqzyfcMuPJcS8zAinJBP1A',
      authDomain: 'alert-charge-esd.firebaseapp.com',
      projectId: 'alert-charge-esd',
      storageBucket: 'alert-charge-esd.appspot.com',
      messagingSenderId: '23002862921',
      appId: '1:23002862921:web:e6c3cb70c4fc2bd3197698',
      measurementId: 'G-FHN5JZK2D1',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    // Initialize Firestore
    this.db = getFirestore(app);
  }

  async addAlert(alert: any) {
    try {
      console.log('Attempting to add alert:', alert);
      const docRef = await addDoc(collection(this.db, 'alerts'), alert);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  async getAlerts() {
    try {
      console.log('Fetching alerts...');
      const querySnapshot = await getDocs(collection(this.db, 'alerts'));
      const alerts = querySnapshot.docs.map(doc => doc.data());
      console.log('Fetched alerts:', alerts);
      return alerts;
    } catch (e) {
      console.error('Error fetching alerts:', e);
      return [];
    }
  }*/
}
