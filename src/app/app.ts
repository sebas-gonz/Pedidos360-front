import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MsalService} from '@azure/msal-angular';
import {environment} from '../environments/environment';
import {AdminProducts} from './catalog/components/admin-products/admin-products';
import {CustomersOrdersComponent} from './orders/components/customers-orders.component/customers-orders.component';
import {OperatorOrdersComponent} from './orders/components/operator-orders.component/operator-orders.component';
import {AdminDashboardComponent} from './dashboard/components/admin-dashboard.component/admin-dashboard.component';
import {CustomerCatalogComponent} from './catalog/components/customer-catalog.component/customer-catalog.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, AdminProducts, CustomersOrdersComponent, OperatorOrdersComponent, AdminDashboardComponent, CustomerCatalogComponent],
    templateUrl: './app.html',
})
export class App implements OnInit {
    currentView: String = 'dashboard';
    constructor(
        private msalService: MsalService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.msalService.instance.handleRedirectPromise().then(() => {
            const accounts = this.msalService.instance.getAllAccounts();
            if (accounts.length > 0) {
                this.msalService.instance.setActiveAccount(accounts[0]);
            }
            this.cdr.detectChanges();
        }).catch(err => console.error(err));
    }
    navigateTo(view: string) {
        this.currentView = view;
    }

    checkIfLoggedIn(): boolean {
        return this.msalService.instance.getAllAccounts().length > 0;
    }

    getUserName(): string {
        const accounts = this.msalService.instance.getAllAccounts();
        return accounts.length > 0 ? accounts[0].name || 'Usuario' : '';
    }

    getRoleName(): string {
        if (this.isAdmin()) return 'Admin';
        if (this.isOperator()) return 'Operador';
        return 'Cliente';
    }
    private getRoles(): string[] {
        const account = this.msalService.instance.getActiveAccount() || this.msalService.instance.getAllAccounts()[0];
        if (account && account.idTokenClaims && account.idTokenClaims['roles']) {
            return account.idTokenClaims['roles'] as string[];
        }
        return [];
    }

    isAdmin(): boolean {
        const account = this.msalService.instance.getActiveAccount() || this.msalService.instance.getAllAccounts()[0];
        if (account && account.idTokenClaims && account.idTokenClaims['roles']) {
            const roles = account.idTokenClaims['roles'] as string[];
            return roles.includes('Admin');
        }
        return false;
    }

    isOperator(): boolean {
        const account = this.msalService.instance.getActiveAccount() || this.msalService.instance.getAllAccounts()[0];
        if (account && account.idTokenClaims && account.idTokenClaims['roles']) {
            const roles = account.idTokenClaims['roles'] as string[];
            return roles.includes('Operator') || roles.includes('Operador');
        }
        return false;
    }

    login() {
        this.msalService.loginRedirect({
            scopes: environment.apiConfig.scopes
        });
    }

    logout() {
        this.msalService.logoutRedirect({
            postLogoutRedirectUri: 'http://localhost:4200'
        });
    }
}
