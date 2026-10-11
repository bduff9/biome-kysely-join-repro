export interface TravelEntry {
  id: string;
  technicianId: string;
  assignedToId: string | null;
  bookedById: string | null;
  projectId: string | null;
  systemId: number | null;
}

export interface Employee {
  id: string;
  userId: string;
}

export interface User {
  id: string;
  firstName: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface System {
  id: number;
  name: string;
}

export interface DB {
  Employee: Employee;
  Project: Project;
  System: System;
  TravelEntry: TravelEntry;
  User: User;
}
