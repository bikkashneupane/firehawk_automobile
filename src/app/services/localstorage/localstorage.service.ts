import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private storageKey = 'automobileFilters';

  saveFilters(filters: Filters): void {
    localStorage.setItem(this.storageKey, JSON.stringify(filters));
  }

  getFilters(): Filters | null {
    const savedFilters = localStorage.getItem(this.storageKey);
    return savedFilters ? JSON.parse(savedFilters) : null;
  }

  clearFilters(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export interface Filters {
  searchTerm: string;
  sortField: string;
  sortOrder: string;
}
