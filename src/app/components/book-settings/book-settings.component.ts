import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { uuid } from '../../../models/User';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-book-settings',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './book-settings.component.html',
  styles: ``
})
export class BookSettingsComponent implements OnChanges {
  @Input() book: any = {};
  editedBook: any = {};

  genresInput: string = "";
  authorsInput: string = "";
  selectedGenre: boolean = false;
  genreIndex: number | null = null;
  authorIndex: number | null = null;
  selectedAuthor: boolean = false;

  constructor(private booksService: BooksService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book']) {
      this.editedBook = structuredClone(this.book);
    }
  }

  onFileSelected(event: any){

  }

  closeConfig(): boolean | void{
    const saveChanges = confirm("Deseas cerrar la configuracion? Los cambios no guardados se perderan.");
    if(saveChanges){
      return false;
    } else {
      return true;
    }
  }

  saveBookConfig(){
    this.booksService.updateBook(this.editedBook, this.editedBook.id).subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    });
  }

  selectGenre(genre: string, index: number){
    this.genresInput = genre;
    this.selectedGenre = true;
    this.genreIndex = index;
  }

  selectAuthor(author: string, index: number){
    this.authorsInput = author;
    this.selectedAuthor = true;
    this.authorIndex = index;
  }

  deleteGenre(index: number){
    this.editedBook.categories.splice(index, 1);
    this.genresInput = "";
    this.selectedGenre = false;
  }

  deleteAuthor(index: number){
    this.editedBook.authors.splice(index, 1);
    this.genresInput = "";
    this.selectedGenre = false;
  }

  addNewGenre(){
    this.genresInput = "";
    this.selectedGenre = false;
  }

  addNewAuthor(){
    this.authorsInput = "";
    this.selectedAuthor = false;
  }

  submitGenre(){
    if(this.selectedGenre && this.genresInput.trim() !== "" && !this.editedBook.categories.includes(this.genresInput)){
      this.editedBook.categories.splice(this.genreIndex, 1,  this.genresInput.trim());
      this.genresInput = "";
      this.selectedGenre = false;
    } else if(!this.selectedGenre && this.genresInput.trim() !== "" && !this.editedBook.categories.includes(this.genresInput)){
      this.editedBook.categories.push(this.genresInput.trim());
      this.genresInput = "";
    }
  }

  submitAuthor(){
    if(this.selectedAuthor && this.authorsInput.trim() !== "" && !this.editedBook.authors.includes(this.authorsInput)){
      this.editedBook.authors.splice(this.authorIndex, 1,  this.authorsInput.trim());
      this.authorsInput = "";
      this.selectedAuthor = false;
    } else if(!this.selectedAuthor && this.authorsInput.trim() !== "" && !this.editedBook.authors.includes(this.authorsInput)){
      this.editedBook.authors.push(this.authorsInput.trim());
      this.authorsInput = "";
    }
  }
}
