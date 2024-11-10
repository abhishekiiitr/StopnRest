import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'averageRating'
})
export class AverageRatingPipe implements PipeTransform {
  transform(ratings: number[]): number {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return total / ratings.length;
  }
}
