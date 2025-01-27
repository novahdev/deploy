import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    { path: 'login', loadComponent: () => import('./pages/login-page/login-page.component').then(x => x.LoginPageComponent) },
    {
        path: '',
        loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
        children: [
            { path: 'profile', loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent) },
            { path: 'users', loadComponent: () => import('./pages/users-page/users-page.component').then(m => m.UsersPageComponent) },
        ]
    }
];
