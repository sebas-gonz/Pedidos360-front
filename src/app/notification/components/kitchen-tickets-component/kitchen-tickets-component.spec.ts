import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KitchenTicketsComponent } from './kitchen-tickets-component';

describe('KitchenTicketsComponent', () => {
    let component: KitchenTicketsComponent;
    let fixture: ComponentFixture<KitchenTicketsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KitchenTicketsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(KitchenTicketsComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
