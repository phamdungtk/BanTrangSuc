import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/common/base-component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.loadScripts('assets/dist/js/demo.js','assets/dist/js/adminlte.min.js' );
  }
}