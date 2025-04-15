import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutomobileService } from '../services/automobile/automobile.service';
import { Automobile } from '../model/automobile.model';
import { saveAs } from 'file-saver';

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

  // download the current UI data in CSV format
  downloadCSVFile(): void {
    const filteredData = this.filterdAutomobiles();
    if (!filteredData.length) return;

    // hard coading to exclude id field
    const fields = [
      'name',
      'mpg',
      'cylinders',
      'displacement',
      'horsepower',
      'weight',
      'acceleration',
      'model_year',
      'origin',
    ];

    // csv header
    const csvRows: string[] = [fields.join(',')];

    // format each row
    for (const automobile of filteredData) {
      const row = fields
        .map((field) => {
          let value = (automobile as any)[field];

          // just incase there are empty fieds
          if (value === undefined || value === null) value = '';
          return value;
        })
        .join(',');
      csvRows.push(row);
    }

    // combining into csv string with line breaks
    const csvContents = csvRows.join('\r\n');

    const blob = new Blob([csvContents], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'Automobile_Data.csv');
  }
}
