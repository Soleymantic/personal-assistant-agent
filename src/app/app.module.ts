import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DetailPanelComponent } from './components/detail-panel/detail-panel.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { InboxColumnComponent } from './components/inbox-column/inbox-column.component';
import { StatusFilterComponent } from './components/status-filter/status-filter.component';
import { InboxDashboardComponent } from './features/inbox/inbox-dashboard.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    AppComponent,
    FilterBarComponent,
    StatusFilterComponent,
    InboxColumnComponent,
    DetailPanelComponent,
    InboxDashboardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
