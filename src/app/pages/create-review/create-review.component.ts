import { Component, ElementRef, TemplateRef, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';
import { Router } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';

@Component({
  selector: 'app-create-review',
  imports: [ReactiveFormsModule],
  templateUrl: './create-review.component.html',
  styles: ``
})
export class CreateReviewComponent{
  revForm: FormGroup;
  revTitle: FormControl;
  revScore: FormControl;
  revContent: FormControl;

  error: string = '';
  message: string = '';

  constructor(
    private dialogService: DialogService, 
    private reviewsService: ReviewsService, 
    private router: Router
  ) 
  {
    this.revTitle = new FormControl('', [Validators.required, Validators.min(5)]);
    this.revScore = new FormControl('', Validators.required);
    this.revContent = new FormControl('', [Validators.required, Validators.min(30)]);

    this.revForm = new FormGroup({
      title: this.revTitle,
      score: this.revScore,
      content: this.revContent
    })
  }

  dialogTemplate = viewChild(TemplateRef);
  dialogViewContainerRef = viewChild('template', {read: ViewContainerRef});
  @ViewChild('autoTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

  ajustarAltura(){
    const el = this.textarea.nativeElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }
  confirmCancel(){
    this.dialogService.openDialog(this.dialogTemplate()!, this.dialogViewContainerRef()!);
  }
  submitRev(){
    this.reviewsService.createReview(this.revForm.value).subscribe({
      next: res =>{
        this.message = res.message;
        this.error = '';
        this.router.navigate(['../dashboard']);
      },
      error: err =>{
        this.error = err.error.message;
        this.message = '';
      }
    })
  }
  goDashboard(){
    this.router.navigate(['../dashboard/']);
  }
}
