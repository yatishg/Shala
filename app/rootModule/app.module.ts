import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './components/app.component';
import { UtilsService } from './../services/utils';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  providers: [UtilsService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
