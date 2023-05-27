import { Sprint } from '../models/sprint.model';
export class Product {
    productId: number;
    productName: string;
    sprints: Sprint[] = [];

    constructor() {
    }
}
