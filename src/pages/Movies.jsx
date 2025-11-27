import { Typography, Button, Card, Row, Col, Rate, Tag, Tooltip, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApi from "../logic/useApi";
import { useEffect, useState } from "react";
import Field from "../components/form/Field";
import { PiMagnifyingGlass, PiStarFill, PiCalendarFill, PiUserFill, PiPlayCircleFill } from "react-icons/pi";

const { Title } = Typography;

export default function Movies() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { callApi, loading } = useApi();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);


  const fetchData = async () => {
    const { response, status } = await callApi({
      url: "/search",
      method: "get",
      params: {
        q: searchQuery,
      },
    });

    if (status && response.ok) {
      setMovies(response.description);
    } else {
      setMovies([]);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery) {
        fetchData();
      } else {
        setMovies([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  return (
    <div className="">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Title level={1} className="text-white mb-4">Movie Explorer</Title>
          <Title level={4} className="text-gray-300">Discover your favorite movies</Title>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <Field
            type="input"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<PiMagnifyingGlass color="gray" />}
            className="bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-gray-400"
          />
        </div>

        {loading ? <div className="flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" className="text-purple-400" />
            <div className="text-white mt-4">Loading...</div>
          </div>
        </div> : <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div
                key={movie["#IMDB_ID"]}
                className="group relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => navigate(`/movies/${movie["#IMDB_ID"]}`)}
              >
                <div className="aspect-2/3 overflow-hidden">
                  <img
                    src={movie["#IMG_POSTER"]}
                    alt={movie["#TITLE"]}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                    }}
                  />
                  {/* <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white mb-2">
                      <PiPlayCircleFill className="text-2xl" />
                      <span className="text-sm font-medium">Watch Trailer</span>
                    </div>
                  </div>
                </div> */}
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {movie["#TITLE"]}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-300 text-xs mb-3">
                    <PiCalendarFill className="text-yellow-400" />
                    <span>{movie["#YEAR"]}</span>
                    <span className="text-yellow-400">•</span>
                    <span className="text-yellow-400 font-medium">#{movie["#RANK"]}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <PiUserFill className="text-gray-400" />
                    <span className="line-clamp-1">{movie["#ACTORS"]}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <PiStarFill className="text-yellow-400 text-sm" />
                      <span className="text-yellow-400 text-sm font-medium">
                        {(10 - (movie["#RANK"] / 250)).toFixed(1)}
                      </span>
                    </div>
                    <Tag className="bg-purple-600 text-white border-none text-xs">
                      IMDB
                    </Tag>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {movies.length === 0 && (
            searchQuery ? (
              <div className="text-center py-16">
                <div className="text-gray-200 text-lg mb-4">No movies found</div>
                <div className="text-gray-300">Try searching for your favorite movies</div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-200 text-lg mb-4">Search for movies</div>
                <div className="text-gray-300">Enter a movie name to search</div>
              </div>
            )
          )}
        </>}
      </div>
    </div >
  );
}
