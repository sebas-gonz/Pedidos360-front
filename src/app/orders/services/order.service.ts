import {Injectable, Service} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {OrderCreatedRequestDTO, OrderResponseDTO} from '../models/order.models';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiConfig.uri}/orders`;

    constructor(private http: HttpClient) { }

    createOrder(orderRequest: OrderCreatedRequestDTO): Observable<OrderResponseDTO> {
        return this.http.post<OrderResponseDTO>(this.apiUrl, orderRequest);
    }

    getOrdersByUser(userId: string): Observable<OrderResponseDTO[]> {
        return this.http.get<OrderResponseDTO[]>(`${this.apiUrl}/users/${userId}`);
    }

    getAllOrders(): Observable<OrderResponseDTO[]> {
        return this.http.get<OrderResponseDTO[]>(this.apiUrl);
    }

    updateOrderStatus(orderUuid: string, newStatus: string): Observable<OrderResponseDTO> {
        return this.http.put<OrderResponseDTO>(`${this.apiUrl}/${orderUuid}/status`, { orderStatus: newStatus });
    }
    getOrdersByStatus(status: string): Observable<OrderResponseDTO[]> {
        return this.http.get<OrderResponseDTO[]>(`${this.apiUrl}/status/${status}`);
    }
}
