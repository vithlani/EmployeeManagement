// src/app/employee-list/employee-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../employee.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  totalRecords: number = 0;
  sort: string = '';
  search : string = '';
  sortedEmployees: any[] = [];
  pageSize: number = 5;
  currentPage: number = 1;
  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees(this.currentPage, this.pageSize, this.sort, this.search)
      .subscribe(response => {
        this.employees = response.employees;
        this.totalRecords = response.totalRecords; 
      });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }

  sortBy(value : string){
    this.sort = value;
  }

  onSearch(){
    this.currentPage = 0;
    this.pageSize = 0;
    this.loadEmployees();
  }

  clearSearch() {
    if(this.search != ''){
      this.search = ''; 
      this.currentPage = 1;
      this.pageSize = 10;
      this.loadEmployees(); 
    }
  }

  nextPage() {
    this.currentPage++;
  }

  prevPage() {
    this.currentPage--;
  }
}
