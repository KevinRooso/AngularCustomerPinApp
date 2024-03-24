import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  // A Global variable for api endpoints
  apiUrl:String = 'https://api.first.org/data/v1/';

  //Current Modal Tracking
  currentModal: BehaviorSubject<String> = new BehaviorSubject<String>('');

  constructor(private http: HttpClient) { }

  public fetchRegions(): Observable<any>{
    return this.http.get(this.apiUrl + 'countries');
  }

  public getModalValue(){
    return this.currentModal.asObservable();
  }

  public toggleModal(modalName:any) {
    this.currentModal.next(modalName);
  }
}
