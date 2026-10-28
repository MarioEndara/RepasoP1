import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  // Guardar un elemento como favorito
  async saveFavorite(id: string): Promise<void> {
    await Preferences.set({
      key: `fav_${id}`,
      value: 'true'
    });
  }

  // Eliminar un elemento de favoritos
  async removeFavorite(id: string): Promise<void> {
    await Preferences.remove({ 
      key: `fav_${id}` 
    });
  }

  // Verificar si un elemento ya es favorito (devuelve true o false)
  async isFavorite(id: string): Promise<boolean> {
    const { value } = await Preferences.get({ 
      key: `fav_${id}` 
    });
    return value === 'true';
  }
}