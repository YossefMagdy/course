import { Component, computed, effect, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { CourseService } from '@Course/core/service/course.service';
import { DatePipe } from '@angular/common';
import { Course } from '@Course/core/interface/course.interface';
import { Subcourse } from '@Course/core/interface/Subcourse.interface';

@Component({
  selector: 'app-course-table',
  imports: [
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CourseDialogComponent,
    DatePipe,
  ],
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.scss',
})
export class CourseTableComponent {
  expandedRows: { [key: string]: boolean } = {};

  showCourseDialog = signal<boolean>(false);

  #CourseService = inject(CourseService);

  availableCourses = computed(() => this.#CourseService.availableCourses());

  onShowCoursDialog(course?: Course) {
    this.showCourseDialog.set(true);
    if (course) {
      this.#CourseService.setActiveParentCourseId(course.id!);
      this.#CourseService.setActiveParentCourse(course);
    }
  }
  toggleRow(course: any) {
    this.expandedRows[course.id] = !this.expandedRows[course.id];
  }

  onDialogHide() {
    this.showCourseDialog.set(false);
  }
  onEditCourse(course: Course) {
    this.#CourseService.setEditParentObject(course);
    this.showCourseDialog.set(true);
  }
  onEditSubCourse(subcourse: Subcourse) {
    this.#CourseService.setEditSubcourse(subcourse);
    const parentCourse = this.availableCourses().find(
      (course) => course.id === subcourse.courseId
    );
    this.#CourseService.setActiveParentCourse(parentCourse!);
    this.showCourseDialog.set(true);
  }

  onDeleteCourse(course: Course) {
    this.#CourseService.deleteCourse(course.id!);
  }
  onDeleteSubcourse(subcourse: Subcourse) {
    this.#CourseService.deleteSubcourse(subcourse.id);
  }
}
