import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-pins-list',
  templateUrl: './pins-list.component.html',
  styleUrls: ['./pins-list.component.css']
})
export class PinsListComponent implements OnInit,OnDestroy{

  pinsData: Array<any> = [];

  pinsSubscription:any;
  currentModal:String = '';
  loader: boolean = false;

  public parent = this;

  constructor(public mainService: MainService,
    private indexedDBService: NgxIndexedDBService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService){
    
  }

  ngOnInit(){
    this.fetchPins();
  }

  // clearDatabase() {
  //   this.indexedDBService.clear('pins').subscribe({
  //     next:(res:any) => {
      
  //     },
  //     error:(err:any) =>{
  //       this.toastr.error('Error fetching pins');
  //     }
  //   });
  // }

  // Fetch Pins using IndexedDB
  fetchPins() {
    this.pinsSubscription = this.indexedDBService.getAll('pins').subscribe({
      next:(res:any) => {
        this.pinsData = res;
        this.toastr.success('Pins fetched successfully');
      },
      error:(err:any) =>{
        this.toastr.error('Error fetching pins');
      }
    });
  }

  // Customers String Concat
  getCustomers(customers:any){
    return customers.join(', ');
  }

  ngOnDestroy(){
    this.pinsSubscription.unsubscribe();
  }

}
