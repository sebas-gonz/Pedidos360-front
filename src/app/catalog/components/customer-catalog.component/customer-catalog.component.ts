import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OrderCreatedRequestDTO} from '../../../orders/models/order.models';
import {ProductResponseDTO} from '../../models/product.models';
import {ProductService} from '../../services/product';
import {OrderService} from '../../../orders/services/order.service';

interface CartItem {
    product: ProductResponseDTO;
    quantity: number;
}

@Component({
    imports: [],
    selector: 'app-customer-catalog',
    styleUrl: './customer-catalog.component.css',
    templateUrl: './customer-catalog.component.html',
    standalone: true,
})
export class CustomerCatalogComponent implements OnInit {
    availableProducts: ProductResponseDTO[] = [];
    cart: CartItem[] = [];

    constructor(
        private productService: ProductService,
        private orderService: OrderService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.loadCatalog();
    }

    loadCatalog() {
        this.productService.getAllProducts().subscribe({
            next: (data) => {
                this.availableProducts = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error cargando catálogo', err)
        });
    }

    addToCart(product: ProductResponseDTO) {
        const existingItem = this.cart.find(item => item.product.uuid === product.uuid);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ product, quantity: 1 });
        }
    }

    removeFromCart(productUuid: string) {
        this.cart = this.cart.filter(item => item.product.uuid !== productUuid);
    }

    getCartTotal(): number {
        return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    submitOrder() {
        const payload: OrderCreatedRequestDTO = {
            priceCurrency: 'CLP',
            orderItems: this.cart.map(item => ({
                productUuid: item.product.uuid,
                quantity: item.quantity
            }))
        };

        this.orderService.createOrder(payload).subscribe({
            next: () => {
                alert('Orden procesada con éxito. Puedes verla en la pestaña de Pedidos.');
                this.cart = [];
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al crear orden', err);
                alert('Hubo un error al procesar tu orden.');
            }
        });
    }

}
