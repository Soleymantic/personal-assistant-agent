import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxDashboardComponent } from './features/inbox/inbox-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: InboxDashboardComponent
  },
  {
    path: 'inbox',
    component: InboxDashboardComponent
  },
  {
    path: 'health',
    loadChildren: () => import('./features/health/health.module').then((m) => m.HealthModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./features/documents/documents.module').then((m) => m.DocumentsModule)
  },
  {
    path: 'tags',
    loadChildren: () => import('./features/tags/tags.module').then((m) => m.TagsModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
