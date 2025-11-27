import { Movie, Language, Genre } from './types';

export const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'RRR',
    description: 'A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.',
    posterUrl: 'https://picsum.photos/id/10/300/450',
    bannerUrl: 'https://picsum.photos/id/10/1200/600',
    rating: 9.2,
    year: 2022,
    languages: [Language.TELUGU, Language.HINDI, Language.TAMIL],
    genres: [Genre.ACTION, Genre.DRAMA],
    director: 'S.S. Rajamouli',
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt'],
    trending: true,
    progress: 54, // Mock progress
    duration: 187,
    parentalRating: 'U/A 16+'
  },
  {
    id: '2',
    title: 'Kantara',
    description: 'When greed paves the way for betrayal, scheming, and murder, a young tribal reluctantly dons the traditions of his ancestors to seek justice.',
    posterUrl: 'https://picsum.photos/id/15/300/450',
    bannerUrl: 'https://picsum.photos/id/15/1200/600',
    rating: 9.5,
    year: 2022,
    languages: [Language.KANNADA, Language.HINDI, Language.TELUGU],
    genres: [Genre.THRILLER, Genre.ACTION],
    director: 'Rishab Shetty',
    cast: ['Rishab Shetty', 'Sapthami Gowda'],
    trending: true,
    duration: 148,
    parentalRating: 'U/A 16+'
  },
  {
    id: '3',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterUrl: 'https://picsum.photos/id/28/300/450',
    bannerUrl: 'https://picsum.photos/id/28/1200/600',
    rating: 8.9,
    year: 2014,
    languages: [Language.ENGLISH, Language.HINDI],
    genres: [Genre.SCI_FI, Genre.DRAMA],
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway'],
    newRelease: false,
    progress: 25, // Mock progress
    duration: 169,
    parentalRating: 'U/A 13+'
  },
  {
    id: '4',
    title: 'Vikram',
    description: 'A high-octane action thriller where a special investigator is assigned a case of serial killings.',
    posterUrl: 'https://picsum.photos/id/40/300/450',
    bannerUrl: 'https://picsum.photos/id/40/1200/600',
    rating: 8.8,
    year: 2022,
    languages: [Language.TAMIL, Language.TELUGU, Language.HINDI],
    genres: [Genre.ACTION, Genre.THRILLER],
    director: 'Lokesh Kanagaraj',
    cast: ['Kamal Haasan', 'Vijay Sethupathi', 'Fahadh Faasil'],
    trending: true,
    progress: 88, // Mock progress
    duration: 175,
    parentalRating: 'A'
  },
  {
    id: '5',
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    posterUrl: 'https://picsum.photos/id/55/300/450',
    bannerUrl: 'https://picsum.photos/id/55/1200/600',
    rating: 9.0,
    year: 2019,
    languages: [Language.KOREAN, Language.ENGLISH],
    genres: [Genre.DRAMA, Genre.THRILLER],
    director: 'Bong Joon Ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun'],
    duration: 132,
    parentalRating: 'A'
  },
  {
    id: '6',
    title: 'Manjummel Boys',
    description: 'A group of friends gets into a daring rescue mission to save their friend from Guna Caves.',
    posterUrl: 'https://picsum.photos/id/88/300/450',
    bannerUrl: 'https://picsum.photos/id/88/1200/600',
    rating: 8.7,
    year: 2024,
    languages: [Language.MALAYALAM, Language.TELUGU, Language.TAMIL],
    genres: [Genre.THRILLER, Genre.DRAMA],
    director: 'Chidambaram',
    cast: ['Soubin Shahir', 'Sreenath Bhasi'],
    newRelease: true,
    duration: 135,
    parentalRating: 'U'
  }
];

export const GENRES_LIST = Object.values(Genre);
export const LANGUAGES_LIST = Object.values(Language);