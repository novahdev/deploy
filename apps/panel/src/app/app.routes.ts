import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    { path: 'login', loadComponent: () => import('./pages/login-page/login-page.component').then(x => x.LoginPageComponent) },
    {
        path: '',
        loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
        children: [
            { path: 'profile', loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent) },
            { path: 'users', loadComponent: () => import('./pages/users-page/users-page.component').then(m => m.UsersPageComponent) },
            { path: 'projects', loadComponent: () => import('./pages/projects-page/projects-page.component').then(m => m.ProjectsPageComponent) },
            { path: 'projects/new', loadComponent: () => import('./pages/project-new-page/project-new-page.component').then(m => m.ProjectNewPageComponent) },
            { path: 'projects/:projectId', loadComponent: () => import('./pages/project-page/project-page.component').then(m => m.ProjectPageComponent) },
        ]
    }
];
