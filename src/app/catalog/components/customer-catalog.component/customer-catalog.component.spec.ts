import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerCatalogComponent } from './customer-catalog.component';

describe('CustomerCatalogComponent', () => {
    let component: CustomerCatalogComponent;
    let fixture: ComponentFixture<CustomerCatalogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomerCatalogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomerCatalogComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
