import {Injectable, NgZone, Service} from '@angular/core';
import {Observable} from 'rxjs';
import {AuditResponseDTO} from '../models/audit.model';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private bffUrl = `${environment.apiConfig.uri}/audits`;


    constructor(private http: HttpClient, private zone: NgZone) {
    }

    getTimeline(from?: string, to?: string): Observable<AuditResponseDTO[]> {
        let params = new HttpParams();
        if (from) params = params.set('from', from);
        if (to) params = params.set('to', to);
        return this.http.get<AuditResponseDTO[]>(`${this.bffUrl}/timeline`, {params});
    }

    getAuditStream(): Observable<AuditResponseDTO> {
        return new Observable(observer => {
            const eventSource = new EventSource(`${this.bffUrl}/stream`, {withCredentials: true});
            eventSource.onopen = () => console.log('Conexion SSE abierto');
            eventSource.onmessage = event => {
                if (!event.data || event.data.trim() === '') return;
                try {
                    const auditEvent: AuditResponseDTO = JSON.parse(event.data);
                    this.zone.run(() => observer.next(auditEvent));
                } catch (e) {
                    console.error('Error parseando JSON del Stream:', e, 'Data recibida:', event.data);
                }
            };
            eventSource.onerror = error => {
                console.error('🔴 [SSE ERROR DETECTADO]:', error);
                this.zone.run(() => observer.error(error));
            };
            return () => eventSource.close();
        });
    }

    createQueue(queueName: string): Observable<any> {
        return this.http.post(`${this.bffUrl}/queues`, { queueName });
    }

    deleteQueue(queueName: string): Observable<any> {
        return this.http.delete(`${this.bffUrl}/queues/${queueName}`,{responseType: 'text'});
    }

    getAllQueues(): Observable<any> {
        return this.http.get(`${this.bffUrl}/queues`);
    }

}
