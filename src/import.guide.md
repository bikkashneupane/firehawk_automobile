# Automobile Dataset Import Guide

This guide explains how I initially imported automobile dataset (from [Kaggle](https://www.kaggle.com/datasets/tawfikelmetwally/automobile-dataset)) into Firestore using Angular 19 and PapaParse. The import is done **entirely on the frontend** without a Node.js backend.

---

## Dataset Setup

1. Download the original dataset from Kaggle.
2. Rename the file to `Automobile.csv` if required (currently it is with same name).
3. Place it inside the Angular project's `src/assets/` folder.

---

## File Structure

```
src/
├── assets/
│   └── Automobile.csv
├── app/
│   └── services/
│       └── csvimport/
│           └── csvimport.service.ts
│   └── app.component.ts
```

---

## How the Import Works

### CsvimportService (CSV Parsing & Firestore Upload)

This service:

- Loads the CSV file using Angular's `HttpClient`
- Parses it with PapaParse
- Maps rows to the `Automobile` model
- Uploads entries to Firestore

#### `csvimport.service.ts`

```ts
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { addDoc, collection, Firestore } from "@angular/fire/firestore";
import Papa from "papaparse";
import { Automobile } from "../../model/automobile.model";

@Injectable({ providedIn: "root" })
export class CsvimportService {
  constructor(private httpClient: HttpClient, private firestore: Firestore) {}

  csvImport(): void {
    this.httpClient.get("/Automobile.csv", { responseType: "text" }).subscribe((data) => {
      Papa.parse(data, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          const rawAutomobiles = result.data as any[];

          const automobiles: Automobile[] = rawAutomobiles.map((row) => ({
            name: row.name || "",
            mpg: +row.mpg || 0,
            cylinders: +row.cylinders || 0,
            displacement: +row.displacement || 0,
            horsepower: +row.horsepower || 0,
            weight: +row.weight || 0,
            acceleration: +row.acceleration || 0,
            model_year: +row.model_year || 0,
            origin: row.origin || "",
          }));

          const automobileCollections = collection(this.firestore, "automobile");

          for (const automobile of automobiles) {
            try {
              await addDoc(automobileCollections, automobile);
            } catch (error) {
              console.error("Error adding document to Firestore:", error);
            }
          }

          console.log("CSV import complete.");
        },
      });
    });
  }
}
```

---

### AppComponent (Trigger Import Once)

The import is automatically triggered only when Firestore is initially empty.

#### `app.component.ts`

```ts
import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CsvimportService } from "./services/csvimport/csvimport.service";
import { collection, Firestore, getDocs } from "@angular/fire/firestore";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "firehawk_automobile";

  constructor(private csvImportService: CsvimportService, private firestore: Firestore) {}

  async ngOnInit(): Promise<void> {
    const automobileCollectionRef = collection(this.firestore, "automobile");
    const snapshot = await getDocs(automobileCollectionRef);

    if (snapshot.empty) {
      console.log("Firestore is empty — importing CSV...");
      this.csvImportService.csvImport();
    } else {
      console.log("Firestore dataset is ready.");
    }
  }
}
```

---

## Testing the Import

1. Run the Angular app with `ng serve`.
2. Open the browser console.
3. If Firestore is empty, you’ll see:

   ```
   Firestore is empty — importing CSV...
   CSV import complete.
   ```

4. Open Firebase → Firestore → `automobile` collection to verify the data.

---

## Notes

- The import runs only once per session if Firestore is empty.
- No backend is needed.

---
