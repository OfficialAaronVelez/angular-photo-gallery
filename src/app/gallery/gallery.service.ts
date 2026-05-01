import { Injectable } from '@angular/core';

export interface Photo {
  id: number;
  url: string;
  title: string;
  likes: number;
}

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private nextId = 4;

  photos: Photo[] = [
    {
      id: 1,
      url: 'https://picsum.photos/seed/angular/400/300',
      title: 'Angular Vibes',
      likes: 0,
    },
    {
      id: 2,
      url: 'https://picsum.photos/seed/code/400/300',
      title: 'Código en acción',
      likes: 0,
    },
    {
      id: 3,
      url: 'https://picsum.photos/seed/nature/400/300',
      title: 'Naturaleza',
      likes: 0,
    },
  ];

  get totalLikes(): number {
    return this.photos.reduce((sum, p) => sum + p.likes, 0);
  }

  addPhoto(url: string, title: string): void {
    this.photos.push({ id: this.nextId++, url, title, likes: 0 });
  }

  likePhoto(id: number): void {
    const photo = this.photos.find((p) => p.id === id);
    if (photo) photo.likes++;
  }

  removePhoto(id: number): void {
    this.photos = this.photos.filter((p) => p.id !== id);
  }
}
