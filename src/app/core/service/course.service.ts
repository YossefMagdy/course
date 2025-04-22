import { computed, Injectable, signal } from '@angular/core';
import { Course } from '../interface/course.interface';
import { Subcourse } from '../interface/Subcourse.interface';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  #availableCourses = signal<Course[]>([
    {
      id: 1000,
      name: 'Angular',
      startDate: new Date('2025-04-08'),
      endDate: new Date('2025-04-30'),
      subcourses: [
        {
          id: 12,
          name: 'ngrx',
          startDate: new Date('2025-04-08'),
          endDate: new Date('2025-04-30'),
          courseId: 1000,
        },
      ],
    },
  ]);

  availableCourses = computed(() => this.#availableCourses());

  #activeParentCourse = signal<Course | null>(null);
  activeParentCourse = computed(() => this.#activeParentCourse());

  #activeParentCourseId = signal<number | null>(null);
  activeParentCourseId = computed(() => this.#activeParentCourseId());

  #editParentObject = signal<Course | null>(null);
  editParentObject = computed(() => this.#editParentObject());

  #editSubcourse = signal<Subcourse | null>(null);
  editSubcourse = computed(() => this.#editSubcourse());

  constructor() {
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      const courses = JSON.parse(storedCourses);
      
      const parsedCourses = courses.map((course: Course) => ({
        ...course,
        startDate: new Date(course.startDate), 
        endDate: new Date(course.endDate),    
        subcourses: course.subcourses?.map((subcourse: Subcourse) => ({
          ...subcourse,
          startDate: new Date(subcourse.startDate), 
          endDate: new Date(subcourse.endDate),     
        })),
      }));
  
      this.#availableCourses.set(parsedCourses);
    }
  }

  setEditParentObject(course: Course | null) {
    this.#editParentObject.set(course);
  }

  onEditParentObject(courseObject: Course) {
    this.#availableCourses.update((courses) => {
      return courses.map((course) => {
        if (course.id === course.id) {
          return {
            ...courseObject,
            subcourses: [...(course.subcourses || [])],
          };
        }
        return course;
      });
    });
    this.clearEditParentObject();
    this.saveToLocalStorage();
  }
  clearEditParentObject() {
    this.#editParentObject.set(null);
  }
  
  setEditSubcourse(subcourse: Subcourse | null) {
    this.#editSubcourse.set(subcourse);
  }
  onEditSubcourse(subcourseObject: Subcourse) {
    this.#availableCourses.update((courses) =>
      courses.map((course) => {
        const index = course.subcourses?.findIndex(
          (sc) => sc.id === subcourseObject.id
        );
        if (index !== undefined && index !== -1) {
          const updatedSubcourses = [...(course.subcourses || [])];
          updatedSubcourses[index] = subcourseObject;
          return { ...course, subcourses: updatedSubcourses };
        }
        return course;
      })
    );
    this.clearEditSubcourse();
    this.saveToLocalStorage();
  }

  setActiveParentCourse(course: Course | null) {
    this.#activeParentCourse.set(course);
  }

  clearEditSubcourse() {
    this.#editSubcourse.set(null);
  }

  setActiveParentCourseId(id: number | null) {
    this.#activeParentCourseId.set(id);
  }

  clearActiveParentCourseId() {
    this.#activeParentCourseId.set(null);
  }

  deleteCourse(id: number) {
    const courseIndex = this.#availableCourses().findIndex(
      (course) => course.id === id
    );
    if (courseIndex !== -1) {
      this.#availableCourses().splice(courseIndex, 1);
    }
    this.saveToLocalStorage();
  }

  addSubcourse(subcourse: Subcourse) {
    this.#availableCourses.update((courses) => {
      return courses.map((course) => {
        if (course.id === subcourse.courseId) {
          return {
            ...course,
            subcourses: [...(course.subcourses || []), subcourse],
          };
        }
        return course;
      });
    });
    this.clearActiveParentCourseId();
    this.saveToLocalStorage();
  }
  deleteSubcourse(subcourseId: number) {
    this.#availableCourses.update((courses) => {
      return courses.map((course) => {
        if (course.subcourses) {
          const subcourseIndex = course.subcourses.findIndex(
            (subcourse) => subcourse.id === subcourseId
          );
          if (subcourseIndex !== -1) {
            return {
              ...course,
              subcourses: [
                ...course.subcourses.slice(0, subcourseIndex),
                ...course.subcourses.slice(subcourseIndex + 1),
              ],
            };
          }
        }
        return course;
      });
    });
    this.saveToLocalStorage();
  }
  addCourse(course: Course) {
    this.#availableCourses.update((courses) => [...courses, course]);
    this.saveToLocalStorage();
  }
  saveToLocalStorage() {
    localStorage.setItem('courses', JSON.stringify(this.#availableCourses()));
  }

  clear() {
    this.#activeParentCourseId.set(null);
    this.#editParentObject.set(null);
    this.#editSubcourse.set(null);
    this.#activeParentCourse.set(null);
  }
}
