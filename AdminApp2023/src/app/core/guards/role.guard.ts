import { AuthenticationService } from './../authentication/authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot) {
        const auth = this.authenticationService.userValue;
        if (route.data['roles'] && route.data['roles'].indexOf(auth.loaiQuyen) === -1) {
            this.router.navigate(['/unauthorized']);
            return false;
        }     
        return true;
    }
}
