import {Injectable, Service} from '@angular/core';
import {CreateProductRequestDTO, ProductResponseDTO, UpdateProductRequestDTO} from '../models/product.models';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root' // <-- Esto le dice a Angular que el servicio es global
})
export class ProductService {
    private apiUrl = `${environment.apiConfig.uri}/catalog`;

    constructor(private http: HttpClient) {
    }

    getAllProducts(): Observable<ProductResponseDTO[]> {
        return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}`);
    }

    getProduct(uuid: string): Observable<ProductResponseDTO> {
        return this.http.get<ProductResponseDTO>(`${this.apiUrl}/products/${uuid}`);
    }

    createProduct(product: CreateProductRequestDTO): Observable<ProductResponseDTO> {
        return this.http.post<ProductResponseDTO>(`${this.apiUrl}`, product);
    }

    updateProduct(uuid: string, productUpdate: UpdateProductRequestDTO): Observable<ProductResponseDTO> {
        return this.http.put<ProductResponseDTO>(`${this.apiUrl}/products/${uuid}`, productUpdate);
    }
}
