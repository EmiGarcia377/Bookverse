import { Component, ElementRef, OnInit, TemplateRef, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { ReviewsService } from '../../services/reviews.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-review',
  imports: [ ReactiveFormsModule ],
  templateUrl: './edit-review.component.html',
  styles: ``
})
export class EditReviewComponent implements OnInit{
  editForm: FormGroup;
  revTitle: FormControl;
  revScore: FormControl;
  revContent: FormControl;

  error: string = '';
  message: string = '';
  revId: string | null = '';
  userId: string | null = '';
  review: any = {
    id: this.revId,
    title: '',
    score: 0,
    content: ''
  };

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private dialogService: DialogService, 
    private reviewService: ReviewsService,
    private userService: UserService
  ) {
    this.revTitle = new FormControl('', [Validators.required, Validators.min(5)]);
    this.revScore = new FormControl('', Validators.required);
    this.revContent = new FormControl('', [Validators.required, Validators.min(30)]);

    this.editForm = new FormGroup({
      newTitle: this.revTitle,
      newScore: this.revScore,
      newContent: this.revContent
    });
  }

  ngOnInit(): void {
    this.revId = this.route.snapshot.paramMap.get('reviewId');
    this.userId = this.userService.getCurrentUserData();

    this.reviewService.getReviewById(this.revId!, this.userId).subscribe({
      next: res => {
        this.review = res.review;
        this.revTitle.setValue(this.review.title);
        this.revScore.setValue(this.review.score);
        this.revContent.setValue(this.review.content);
        setTimeout(()=> this.ajustarAltura());
      },
      error: err => {
        console.log(err);
      }
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

  submitRev(){
    this.reviewService.editReview(this.review.id, this.editForm.value).subscribe({
      next: res => {
        this.message = res.message;
        this.error = '';
        this.router.navigate(['../dashboard']);
      },
      error: err => {
        this.error = err.error.message;
        this.message = '';
        console.log(err);
      }
    })
  }

  confirmCancel(){
    this.dialogService.openDialog(this.dialogTemplate()!, this.dialogViewContainerRef()!);
  }

  goDashboard(){
    this.router.navigate(['../dashboard/']);
  }
}
