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

  showAddAutomobileForm = false;
  newAutomobile: Partial<Record<keyof Automobile, any>> = {};

  automobileFields: { key: keyof Automobile; label: string; type: string }[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'mpg', label: 'MPG', type: 'number' },
    { key: 'cylinders', label: 'Cylinders', type: 'number' },
    { key: 'displacement', label: 'Displacement', type: 'number' },
    { key: 'horsepower', label: 'Horsepower', type: 'number' },
    { key: 'weight', label: 'Weight', type: 'number' },
    { key: 'acceleration', label: 'Acceleration', type: 'number' },
    { key: 'model_year', label: 'Model Year', type: 'number' },
    { key: 'origin', label: 'Origin', type: 'text' },
  ];

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

  // hide/show the add form handler
  toggleAddAutomobile(): void {
    this.showAddAutomobileForm = !this.showAddAutomobileForm;
    if (this.showAddAutomobileForm) {
      this.newAutomobile = this.emptyAutomobileForm();
    }
  }

  // reset form
  emptyAutomobileForm(): Automobile {
    return {
      name: '',
      mpg: 0,
      cylinders: 0,
      displacement: 0,
      horsepower: 0,
      weight: 0,
      acceleration: 0,
      model_year: 0,
      origin: '',
    };
  }

  // add new automobile to firestone
  addAutomobile(): void {
    // missing field check
    const missingFields = this.automobileFields.filter(
      (field) => !this.newAutomobile[field.key]?.toString().trim
    );

    if (missingFields.length > 0) {
      alert('Please fill all the required Fields');
      return;
    }

    const automobileToSave: Automobile = {
      name: this.newAutomobile.name ?? '',
      mpg: +this.newAutomobile.mpg,
      cylinders: +this.newAutomobile.cylinders,
      displacement: +this.newAutomobile.displacement,
      horsepower: +this.newAutomobile.horsepower,
      weight: +this.newAutomobile.weight,
      acceleration: +this.newAutomobile.acceleration,
      model_year: +this.newAutomobile.model_year,
      origin: this.newAutomobile.origin ?? '',
    };

    this.automobileService.addAutomobile(automobileToSave).then(() => {
      this.automobiles.push(automobileToSave);
      this.showAddAutomobileForm = false;
      this.emptyAutomobileForm();
    });
  }

  // delete
  async deleteAutomobile(automobileId: string): Promise<void> {
    try {
      const confirmation = confirm('Are you sure, you want to delete?');
      if (!confirmation) return;

      await this.automobileService.deleteAutomobile(automobileId);

      this.automobiles.filter((automobile) => automobile.id !== automobileId);
      alert('Automobile Removed Successfully');
    } catch (error) {
      console.log('Error Deleting Automobile: ', error);
      alert('Error Deleting Automobile');
    }
  }
}
