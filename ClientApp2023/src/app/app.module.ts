import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextContentTruncatePipe } from './truncate.pipe';
import { GlobalErrorComponent } from './global-error/global-error.component';
import { NotFoundComponentComponent } from './not-found-component/not-found-component.component';
import { GlobalErrorHandlerService } from './core/services/global-error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    GlobalErrorComponent,
    NotFoundComponentComponent,
    // TextContentTruncatePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutingModule,{preloadingStrategy: PreloadAllModules}),
    NgbModule,
  ],
  providers: [
    GlobalErrorHandlerService,
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
