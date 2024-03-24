import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-pins-list',
  templateUrl: './pins-list.component.html',
  styleUrls: ['./pins-list.component.css']
})
export class PinsListComponent implements OnInit,OnDestroy{

  pinsData: Array<any> = [];

  modalSubscription:any;
  currentModal:String = '';

  constructor(public mainService: MainService){
    this.modalSubscription = this.mainService.getModalValue().subscribe(value => {
      if(value == ''){
        this.ngOnInit();
        this.currentModal = value;
      }
    });
  }

  ngOnInit(){
    this.fetchPinsList();
  }

  fetchPinsList(){
    if(localStorage.getItem('pinList')){
      this.pinsData = JSON.parse(localStorage.getItem('pinList') || '');
      console.log(this.pinsData);
      
    }else{
      this.pinsData = [];
    }    
  }

  getCustomers(customers:any){
    return customers.join(', ');
  }

  ngOnDestroy(){
    this.modalSubscription.unsubscribe();
  }

}
