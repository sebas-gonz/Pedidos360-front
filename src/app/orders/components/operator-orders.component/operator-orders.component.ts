import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OrderResponseDTO} from '../../models/order.models';
import {OrderService} from '../../services/order.service';
import {FormsModule} from '@angular/forms';

@Component({
    imports: [FormsModule],
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

    changeStatus(uuid: string, newStatus: string) {
        this.orderService.updateOrderStatus(uuid, newStatus).subscribe({
            next: (updatedOrder) => {
                alert(`Estado actualizado a ${updatedOrder.orderStatus} con éxito`);

                const index = this.allOrders.findIndex(o => o.orderUuid === updatedOrder.orderUuid);
                if (index !== -1) {
                    this.allOrders[index] = updatedOrder;
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error actualizando estado', err);
                alert('Hubo un error al actualizar el estado.');
            }
        });
    }

    getValidNextStates(currentStatus: string): string[] {
        switch (currentStatus) {
            case 'CREATED':
                return ['CREATED', 'ACCEPTED', 'CANCELED'];
            case 'ACCEPTED':
                return ['ACCEPTED', 'PREPARING', 'DISPATCHED', 'CANCELED'];
            case 'PREPARING':
                return ['PREPARING', 'DISPATCHED', 'CANCELED'];
            case 'DISPATCHED':
                return ['DISPATCHED', 'DELIVERED'];
            case 'DELIVERED':
            case 'CANCELED':
                return [currentStatus];
            default:
                return [currentStatus];
        }
    }
    selectedOrder: OrderResponseDTO | null = null;
    openDetails(order: OrderResponseDTO) {
        this.selectedOrder = order;
    }
    closeDetails() {
        this.selectedOrder = null;
    }
}
