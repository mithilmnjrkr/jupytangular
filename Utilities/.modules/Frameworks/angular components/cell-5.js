import {RouterModule, Routes} from '@angular/router';
import {Component, ModuleWithProviders, NgModule} from '@angular/core';
import {COMMON_MODULES} from '../../../imports/core.module';
import {AuthService} from '../../../imports/auth.service';

@Component({
    selector: 'bc-login',
    template: `
        <form>
            <md-input-container>
                <input mdInput name="signupEmail" required type="email"
                       placeholder="Username"
                       maxlength="100" [(ngModel)]="username">
            </md-input-container>
            <br/>
            <md-input-container>
                <input mdInput name="signupPassword" required type="password" maxlength="25"
                       placeholder="Password"
                       length="40" [(ngModel)]="password">
            </md-input-container>
            <button md-raised-button color="primary"
                    id="signupSubmit" type="submit" (click)="onLogin()">
                Login
            </button>
        </form>
    `,
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    username: string;
    password: string;
    service: AuthService

    constructor(public
) {
}

onLogin()
:
void {
    this.service.login(this.username, this.password).subscribe(r => {
    console.log(r);
});
}
}

export const COMPONENTS = [
    LoginComponent
];

export const authRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
        data: {roles: ['anonymous', 'user']}
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(authRoutes);

@NgModule({
    imports: [
        ...COMMON_MODULES,
        routing
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class AuthModule {
}

