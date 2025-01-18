// types.ts
export interface AnimeImage {
    jpg: {
      image_url: string;
    };
  }
  
  export interface AnimeResponse {
    data: {
      mal_id: number;
      title: string;
      images: AnimeImage;
      synopsis: string;
    }[];
  }
  
  export interface Anime {
    mal_id: number;
    title: string;
    image_url: string;
    synopsis: string;
  }