import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'Courses',
        pathMatch: 'full'
    },
    {
        path:'Courses',
        loadComponent: () => import('./components/course-table/course-table.component').then(m => m.CourseTableComponent)
    }
];
