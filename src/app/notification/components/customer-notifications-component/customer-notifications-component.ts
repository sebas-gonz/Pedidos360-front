import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NotifyService} from '../../services/notification-service';
import {NotifyUserDTO} from '../../models/notify.models';
import {Subscription} from 'rxjs';
import {SlicePipe} from '@angular/common';
import {MsalService} from '@azure/msal-angular';

@Component({
    imports: [
        SlicePipe
    ],
    selector: 'app-customer-notifications',
    styleUrl: './customer-notifications-component.css',
    templateUrl: './customer-notifications-component.html',
})
export class CustomerNotificationsComponent implements OnInit, OnDestroy {
    notifications: NotifyUserDTO[] = [];
    private sub?: Subscription;

    userEmail: string = '';

    constructor(private notifyService: NotifyService,
                private msalService: MsalService,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.extractUserEmail();
        this.sub = this.notifyService.getUserNotificationsStream().subscribe({
            next: (notif) => {
                if (notif.customerEmail && this.userEmail && notif.customerEmail.toLowerCase() === this.userEmail.toLowerCase()) {
                    this.notifications = [...this.notifications, notif];
                    this.cdr.detectChanges();
                    setTimeout(() => {
                        this.closeNotification(notif.orderUuid);
                        this.cdr.detectChanges();
                    }, 5000);
                }
            },
            error: (err) => console.error('Error SSE Cliente:', err)
        });
    }

    extractUserEmail() {
        const account = this.msalService.instance.getActiveAccount() || this.msalService.instance.getAllAccounts()[0];
        if (account && account.idTokenClaims) {
            this.userEmail = (account.idTokenClaims['preferred_username'] as string) ||
                (account.idTokenClaims['email'] as string) || '';
        }
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe();
    }

    closeNotification(uuid: string) {
        this.notifications = this.notifications.filter(n => n.orderUuid !== uuid);
    }
}
