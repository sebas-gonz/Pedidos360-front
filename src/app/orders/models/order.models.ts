export interface OrderCreatedRequestDTO {
    priceCurrency: string;
    orderItems: OrderListRequestDTO[];
}

export interface OrderListRequestDTO {
    productUuid: string;
    quantity: number;
}

export interface OrderResponseDTO {
    orderUuid: string;
    customerId: string;
    totalOrderAmount: number;
    orderStatus: string;
    priceCurrency: string;
    version: number;
    orderItems: OrderItemResponseDTO[];
}

export interface OrderItemResponseDTO {
    orderItemUuid: string;
    quantity: number;
    totalOrderItemAmount: number;
    product: ProductItemResponseDTO;
}

export interface ProductItemResponseDTO {
    productUuid: string;
    version: number;
    price: number;
    productName: string;
    imagesUrl: string[];
}
