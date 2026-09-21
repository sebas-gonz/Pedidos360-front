import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ProductService} from '../../services/product';
import {CreateProductRequestDTO, ProductResponseDTO, UpdateProductRequestDTO} from '../../models/product.models';

@Component({
    imports: [FormsModule],
    selector: 'app-admin-products',
    styleUrl: './admin-products.css',
    templateUrl: './admin-products.html',
    standalone: true,
})
export class AdminProducts {
    products: ProductResponseDTO[] = [];

    newProduct: CreateProductRequestDTO = {
        productName: '',
        description: '',
        price: 0,
        stock: 0,
        priceCurrency: 'CLP',
        tags: ['Tech'],
        imagesUrl: []
    };
    editingProduct: ProductResponseDTO | null = null;
    updatePayload: UpdateProductRequestDTO = { price: 0, stock: 0 };
    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.productService.getAllProducts().subscribe({
            next: (data) => this.products = data,
            error: (err) => console.error('Error cargando productos', err)
        });
    }

    onCreateSubmit() {
        this.productService.createProduct(this.newProduct).subscribe({
            next: (createdProduct) => {
                alert('¡Producto creado con éxito!');
                this.products.push(createdProduct);
                this.resetCreateForm();
            },
            error: (err) => {
                console.error('Error al crear el producto', err);
                alert('Error al crear producto. Revisa la consola.');
            }
        });
    }

    resetCreateForm() {
        this.newProduct = { productName: '', description: '', price: 0, stock: 0, priceCurrency: 'CLP', tags: ['Tech'], imagesUrl: [] };
    }

    startEdit(product: ProductResponseDTO) {
        this.editingProduct = product;
        this.updatePayload = {
            price: product.price,
            stock: product.stock
        };
    }

    cancelEdit() {
        this.editingProduct = null;
        this.updatePayload = { price: 0, stock: 0 };
    }

    onUpdateSubmit() {
        if (!this.editingProduct) return;

        this.productService.updateProduct(this.editingProduct.uuid, this.updatePayload).subscribe({
            next: (updatedProduct) => {
                alert('¡Producto actualizado con éxito!');
                const index = this.products.findIndex(p => p.uuid === updatedProduct.uuid);
                if (index !== -1) {
                    this.products[index] = updatedProduct;
                }

                this.cancelEdit();
            },
            error: (err) => {
                console.error('Error al actualizar', err);
                alert('Error al actualizar. Revisa la consola.');
            }
        });
    }
}
