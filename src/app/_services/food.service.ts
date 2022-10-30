import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.API_URI +  '/api/food/'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  getOrderCount(userId: string): Observable<any> {
    return this.http.get(API_URL + userId, { responseType: 'json' });
  }
  postOrder(foodName: string = '', price:number = 0, quantity:number = 0, userId: string): Observable<any> {
    const total = price * quantity
    return this.http.post(API_URL, { foodName,
      price,
      quantity,
      total,
      userId}, httpOptions);
  }
  getOrderTotal(userId: string): Observable<any> {
    return this.http.get(API_URL + 'total/' + userId, { responseType: 'json' });
  }

  deleteOrder(id:string, userId: string): Observable<any> {
    return this.http.delete(API_URL + userId + '/' + id);
  }
}
