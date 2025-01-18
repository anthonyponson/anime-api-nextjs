import { Anime, AnimeResponse } from "@/types/types";

export async function fetchAnimeData(): Promise<Anime[]> {
  try {
    const response = await fetch('https://api.jikan.moe/v4/anime', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AnimeResponse = await response.json();
    
    return data.data.map((anime) => ({
      mal_id: anime.mal_id,
      title: anime.title,
      image_url: anime.images.jpg.image_url,
      synopsis: anime.synopsis,
    }));
  } catch (error) {
    console.error('Error fetching anime:', error);
    throw error;
  }
}
