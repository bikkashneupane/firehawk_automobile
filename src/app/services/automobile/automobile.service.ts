import { Injectable } from '@angular/core';
import {
  collectionData,
  collection,
  Firestore,
  addDoc,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Automobile } from '../../model/automobile.model';

@Injectable({
  providedIn: 'root',
})
export class AutomobileService {
  constructor(private firestore: Firestore) {}

  // all documents from the 'automobile' collection in Firestore
  getAutomobiles(): Observable<Automobile[]> {
    const automobileCollection = collection(this.firestore, 'automobile');
    return collectionData(automobileCollection, {
      idField: 'id',
    }) as Observable<Automobile[]>;
  }

  // new document to the 'automobile'
  async addAutomobile(automobile: Automobile): Promise<void> {
    const automobileRef = collection(this.firestore, 'automobile');
    await addDoc(automobileRef, automobile);
  }

  // delete
  async deleteAutomobile(automobileId: string): Promise<void> {
    const automobileRef = doc(this.firestore, 'automobile', automobileId);
    await deleteDoc(automobileRef);
  }
}
