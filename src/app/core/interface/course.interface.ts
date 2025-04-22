import { Subcourse } from "./Subcourse.interface";

export interface Course {
    id?: number;
    name: string;
    startDate: Date;
    endDate: Date;
    subcourses?: Subcourse[];
  }