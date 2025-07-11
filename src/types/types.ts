export interface IOrder {
    id: string;
    createdAt: string;
    status: string;
    total: string;
    orderItems: {
        id: string;
        name: string;
        quantity: number;
        price: string;
    }[];
}