import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleBooksService } from '../../services/google-books.service';
import { debounceTime, filter, of, switchMap } from 'rxjs';
import { BooksService } from '../../services/books.service';
import User from '../../../models/User';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-book-modal',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-book-modal.component.html',
  styles: ``
})
export class AddBookModalComponent implements OnInit{
  @Output() closeModal = new EventEmitter<void>();
  @Output() addBook = new EventEmitter<any>();

  searchControl = new FormControl('', [Validators.minLength(1), Validators.required]);

  libraryForm: FormGroup;
  libraryTitle: FormControl;
  libraryDesc: FormControl;

  bookForm: FormGroup;
  coverMode: 'file' | 'url' = 'file';
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  activeToggleClass = 'px-3 py-1 rounded-full bg-amber-500 text-black font-semibold -translate-y-1 shadow-xl/30 shadow-zinc-800 hover:text-white';
  inactiveToggleClass = 'px-3 py-1 rounded-full bg-zinc-600 text-white';

  searchResults: any[] = [];
  selectedLibrary: string = '';
  customSelectedLibrary: string = '';
  query: string | null = '';
  user: User = { userId: null, fullName: null, username: null };
  createCustomBook: boolean = false;
  userLibraries: any[] = [];
  startIndex = 0;
  loading = false;
  isOpen = false;

  constructor(
    private googleBooksService: GoogleBooksService,
    private booksService: BooksService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.libraryTitle = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.libraryDesc = new FormControl('');
    this.libraryForm = new FormGroup({
      name: this.libraryTitle,
      description: this.libraryDesc
    });

    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      authors: ['', [Validators.required, Validators.minLength(3)]],
      coverUrl: ['', Validators.pattern(/https?:\/\/.+\.(jpg|jpeg|png|webp|gif|bmp)/i)],
      description: [''],
      categories: ['', [Validators.required, Validators.minLength(3)]],
      pages: [0, Validators.required],
      customSelectedLibrary: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.user = this.userService.getCurrentUserData();
    if(this.user.userId){
      this.booksService.getUserLibraries(this.user.userId).subscribe({
        next: res => this.userLibraries = res.libraries,
        error: err => console.log(err)
      });
    }
    this.searchControl.valueChanges.pipe(
      filter((query): query is string => !!query), 
      debounceTime(300),
      switchMap(query => {
        this.query = query;
        this.startIndex = 0;
        this.searchResults = [];
        if (!query.trim()) return of([]);
        return this.googleBooksService.searchBooks(query, this.startIndex);
      })
    ).subscribe(data => {
      this.searchResults = this.filterBooks(data);
      this.startIndex += 10;
    });
  }

  private filterBooks(data: any[]): any[] {
    return data.filter(book =>
      book.volumeInfo &&
      book.volumeInfo.title &&
      book.volumeInfo.imageLinks?.smallThumbnail
    );
  }

  fc(name: string) { return this.bookForm.get(name)!; }

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

    this.bookForm.get('coverUrl')?.setValue('');
  }

  async onBookSubmit(){
    if(!this.user.userId) return
    if(this.bookForm.invalid) return alert("Formulario invalido, revisa los campos");
    else if(this.coverMode === 'url' && !this.bookForm.get('coverUrl')?.value) return alert("Debes ingresar una URL para la portada");
    const book = {
      ...this.bookForm.value
    }
    book.authors = book.authors.split(',').map((author: string) => author.trim());
    book.categories = book.categories.split(',').map((category: string) => category.trim());
    if(this.coverMode === 'url') {
      this.booksService.createCustomBook(this.user.userId, book).subscribe({
        next: res => {
          alert(res.message);
          this.addBook.emit(res.book);
          this.close();
        },
        error: err => console.log(err)
      });
    } else if(this.coverMode === "file") {
      if(!this.selectedFile) return alert("Debes seleccionar un archivo para la portada")
      console.log(this.selectedFile);
      this.booksService.createCustomBook(this.user.userId, book, this.selectedFile).subscribe({
        next: res => {
          alert(res.message);
          this.addBook.emit(res.book);
          this.close();
        },
        error: err => console.log(err)
      });
    } 
  }
  onScroll(event: Event) {
    const container = event.target as HTMLElement;
    const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
    if (atBottom && !this.loading && this.query) {
      this.loadMore();
    }
  }

  switchType(fileType: 'file' | 'url' = 'file'){
    if(fileType === 'file'){
      this.coverMode = 'file';
      this.bookForm.get('coverUrl')?.setValue('');
    } else if(fileType === 'url'){
      this.previewImage = null;
      this.selectedFile = null;
      this.selectedFileName = null;
      this.coverMode = 'url';
    }
  }

  loadMore() {
    this.loading = true;
    if(this.query){
      this.googleBooksService.searchBooks(this.query, this.startIndex).subscribe(data => {
        const filteredBooks = this.filterBooks(data);
        this.searchResults.push(...filteredBooks);
        this.startIndex += 10;
      });
    }
  }

  addBookDb(book: any){
    if(!this.user.userId) return;
    if(this.selectedLibrary == '') return alert("Necesitas seleccionar o crear una libreria para agregar el libro");
    this.booksService.addBookTodb(this.user.userId, book, this.selectedLibrary).subscribe({
      next: res => {
        alert(res.message);
        this.addBook.emit(res.book);
        this.close();
      },
      error: err => console.log(err)
    });
  }

  createLibrary(){
    if(!this.user.userId) return
    this.booksService.createLibrary(this.user.userId, this.libraryForm.value).subscribe({
      next: res => {
        this.userLibraries.push(this.libraryForm.value);
        console.log(res);
        alert(res.message);
        this.selectedLibrary = '';
        this.libraryForm.reset();
      },
      error: err => {
        console.log(err);
        alert(err.error.nameErr);
      }
    });
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.createCustomBook = false
    this.closeModal.emit();
    this.searchControl.reset();
    this.libraryForm.reset();
    this.selectedLibrary = '';
    this.searchResults = [];
  }
}
