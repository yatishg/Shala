import { Component } from '@angular/core';

import { UtilsService } from './../../services/utils';

@Component({
  selector: 'my-app',
  templateUrl: './dist/app/rootModule/templates/nav.html',
})
export class AppComponent  {
  name: String;

  constructor(private service: UtilsService) { };

  ngOnInit() {
    this.name = this.service.getAngular();
  }
}