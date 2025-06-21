import { Component, ElementRef, TemplateRef, viewChild, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-review',
  imports: [ RouterLink, ReactiveFormsModule ],
  templateUrl: './create-review.component.html',
  styles: ``
})
export class CreateReviewComponent {

  revForm: FormGroup;
  revTitle: FormControl;
  revScore: FormControl;
  revContent: FormControl;
  error: string = '';
  message: string = '';

  constructor(private dialogService: DialogService) {
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
    console.log(this.revForm);
  }
  goDashboard(){

  }
}
