import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { GalleryService } from './gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  gallery = inject(GalleryService);

  newUrl = '';
  newTitle = '';
  urlError = false;

  get photos() {
    return this.gallery.photos;
  }

  get totalLikes() {
    return this.gallery.totalLikes;
  }

  addPhoto(): void {
    const url = this.newUrl.trim();
    const title = this.newTitle.trim();

    if (!url || !title) return;

    try {
      new URL(url);
      this.urlError = false;
    } catch {
      this.urlError = true;
      return;
    }

    this.gallery.addPhoto(url, title);
    this.newUrl = '';
    this.newTitle = '';
  }

  like(id: number): void {
    this.gallery.likePhoto(id);
  }

  remove(id: number): void {
    this.gallery.removePhoto(id);
  }
}
