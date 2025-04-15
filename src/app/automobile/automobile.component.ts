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
  searchTerm = '';
  sortField = 'name';
  sortOrder = 'asc';

  constructor(private automobileService: AutomobileService) {}

  // Initial Component Load
  ngOnInit(): void {
    this.loadFiltersFromLocalStorage();
    this.automobileService.getAutomobiles().subscribe((data) => {
      this.automobiles = data;
    });
  }

  // Filter automobiles based on search field, sort field and sort order
  filterdAutomobiles(): Automobile[] {
    let filtered = this.automobiles.filter((automobile) =>
      automobile?.name
        .toLowerCase()
        .includes(this.searchTerm.trim().toLowerCase())
    );

    return filtered.sort((a, b) => {
      const valA = (a as any)[this.sortField];
      const valB = (b as any)[this.sortField];

      if (this.sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }

  // save filters at local storage
  saveFiltersToLocalStorage(): void {
    const filters = {
      searchTerm: this.searchTerm || '',
      sortField: this.sortField || 'name',
      sortOrder: this.sortOrder || 'asc',
    };

    localStorage.setItem('automobileFilters', JSON.stringify(filters));
  }

  // load filters from local storage
  loadFiltersFromLocalStorage(): void {
    const savedFilters = localStorage.getItem('automobileFilters');

    if (savedFilters) {
      const filters = JSON.parse(savedFilters);

      this.searchTerm = filters.searchTerm || '';
      this.sortField = filters.sortField || 'name';
      this.sortOrder = filters.sortOrder || 'asc';
    }
  }

  // filter change handler
  onFilterChange(): void {
    this.saveFiltersToLocalStorage();
  }
}
