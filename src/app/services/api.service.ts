import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MealResponse } from '../models/meal.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  // Usamos una API pública de ejemplo (TheMealDB)
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

  constructor() { }

  getMeals(query: string = 'a'): Observable<MealResponse> {
    return this.http.get<MealResponse>(`${this.apiUrl}${query}`);
  }
}