import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import Papa from 'papaparse';
import { Automobile } from '../../model/automobile.model';
@Injectable({
  providedIn: 'root',
})
export class CsvimportService {
  constructor(private httpClient: HttpClient, private firestore: Firestore) {}

  // method to parse csv file (assets/automobile.csv) to json format
  csvImport(): void {
    this.httpClient
      .get('/Automobile.csv', { responseType: 'text' })
      .subscribe((data) => {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: async (result) => {
            console.log(result);

            const rawAutomobiles = result.data as any[];

            const automobiles: Automobile[] = rawAutomobiles.map((row) => {
              return {
                name: row.name || '',
                mpg: +row.mpg || 0,
                cylinders: +row.cylinders || 0,
                displacement: +row.displacement || 0,
                horsepower: +row.horsepower || 0,
                weight: +row.weight || 0,
                acceleration: +row.acceleration || 0,
                model_year: +row.model_year || 0,
                origin: row.origin || '',
              };
            });

            // Reference to the 'automobile' collection in Firestore
            const automobileCollections = collection(
              this.firestore,
              'automobile'
            );

            for (const automobile of automobiles) {
              try {
                await addDoc(automobileCollections, automobile);
              } catch (error) {
                console.log('Error adding doc to firestore db: ', error);
              }
            }

            console.log('CSV import complete....');
          },
        });
      });
  }
}
