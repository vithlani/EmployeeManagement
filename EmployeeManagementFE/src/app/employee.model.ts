// src/app/employee.model.ts
export interface Employee {
    id: number;
    name: string;
    email: string;
    employeeID: string;
    mobileNumber: string;
    gender: 'Male' | 'Female' | 'Other';
    age: number;
    anotherPhoneNumber?: string;
  }
  