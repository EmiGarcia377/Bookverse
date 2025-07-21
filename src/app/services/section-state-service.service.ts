import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionStateServiceService {
  private sectionSubject = new BehaviorSubject<string>("home");
  section$ = this.sectionSubject.asObservable();

  setSection(section: string) {
    this.sectionSubject.next(section);
  }

  getSection() {
    return this.sectionSubject.value;
  }
}
