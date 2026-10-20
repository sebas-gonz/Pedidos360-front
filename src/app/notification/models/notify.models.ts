export interface OrderItemKitchenDTO {
    productName: string;
    quantity: number;
}

export interface NotifyKitchenTicketDTO {
    orderUuid: string;
    orderStatus: string;
    items: OrderItemKitchenDTO[];
}

export interface NotifyUserDTO {
    customerEmail: string;
    customerName: string;
    orderStatus: string;
    orderUuid: string;
}
