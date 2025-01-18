'use client';

import { useEffect, useState } from 'react';

interface Anime {
  mal_id: number;
  title: string;
  image_url: string;
  synopsis: string;
}

export default function Home() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnime = async () => {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?page=${page}`);
        const data = await response.json();

        if (data.data.length === 0) {
          setHasMore(false);
        } else {
          setAnimeList((prev) => [
            ...prev,
            ...data.data.map((anime: any) => ({
              mal_id: anime.mal_id,
              title: anime.title,
              image_url: anime.images.jpg.image_url,
              synopsis: anime.synopsis,
            })),
          ]);
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const filteredAnime = animeList.filter((anime) =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Anime Search</h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search for anime..."
          className="border rounded-lg p-2 w-full max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnime.map((anime) => (
          <div key={anime.mal_id} className="bg-white rounded-lg shadow p-4">
            <img
              src={anime.image_url}
              alt={anime.title}
              className="rounded-lg w-full h-48 object-cover mb-4"
            />
            <h2 className="text-lg font-bold mb-2">{anime.title}</h2>
            <p className="text-sm text-gray-600">
              {anime.synopsis ? anime.synopsis.substring(0, 100) + '...' : 'No synopsis available.'}
            </p>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center text-gray-600 mt-4">
          <div className="loader w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        </div>
      )}

      {!hasMore && (
        <div className="text-center text-gray-600 mt-4">
          No more anime to load.
        </div>
      )}
    </div>
  );
}
