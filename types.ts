export enum ContentType {
  HOME = 'home',
  LIVE = 'live',
  MOVIE = 'movie',
  SERIES = 'series',
  CATCHUP = 'catchup'
}

export interface Profile {
  id: number;
  name: string;
  avatar: string;
  isKid: boolean;
  locked?: boolean;
}

export interface LoginResponse {
  user_info: {
    username: string;
    status: string;
    exp_date: string;
    max_connections: string;
  };
  server_info: {
    url: string;
    port: string;
    server_protocol: string;
  };
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface LiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  tv_archive: number;
  direct_source: string;
}

export interface VodStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  rating: string;
  rating_5based: number;
  added: string;
  category_id: string;
  container_extension: string;
  direct_source: string;
  backdrop_path?: string[];
  year?: string;
  duration?: string;
  plot?: string;
  director?: string;
  genre?: string;
}

export interface Series {
  num: number;
  name: string;
  series_id: number;
  cover: string;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  rating: string;
  rating_5based: number;
  backdrop_path: string[];
  youtube_trailer: string;
  episode_run_time: string;
  category_id: string;
}

export interface Episode {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info: {
    plot: string;
    duration: string;
    movie_image: string;
  };
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  season_number: number;
  vote_average: number;
  cover: string;
}