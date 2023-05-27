import { Component, OnInit } from '@angular/core';
import { Globals } from '../config/globals';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.css']
})
export class ProductDashboardComponent {
  sprintId: number;
  constructor(public globals: Globals) {
  }


}
