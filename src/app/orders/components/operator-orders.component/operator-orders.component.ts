import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {OrderResponseDTO} from '../../models/order.models';
import {OrderService} from '../../services/order.service';
import {FormsModule} from '@angular/forms';
import {
    KitchenTicketsComponent
} from '../../../notification/components/kitchen-tickets-component/kitchen-tickets-component';

@Component({
    imports: [FormsModule, KitchenTicketsComponent],
    selector: 'app-operator-orders',
    styleUrl: './operator-orders.component.css',
    templateUrl: './operator-orders.component.html',
})
export class OperatorOrdersComponent implements OnInit {
    allOrders: OrderResponseDTO[] = [];
    selectedFilter: string = 'ALL';
    constructor(
        private orderService: OrderService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.loadAllOrders();
    }

    loadAllOrders() {
        this.orderService.getAllOrders().subscribe({
            next: (data) => {
                this.allOrders = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error cargando las ordenes', err)
        });
    }
    onFilterChange() {
        if (this.selectedFilter === 'ALL') {
            this.loadAllOrders();
        } else {
            this.orderService.getOrdersByStatus(this.selectedFilter).subscribe({
                next: (data) => {
                    this.allOrders = data;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Error filtrando ordenes', err);
                    this.allOrders = [];
                    this.cdr.detectChanges();
                }
            });
        }
    }

    advanceStatus(uuid: string) {
        this.orderService.updateOrderStatus(uuid).subscribe({
            next: (updatedOrder) => {
                alert(`Estado avanzado a ${updatedOrder.orderStatus} con éxito`);
                const index = this.allOrders.findIndex(o => o.orderUuid === updatedOrder.orderUuid);
                if (index !== -1) {
                    this.allOrders[index] = updatedOrder;
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error avanzando estado', err);
                alert('Hubo un error al avanzar el estado.');
            }
        });
    }

    selectedOrder: OrderResponseDTO | null = null;
    openDetails(order: OrderResponseDTO) {
        this.selectedOrder = order;
    }
    closeDetails() {
        this.selectedOrder = null;
    }
}
