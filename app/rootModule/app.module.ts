import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MaterializeDirective} from "angular2-materialize";

import { AppComponent } from './components/app.component';
import { UtilsService } from './../services/utils';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent, MaterializeDirective ],
  providers: [UtilsService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
