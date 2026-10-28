import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonSearchbar, IonList, IonItem, IonThumbnail, 
  IonLabel, IonInfiniteScroll, IonInfiniteScrollContent,
  IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { ApiService } from '../../services/api.service';
import { Meal } from '../../models/meal.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonSearchbar, IonList, IonItem, IonThumbnail,
    IonLabel, IonInfiniteScroll, IonInfiniteScrollContent,
    IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent
  ]
})
export class HomePage implements OnInit {
  private apiService = inject(ApiService);

  meals: Meal[] = [];          // Arreglo acumulado que se muestra en pantalla
  allMeals: Meal[] = [];       // Control de datos totales traídos de la API
  displayLimit: number = 5;    // Cuántos elementos cargamos por página de scroll
  isLoading: boolean = false;
  hasMore: boolean = true;
  searchTerm: string = '';

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData(query: string = 'a') {
    this.isLoading = true;
    this.apiService.getMeals(query).subscribe({
      next: (response) => {
        if (response.meals) {
          this.allMeals = response.meals;
          // Mostramos solo los primeros elementos (simulando paginación incremental)
          this.meals = this.allMeals.slice(0, this.displayLimit);
          this.hasMore = this.meals.length < this.allMeals.length;
        } else {
          this.meals = [];
          this.allMeals = [];
          this.hasMore = false;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error de red', err);
        this.isLoading = false;
      }
    });
  }

  // Búsqueda (Requisito R3): Reinicia resultados y paginación
  onSearch(event: any) {
    this.searchTerm = event.detail.value;
    this.displayLimit = 5; // Reiniciamos el límite de visualización
    this.loadInitialData(this.searchTerm || 'a');
  }

  // Infinite Scroll (Requisito R2)
  loadMoreData(event: any) {
    setTimeout(() => {
      const currentLength = this.meals.length;
      const nextBatch = this.allMeals.slice(currentLength, currentLength + 5);
      
      // Concatenamos los nuevos elementos sin duplicar ni perder los anteriores
      this.meals = [...this.meals, ...nextBatch];
      
      // Indicamos al componente visual que terminó la carga del bloque
      event.target.complete();

      // Si ya mostramos todo el arreglo completo, desactivamos el infinite scroll
      if (this.meals.length >= this.allMeals.length) {
        this.hasMore = false;
      }
    }, 1000); // Pequeño delay de 1 segundo para apreciar el loading y las burbujas
  }
}