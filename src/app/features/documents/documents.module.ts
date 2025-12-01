import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentDetailComponent } from './document-detail.component';
import { DocumentsListComponent } from './documents-list.component';

const routes: Routes = [
  { path: '', component: DocumentsListComponent },
  { path: ':id', component: DocumentDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes), DocumentsListComponent, DocumentDetailComponent]
})
export class DocumentsModule {}
