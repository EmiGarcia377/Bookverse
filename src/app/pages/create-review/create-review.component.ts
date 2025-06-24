import { Component, ElementRef, OnInit, TemplateRef, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';
import { Router, RouterLink } from '@angular/router';
import { ReviewsService } from '../../services/reviews.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-review',
  imports: [ReactiveFormsModule],
  templateUrl: './create-review.component.html',
  styles: ``
})
export class CreateReviewComponent implements OnInit{
  revForm: FormGroup;
  revTitle: FormControl;
  revScore: FormControl;
  revContent: FormControl;
  error: string = '';
  message: string = '';
  userId: string = '';

  constructor(private dialogService: DialogService, private reviewsService: ReviewsService, private router: Router, private userService: UserService) {
    this.revTitle = new FormControl('', [Validators.required, Validators.min(5)]);
    this.revScore = new FormControl('', Validators.required);
    this.revContent = new FormControl('', [Validators.required, Validators.min(30)]);

    this.revForm = new FormGroup({
      title: this.revTitle,
      score: this.revScore,
      content: this.revContent
    })
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: res => this.userId = res.userId,
      error: err => this.error = err.message
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
        this.router.navigate(['../dashboard/', res.userId]);
      },
      error: err =>{
        this.error = err.error.message;
        this.message = '';
      }
    })
  }
  goDashboard(){
    this.router.navigate(['../dashboard/', this.userId]);
  }
}
