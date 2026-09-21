export interface CreateProductRequestDTO {
    productName: string;
    description: string;
    price: number;
    stock: number;
    priceCurrency: string;
    tags: string[];
    imagesUrl: string[];
}

export interface UpdateProductRequestDTO {
    price: number;
    stock: number;
}

export interface ProductResponseDTO {
    uuid: string;
    productName: string;
    description: string;
    price: number;
    stock: number;
    priceCurrency: string;
    tags: string[];
    imagesUrl: string[];
    version: number;
}
