import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from '@Course/core/interface/course.interface';
import { Subcourse } from '@Course/core/interface/Subcourse.interface';
import { CourseService } from '@Course/core/service/course.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-course-dialog',
  imports: [Dialog,TableModule,CardModule,ButtonModule,InputTextModule,ReactiveFormsModule,DatePickerModule,FormsModule,NgClass],
  templateUrl: './course-dialog.component.html',
  styleUrl: './course-dialog.component.scss'
})
export class CourseDialogComponent {
  #fb = inject(FormBuilder);
  visible = model<boolean>(false);
  #courseService = inject(CourseService);

  activeParentCourseId = computed(() => this.#courseService.activeParentCourseId());

  editParentObject = computed(() => this.#courseService.editParentObject());

  editSubcourse = computed(() => this.#courseService.editSubcourse());

  activeParentCourse = computed(() => this.#courseService.activeParentCourse());

  close = output<boolean>()

  form: FormGroup<{
    name: FormControl<string>;
    startDate: FormControl<Date | null>;
    endDate: FormControl<Date | null>;
  }> = this.#fb.group({
    name: this.#fb.nonNullable.control<string>('',[Validators.required]),
    startDate: this.#fb.control<Date | null>(null,[Validators.required]),
    endDate: this.#fb.control<Date | null>(null,[Validators.required]),
  });
  
  nameControl = computed(() => this.form.get('name'));
  startDateControl = computed(() => this.form.get('startDate'));
  endDateControl = computed(() => this.form.get('endDate'));

constructor(){
  effect(()=>{
    if(this.editParentObject() || this.editSubcourse()){
      this.form.patchValue({
        name: this.editParentObject()?.name || this.editSubcourse()?.name,
        startDate: this.editParentObject()?.startDate || this.editSubcourse()?.startDate,
        endDate: this.editParentObject()?.endDate || this.editSubcourse()?.endDate,
      })
    }
   
  })
}

  closeDialog() {
    this.visible.set(false);
  }


  onHide(){
    this.form.reset();
    this.visible.set(false);
    this.close.emit(false);
    this.#courseService.clear()
  }

  get request():Course{
    let object
    if(this.activeParentCourseId()){
      object = {
        courseId: this.activeParentCourseId(),
      }
    }
    if(!this.editParentObject() && !this.editSubcourse()){
      object = {
        ...object,
        id: Math.floor(Math.random() * 1000000),
      }
    }else{
      object = {
        ...object,
        id: this.editSubcourse()?.id || this.editParentObject()?.id,

      }
    }

    return {
      name: this.form.get('name')?.value!,
      startDate: this.form.get('startDate')?.value!,
      endDate: this.form.get('endDate')?.value!,
      ...object
    }
  }

  onSubmit(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }
    if(this.activeParentCourseId()){
      this.#courseService.addSubcourse(this.request as Subcourse);
      this.onHide();
      this.#courseService.clearActiveParentCourseId();
      return
    }
    if(this.editParentObject()){
      this.#courseService.onEditParentObject(this.request);
      this.onHide();
      this.#courseService.clearEditParentObject();
      return
    }
    if(this.editSubcourse()){
      this.#courseService.onEditSubcourse(this.request as Subcourse);
      this.onHide();
      this.#courseService.clearEditSubcourse();
      return
    }
    this.#courseService.addCourse(this.request);
    this.onHide();
  }

}
