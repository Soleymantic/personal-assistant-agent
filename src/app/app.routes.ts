import { Routes } from '@angular/router';
import { AuthCallbackComponent } from './auth/auth-callback.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { InboxDashboardComponent } from './features/inbox/inbox-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: InboxDashboardComponent
  },
  {
    path: 'inbox',
    canActivate: [AuthGuard],
    component: InboxDashboardComponent
  },
  {
    path: 'health',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/health/health.module').then((m) => m.HealthModule)
  },
  {
    path: 'documents',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/documents/documents.module').then((m) => m.DocumentsModule)
  },
  {
    path: 'tags',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/tags/tags.module').then((m) => m.TagsModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'auth/callback',
    component: AuthCallbackComponent
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
