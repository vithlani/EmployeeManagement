import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../employee.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: string;
  isEditMode: boolean = false;

  // Gender options
  genders = [
    { value: 'Male', display: 'Male' },
    { value: 'Female', display: 'Female' },
    { value: 'Other', display: 'Other' }
  ];

  constructor(private fb: FormBuilder, private employeeService : EmployeeService, private route: ActivatedRoute, private router : Router) {
   
  }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      id :[],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(128)]],
      email: ['', [Validators.required, Validators.email]],
      employeeID: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{10}$')]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$') ]], // Valid Indian mobile number
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(60)]],
      anotherPhoneNumber: [''] // Optional
    });
    // Get the employee ID from the route
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('id') || ''; // Assume route parameter is 'id'
      if (this.employeeId) {
        this.isEditMode = true;
        this.getEmployeeById(this.employeeId);
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.getRawValue(); // getRawValue to include disabled fields
      if (this.isEditMode) {
        this.employeeService.updateEmployee(employeeData).subscribe({
          next: (response) => {
            console.log('Employee updated successfully', response);
            this.router.navigate(['/employee-list'])
          },
          error: (error) => {
            console.error('Error updating employee', error);
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: (response) => {
            console.log('Employee created successfully', response);
            this.router.navigate(['/employee-list'])
          },
          error: (error) => {
            console.error('Error creating employee', error);
          }
      })
    }

    
  }
     else {
      this.employeeForm.markAllAsTouched();
    }
  }

  getAgeOptions(): number[] {
    return Array.from({ length: 43 }, (_, i) => i + 18);
  }

  getEmployeeById(id: string): void {
    this.employeeService.getEmployee(id).subscribe({
      next: (employee: Employee) => {
        this.employeeForm.patchValue(employee);
      },
      error: (error) => {
        console.error('Error fetching employee data', error);
      }
    });
  }
}
