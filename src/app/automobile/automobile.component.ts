import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutomobileService } from '../services/automobile/automobile.service';
import { Automobile } from '../model/automobile.model';

@Component({
  selector: 'app-automobile',
  imports: [CommonModule, FormsModule],
  templateUrl: './automobile.component.html',
  styleUrl: './automobile.component.scss',
})
export class AutomobileComponent implements OnInit {
  automobiles: Automobile[] = [];

  constructor(private automobileService: AutomobileService) {}

  ngOnInit(): void {
    this.automobileService.getAutomobiles().subscribe((data) => {
      this.automobiles = data;
    });
  }
}
