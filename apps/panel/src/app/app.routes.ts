import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    { path: 'login', loadComponent: () => import('./pages/login-page/login-page.component').then(x => x.LoginPageComponent) },
    {
        path: '',
        loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    }
];
