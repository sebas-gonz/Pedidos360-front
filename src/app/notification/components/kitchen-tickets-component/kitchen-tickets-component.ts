import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NotifyKitchenTicketDTO} from '../../models/notify.models';
import {Subscription} from 'rxjs';
import {NotifyService} from '../../services/notification-service';
import {SlicePipe} from '@angular/common';

@Component({
    imports: [
        SlicePipe
    ],
    selector: 'app-kitchen-tickets',
    styleUrl: './kitchen-tickets-component.css',
    templateUrl: './kitchen-tickets-component.html',
})
export class KitchenTicketsComponent implements OnInit, OnDestroy{
    tickets: NotifyKitchenTicketDTO[] = [];
    private sub?: Subscription;

    constructor(private notifyService: NotifyService,
                private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.sub = this.notifyService.getKitchenTicketsStream().subscribe({
            next: (ticket) => {
                this.tickets.unshift(ticket);
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error SSE Cocina Component:', err)
        });
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe();
    }

    removeTicket(uuid: string) {
        this.tickets = this.tickets.filter(t => t.orderUuid !== uuid);
    }
}
