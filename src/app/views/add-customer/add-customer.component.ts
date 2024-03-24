import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../main.service';
import { customValidators } from '../../shared/validators';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit, OnDestroy {

  title:String = '';
  email:String = '';
  masterData: any = {};
  regionData: Array<any> = [];
  selectedRegion: String = '';
  countryData: Array<any> = [];
  selectedCountry: String = '';

  regionSubscription: any;
  modalSubscription: any;

  public customValidators = customValidators;

  @ViewChild('custModal') custModal: any;
  @ViewChild('custForm') custForm: any;
  currentModal: String = '';

  constructor(private mainService: MainService,
    private toastr: ToastrService){
    this.modalSubscription = this.mainService.getModalValue().subscribe(value => {
      if(value == 'customer'){
        this.ngOnInit();
        this.currentModal = value;
      }
    });
  }

  ngOnInit(){  
    this.fetchRegionData(); 
  }

  // Fetch Region Data Using Subscribption to Observable from Service
  fetchRegionData(){
    this.regionSubscription = this.mainService.fetchRegions().subscribe({
      next: (res:any) =>{
        this.masterData = res.data;
        // Filtering the Object into a unique array of Regions
        const regions = Object.keys(this.masterData).reduce((uniqueRegions:any, key:any) =>{
          const region = this.masterData[key].region;
          if(!uniqueRegions.includes(region)){
            uniqueRegions.push(region);
          }
          return uniqueRegions;
        },[]); 

        this.regionData = regions;
      },
      error: (err:any) => {
        console.log(err);
      },
      complete: () => {}
  });
  }

  onSelectRegion(event:any){
    // Filtering the Countries for specific Region
    this.countryData = Object.keys(this.masterData)
    .filter(key => this.masterData[key].region == event)
    .map(key => this.masterData[key].country);
  }

  saveCustomerData(){
    const request = {
      region: this.selectedRegion,
      country: this.selectedCountry,
      id: this.title,
      text: this.title,
      email: this.email
    };

    let customerList:any = [];
    if(localStorage.getItem('customerList')){
      customerList = JSON.parse(localStorage.getItem('customerList') || '');
    }
    customerList.push(request);

    localStorage.setItem('customerList',JSON.stringify(customerList));
    this.toastr.success('Customer added successfully');

    this.resetData();
    
  }

  resetData(){
    this.selectedRegion = '';
    this.countryData = [];
    this.selectedCountry = '';
    this.title = '';
    this.email = '';

    // Validators reset
    const formControls = this.custForm.form.controls;
  Object.keys(formControls).forEach(key => {
    formControls[key].markAsUntouched();
    formControls[key].markAsPristine();
  });

    // Used Jquery to Handle Modal events / Could also use NgbBootstrap to handle this
    $(this.custModal.nativeElement).modal('hide');
    this.mainService.toggleModal('');
  }

  ngOnDestroy(){
    // Unsubscribe on Destroy
    this.regionSubscription.unsubscribe();
    this.modalSubscription.unsubscribe();
  }
}
