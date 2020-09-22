import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { CONSTANTS } from '../utils/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('myButton', {static: true}) myButton: ElementRef;
  @ViewChild('closeEditModal', {static: true}) closeEditModal: ElementRef;


  empDetail: FormGroup;
  empAdd: FormGroup;
  details: any = {};
  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  mobile: FormControl;
  city: FormControl;
  dob: FormControl;
  address: FormControl;
  id: FormControl;
  updatedEmp = {};
  tempId: any;

  empList: any = [];

  constructor(
    private formsBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService) { }


  ngOnInit() {
    this.createFormControls();
    this.createEmpForm();
    this.getEmployees(localStorage.getItem('id'));
  }
  getEmployees(id) {
    this.httpClient.get(CONSTANTS.SERVER_URL + `/employee/manager/` + id,
    {
      headers: new HttpHeaders()
        .append(
          'Authorization', `Bearer ${localStorage.getItem('accessToken')}`)
    }).subscribe(res => {
      console.log(res);
      this.empList = res;
    });
  }
  createFormControls() {
    this.firstName = new FormControl('', [
      Validators.required
    ]);
    this.lastName = new FormControl('', [
      Validators.required
    ]);
    this.address = new FormControl('', [
      Validators.required
    ]);
    this.dob = new FormControl('', [
      Validators.required
    ]);
    this.mobile = new FormControl('', [
      Validators.required
    ]);
    this.city = new FormControl('', [
      Validators.required
    ]);
    this.id = new FormControl([
      Validators.required
    ]);
  }

  createEmpForm() {
    this.empDetail = this.formsBuilder.group({
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      dob: this.dob,
      mobile: this.mobile,
      city: this.city
    });
  }

  editEmp(emp) {
    const obj = {
      firstName: emp.firstName,
      lastName: emp.lastName,
      address: emp.address,
      dob: emp.dob,
      mobile: emp.mobile,
      city: emp.city,
      id: emp.id
    };
    this.tempId = emp.id;
    this.empDetail.setValue(obj);
  }
  addEmp() {
    console.log(this.empDetail.value);
    this.myButton.nativeElement.click();
    this.httpClient.post(CONSTANTS.SERVER_URL + `/employee/` + localStorage.getItem('username'), this.empDetail.value,
      {
        headers: new HttpHeaders()
          .append(
            'Authorization', `Bearer ${localStorage.getItem('accessToken')}`)
      }).subscribe((res: any ) => {
      if (res.Status === true) {
      alert(res.responseMessage);
       }
      this.getEmployees(localStorage.getItem('id'));
      });
  }

  addition(a , b) {
    return a + b;
  }
  updateEmp() {

    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to update ?')
    .then((confirmed) => {
      console.log('User confirmed:', confirmed);
      const obj = {
      firstName: this.empDetail.value.firstName,
      lastName: this.empDetail.value.lastName,
      address: this.empDetail.value.address,
      dob: this.empDetail.value.dob,
      mobile: this.empDetail.value.mobile,
      city: this.empDetail.value.city,
      id: this.tempId
    };
      this.closeEditModal.nativeElement.click();
      this.httpClient.post(CONSTANTS.SERVER_URL + `/employee/update`, obj,
      {
        headers: new HttpHeaders()
          .append(
            'Authorization', `Bearer ${localStorage.getItem('accessToken')}`)
      }).subscribe((res: any ) => {
        alert(res.responseMessage);
        this.getEmployees(localStorage.getItem('id'));
      }); })
    .catch(() => console.log('User dismissed the dialog' +
    +' (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    console.log(this.empDetail.value);


  }

  deleteEmployee(emp) {

    this.confirmationDialogService.confirm('Are u sure', 'You want to delete... ?')
    .then((confirmed) => {
      if (confirmed) {
             const filterList = this.empList.filter(item => {
      return emp.mobile !== item.mobile;
    });
             console.log(filterList);
             this.empList = filterList;

             this.httpClient.get(CONSTANTS.SERVER_URL + '/employee/delete/' + emp.id,
    {
      headers: new HttpHeaders()
        .append(
          'Authorization', `Bearer ${localStorage.getItem('accessToken')}`)
    }).subscribe((res: any ) => {
      alert(res.responseMessage);
      this.getEmployees(localStorage.getItem('id'));
    });
      }
  })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

}

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);

  }

}
