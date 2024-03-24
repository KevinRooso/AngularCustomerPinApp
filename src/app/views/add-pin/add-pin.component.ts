import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../../main.service';
import { customValidators } from '../../shared/validators';
declare var $: any;
import {  FileUploader } from 'ng2-file-upload';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ToastrService } from 'ngx-toastr';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-add-pin',
  templateUrl: './add-pin.component.html',
  styleUrls: ['./add-pin.component.css']
})
export class AddPinComponent implements OnInit,OnDestroy{

  // Parent Component
  @Input() parent:any;
  
  // Form Items
  title:String = '';
  email:String = '';  
  privacy: String = '';
  customerData: Array<any> = [];
  selectedCustomers: Array<any> = [];
  // File Upload 
  public uploader:FileUploader;
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;
  response:string;

  // Custom Validator
  public customValidators = customValidators;

  // Modal and Form
  @ViewChild('pModal') pModal: any;
  @ViewChild('pinForm') pinForm: any;
  imageUrl: string | ArrayBuffer | null = null;
  modalSubscription: any;
  currentModal:any = '';

  constructor(private mainService: MainService,
    private indexedDBService: NgxIndexedDBService,
    private toastr: ToastrService){
    this.uploader = new FileUploader({
      url: '',
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item:any) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
 
    this.response = '';
 
    this.uploader.response.subscribe( res => this.response = res );

    this.modalSubscription = this.mainService.getModalValue().subscribe(value => {
      if(value == 'pin'){
        this.ngOnInit();
        this.currentModal = value;
      }
    });
  }

  ngOnInit(){  
    this.fetchCustomerData(); 
  }

  ngDoCheck() {
    // Check if the uploader array has changed
    if (this.uploader.queue.length !== 0) {
      // Invoke preview
      this.previewImage();
    }
  }
  

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
    if(this.uploader.queue.length > 1){
      let fileObj = this.uploader.queue[this.uploader.queue.length - 1];
      this.uploader.queue = [];
      this.uploader.queue.push(fileObj);      
    }
  }

  // Fetch Region Data Using Subscribption to Observable from Service
  fetchCustomerData(){
    if(localStorage.getItem('customerList')){
      this.customerData = JSON.parse(localStorage.getItem('customerList') || '');
    }else{
      this.customerData = [];
    }    
  }

  previewImage(): void {
    if(this.uploader.queue.length > 0){
      const file:any = this.uploader.queue[0].file;
      const reader = new FileReader();
      reader.readAsDataURL(file.rawFile);
  
      reader.onload = () => {
        this.imageUrl = reader.result;
      };

      reader.onloadend = () => {
        const base64String = reader.result?.toString();
        file.base64 = base64String;
      }
    }
  }

  savePinData(){
    const request = {
      customers: this.selectedCustomers,
      imageFileObj: this.uploader.queue[0].file,
      title: this.title,
      privacy: this.privacy
    };

    this.indexedDBService.add('pins',request).subscribe({
      next:(res:any) => {
        this.toastr.success('Pin added successfully');
        this.parent.fetchPins();
        this.resetData();
      },
      error:(error:any) =>{
        this.toastr.error('Error saving pin');      }
    });    
    
  }

  resetData(){
    this.selectedCustomers = [];
    this.title = '';
    this.email = '';
    this.uploader.queue = [];
    this.imageUrl = null;

    const formControls = this.pinForm.form.controls;
    Object.keys(formControls).forEach(key => {
      formControls[key].markAsUntouched();
      formControls[key].markAsPristine();
    });
    // Used Jquery to Handle Modal events / Could also use NgbBootstrap to handle this
    $(this.pModal.nativeElement).modal('hide');
    this.mainService.toggleModal('');
  }

  ngOnDestroy(): void {
    this.resetData();
    this.modalSubscription.unsubscribe();
  }
}
