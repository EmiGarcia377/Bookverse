import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooksService } from '../../services/books.service';
import { UserService } from '../../services/user.service';
import { uuid } from '../../../models/User';

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
  userId: uuid | null = null;
  selectedGenre: boolean = false;
  genreIndex: number | null = null;
  authorIndex: number | null = null;
  selectedAuthor: boolean = false;
  coverMode: 'file' | 'url' = 'file';
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  coverUrl: string = '';
  activeToggleClass = 'px-3 py-1 rounded-full bg-amber-500 text-black font-semibold -translate-y-1 shadow-xl/30 shadow-zinc-800 hover:text-white';
  inactiveToggleClass = 'px-3 py-1 rounded-full bg-zinc-600 text-white';

  constructor(public booksService: BooksService, private userService: UserService) {
    this.userId = this.userService.getCurrentUserData().userId;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book']) {
      this.editedBook = structuredClone(this.book);
    }
  }

  onFileChange(event: Event) { 
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    this.selectedFile = file;
    reader.readAsDataURL(file);
    if(this.userId){
      this.booksService.uploadCover(file, this.userId, this.book.title).subscribe({
        next: (res) => {
          if(res && res.url){
            alert("Portada actualizada correctamente.");
            this.editedBook.thumbnail_url = res.url;
            this.book.thumbnail_url = res.url;
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  closeConfig(): boolean | void {
    if (this.areObjectsEqual(this.book, this.editedBook)) {
      return false;
    } else {
      const saveChanges = confirm("Deseas cerrar la configuración? Los cambios no guardados se perderán.");
      if (saveChanges) {
        return false;
      } else {
        return true;
      }
    }
  }

  deleteBook(){
    const confirmDelete = confirm("Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer.");
    if(confirmDelete && this.userId){
      this.booksService.deleteBook(this.editedBook.id, this.userId).subscribe({
        next: res => {
          alert("Libro eliminado correctamente.");
          window.location.reload();
        },
        error: err => console.error(err)
      });
    }
  }

  areObjectsEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  saveBookConfig(){
    if(this.editedBook === this.book) return alert("No hay cambios para guardar.");
    this.booksService.updateBook(this.editedBook, this.editedBook.id).subscribe({
      next: res => {
        alert("Cambios guardados correctamente.");
        this.book = this.editedBook;
      },
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
    if(this.editedBook.categories.length === 1){
      alert("Un libro debe tener al menos una categoria.");
      return;
    } else{
      this.editedBook.categories.splice(index, 1);
      this.genresInput = "";
      this.selectedGenre = false;
    }
  }

  deleteAuthor(index: number){
    if(this.editedBook.authors.length === 1){
      alert("Un libro debe tener al menos un autor.");
      return;
    } else{
      this.editedBook.authors.splice(index, 1);
      this.genresInput = "";
      this.selectedGenre = false;
    }
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

  switchType(fileType: 'file' | 'url' = 'file'){
    if(fileType === 'file'){
      this.coverMode = 'file';
      this.coverUrl = '';
    } else if(fileType === 'url'){
      this.previewImage = null;
      this.selectedFile = null;
      this.coverMode = 'url';
    }
  }
}
