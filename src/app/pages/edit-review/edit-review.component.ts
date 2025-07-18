import { Component, ElementRef, OnInit, TemplateRef, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { ReviewsService } from '../../services/reviews.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RoutesService } from '../../services/routes.service';
import User, { uuid } from '../../../models/User';
import Review from '../../../models/Review';

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
  revId: uuid | null = null;
  user: User = { userId: null, username: '', fullName: ''};
  review: Review | undefined = {
    id: this.revId,
    user_id: this.user.userId,
    full_name: '',
    username: '',
    title: '',
    score: 0,
    content: ''
  };

  constructor( 
    private route: ActivatedRoute,
    private dialogService: DialogService, 
    private reviewService: ReviewsService,
    private userService: UserService,
    public routesService: RoutesService
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
    this.revId = this.route.snapshot.paramMap.get('reviewId') as uuid | null;
    this.user = this.userService.getCurrentUserData();

    this.reviewService.getReviewById(this.revId!, this.user.userId).subscribe({
      next: res => {
        this.review = Array.isArray(res.reviews) ? res.reviews.find((r: Review | undefined): r is Review => r !== undefined) || this.review : res.reviews;
        if(this.review){
          this.revTitle.setValue(this.review.title);
          this.revScore.setValue(this.review.score);
          this.revContent.setValue(this.review.content);
          setTimeout(()=> this.ajustarAltura());
        }
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
    if(!this.review) return
    this.reviewService.editReview(this.review.id, this.editForm.value).subscribe({
      next: res => {
        this.message = res.message;
        this.error = '';
        this.routesService.goDashboard();
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
}
