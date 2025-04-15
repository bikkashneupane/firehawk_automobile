import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CsvimportService } from './services/csvimport/csvimport.service';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { AutomobileComponent } from './automobile/automobile.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AutomobileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'firehawk_automobile';

  constructor(
    private csvImportService: CsvimportService,
    private firestore: Firestore
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('AppComponent ngOnInit called...');

    const automobileCollectionRef = collection(this.firestore, 'automobile');
    const snapshot = await getDocs(automobileCollectionRef);
    console.log('Fetched docs. Size:', snapshot.size);

    if (snapshot.empty) {
      console.log('Firestore empty, importing csv....');
      this.csvImportService.csvImport();
    } else {
      console.log('Dataset ready...');
    }
  }
}
