// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from '../app/employee/employee-list/employee-list.component';
import { EmployeeFormComponent } from '../app/employee/employee-form/employee-form.component';

const routes: Routes = [
  { path: 'employee-list', component: EmployeeListComponent },
  { path: 'employee-form', component: EmployeeFormComponent },
  { path: 'employee-form/:id', component: EmployeeFormComponent }, // For editing
  { path: '', redirectTo: '/employee-list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
