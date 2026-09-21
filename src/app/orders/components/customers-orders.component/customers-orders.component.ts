import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductResponseDTO} from '../../../catalog/models/product.models';
import {FormsModule} from '@angular/forms';
import {ProductService} from '../../../catalog/services/product';
import {OrderCreatedRequestDTO, OrderResponseDTO} from '../../models/order.models';
import {OrderService} from '../../services/order.service';
import {MsalService} from '@azure/msal-angular';

interface CartItem{
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
export class CustomersOrdersComponent implements OnInit {
    myOrders: OrderResponseDTO[] = [];
    userId: string = '';
    selectedOrder: OrderResponseDTO | null = null;

    constructor(
        private orderService: OrderService,
        private msalService: MsalService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.extractUserId();
        if (this.userId) {
            this.loadMyOrders();
        }
    }

    extractUserId() {
        const account = this.msalService.instance.getActiveAccount() || this.msalService.instance.getAllAccounts()[0];
        if (account && account.idTokenClaims) {
            this.userId = account.idTokenClaims['oid'] as string;
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
