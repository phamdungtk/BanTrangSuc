import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextContentTruncatePipe } from './truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    // TextContentTruncatePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutingModule,{preloadingStrategy: PreloadAllModules}),
    NgbModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
