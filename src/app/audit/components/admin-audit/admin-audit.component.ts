import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuditResponseDTO} from '../../models/audit.model';
import {Subscription} from 'rxjs';
import {AuditService} from '../../services/audit-service';

@Component({
    imports: [CommonModule, FormsModule],
    selector: 'app-admin-audit',
    styleUrl: './admin-audit.component.css',
    templateUrl: './admin-audit.component.html',
})
export class AdminAuditComponent implements OnInit, OnDestroy {
    timelineEvents: AuditResponseDTO[] = [];
    activeQueues: string[] = [];
    newQueueName: string = '';

    private streamSubscription?: Subscription;

    constructor(private auditService: AuditService,
                private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.loadQueues();
        this.loadHistoricalTimeline();
        this.connectToLiveStream();
    }

    ngOnDestroy(): void {
        if (this.streamSubscription) {
            this.streamSubscription.unsubscribe();
        }
    }

    loadHistoricalTimeline(): void {
        this.auditService.getTimeline().subscribe({
            next: (events: any) => {
                this.timelineEvents = Array.isArray(events) ? events : (events.body || []);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error cargando historial:', err)
        });
    }

    connectToLiveStream(): void {

        this.streamSubscription = this.auditService.getAuditStream().subscribe({
            next: (newEvent) => {
                this.timelineEvents.unshift(newEvent);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error en el stream SSE:', err)
        });
    }

    loadQueues(): void {
        this.auditService.getAllQueues().subscribe({
            next: (data) => {
                if (data && data.value) {
                    this.activeQueues = Object.values(data.value)
                        .map((q: any) => q.Name)
                        .filter((name: string) => name !== undefined && !name.includes('Advisory'));
                }
                this.cdr.detectChanges()
            },
            error: (err) => console.error('Error cargando colas:', err)
        });
    }

    createQueue(): void {
        if (!this.newQueueName.trim()) return;
        this.auditService.createQueue(this.newQueueName).subscribe({
            next: () => {
                this.newQueueName = '';
                this.loadQueues();
            },
            error: (err) => console.error('Error creando cola:', err)
        });
    }

    deleteQueue(queueName: string): void {
        if (!confirm(`¿Eliminar definitivamente la cola ${queueName}?`)) return;
        this.auditService.deleteQueue(queueName).subscribe({
            next: () => this.loadQueues(),
            error: (err) => console.error('Error eliminando cola:', err)
        });
    }
}
