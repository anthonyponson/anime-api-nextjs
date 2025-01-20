import { Anime, AnimeResponse } from "@/types/types";

 const fetchAnimeData = async () => {
  try {
    const response = await fetch('https://api.jikan.moe/v4/anime', {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data  = await response.json();
    
    return data as Anime[]
  } catch (error) {
    console.error('Error fetching anime:', error);
    throw error;
  }
}

export default fetchAnimeData
