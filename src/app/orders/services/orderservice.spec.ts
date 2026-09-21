import { TestBed } from '@angular/core/testing';
import { Orderservice } from './order.service';

describe('Orderservice', () => {
    let service: Orderservice;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(Orderservice);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
