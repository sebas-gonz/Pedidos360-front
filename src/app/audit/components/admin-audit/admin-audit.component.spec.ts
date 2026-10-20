import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminAuditComponent } from './admin-audit.component';

describe('AdminAuditComponent', () => {
    let component: AdminAuditComponent;
    let fixture: ComponentFixture<AdminAuditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminAuditComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminAuditComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
