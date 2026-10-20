import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotifyKitchenTicketDTO, NotifyUserDTO } from '../models/notify.models';

@Injectable({
    providedIn: 'root'
})
export class NotifyService {
    private bffUrl = `${environment.apiConfig.uri}/notification`;

    constructor(private zone: NgZone) {}

    getKitchenTicketsStream(): Observable<NotifyKitchenTicketDTO> {
        return new Observable(observer => {
            const eventSource = new EventSource(`${this.bffUrl}/kitchen/stream`, {withCredentials : true});
            eventSource.onmessage = event => {
                if (!event.data || event.data.trim() === '') return;

                try {
                    const ticket: NotifyKitchenTicketDTO = JSON.parse(event.data);
                    this.zone.run(() => observer.next(ticket));
                } catch (error) {
                    console.error('Error parseando ticket SSE:', error, event.data);
                }
            };
            eventSource.onerror = error => this.zone.run(() => observer.error(error));
            return () => eventSource.close();
        });
    }

    getUserNotificationsStream(): Observable<NotifyUserDTO> {
        return new Observable(observer => {
            const eventSource = new EventSource(`${this.bffUrl}/stream`, {withCredentials: true});
            eventSource.onopen = () => console.log('🟢 [SSE COCINA] Conexión abierta.');
            eventSource.onmessage = event => {
                if (!event.data || event.data.trim() === '') return;

                try {
                    const notification: NotifyUserDTO = JSON.parse(event.data);
                    this.zone.run(() => observer.next(notification));
                } catch (error) {
                    console.error('Error parseando notificación SSE:', error, event.data);
                }
            };

            eventSource.onerror = error => this.zone.run(() => observer.error(error));
            return () => eventSource.close();
        });
    }
}
