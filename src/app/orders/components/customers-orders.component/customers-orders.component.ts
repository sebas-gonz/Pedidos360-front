import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ProductResponseDTO} from '../../../catalog/models/product.models';
import {FormsModule} from '@angular/forms';
import {ProductService} from '../../../catalog/services/product';
import {OrderCreatedRequestDTO, OrderResponseDTO} from '../../models/order.models';
import {OrderService} from '../../services/order.service';
import {MsalService} from '@azure/msal-angular';
import {NotifyService} from '../../../notification/services/notification-service';
import {Subscription} from 'rxjs';

interface CartItem {
    product: ProductResponseDTO;
    quantity: number;
}

@Component({
    imports: [FormsModule],
    selector: 'app-customers-orders',
    styleUrl: './customers-orders.component.css',
    templateUrl: './customers-orders.component.html',
    standalone: true,
})
export class CustomersOrdersComponent implements OnInit, OnDestroy {
    myOrders: OrderResponseDTO[] = [];
    userId: string = '';
    userEmail: string = '';
    selectedOrder: OrderResponseDTO | null = null;

    private sub?: Subscription;

    constructor(
        private orderService: OrderService,
        private msalService: MsalService,
        private cdr: ChangeDetectorRef,
        private notifyService: NotifyService
    ) {
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    ngOnInit() {
        this.extractUserInfo();
        if (this.userId) {
            this.loadMyOrders();
        }

        this.sub = this.notifyService.getUserNotificationsStream().subscribe({
            next: (notif) => {
                if (notif.customerEmail && notif.customerEmail.toLowerCase() === this.userEmail.toLowerCase()) {

                    this.loadMyOrders();
                }
            },
            error: (err) => console.error('Error SSE Cliente:', err)
        });
    }

    extractUserInfo() {
        const account = this.msalService.instance.getActiveAccount() || this.msalService.instance.getAllAccounts()[0];
        if (account && account.idTokenClaims) {
            this.userId = account.idTokenClaims['oid'] as string;
            this.userEmail = account.idTokenClaims['preferred_username'] as string ||
                account.idTokenClaims['email'] as string || '';
        }
    }

    loadMyOrders() {
        this.orderService.getOrdersByUser(this.userId).subscribe({
            next: (data) => {
                this.myOrders = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error cargando órdenes', err)
        });
    }

    openDetails(order: OrderResponseDTO) {
        this.selectedOrder = order;
    }

    closeDetails() {
        this.selectedOrder = null;
    }
}
