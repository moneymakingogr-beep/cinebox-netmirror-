import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

type MediaItem = {
  id: number;
  title: string;
  kind: "Movie" | "Series" | "Anime";
  year: string;
  rating: string;
  genre: string;
  tone: string;
  accent: string;
};

const media: MediaItem[] = [
  { id: 1, title: "The Last Horizon", kind: "Movie", year: "2025", rating: "8.7", genre: "Sci-Fi", tone: "horizon", accent: "#a9d8e8" },
  { id: 2, title: "Neon District", kind: "Series", year: "2024", rating: "8.4", genre: "Thriller", tone: "neon", accent: "#ee8d77" },
  { id: 3, title: "A Quiet Season", kind: "Movie", year: "2023", rating: "8.1", genre: "Drama", tone: "quiet", accent: "#dcbf9f" },
  { id: 4, title: "Skybound", kind: "Anime", year: "2025", rating: "9.0", genre: "Adventure", tone: "sky", accent: "#f0c77c" },
  { id: 5, title: "After the Signal", kind: "Movie", year: "2024", rating: "7.9", genre: "Mystery", tone: "signal", accent: "#c8b7d9" },
  { id: 6, title: "Northbound", kind: "Series", year: "2022", rating: "8.2", genre: "Drama", tone: "north", accent: "#9dc4ba" },
  { id: 7, title: "Paper Moons", kind: "Anime", year: "2023", rating: "8.6", genre: "Fantasy", tone: "moons", accent: "#e9b4c7" },
  { id: 8, title: "The Long Weekend", kind: "Movie", year: "2025", rating: "7.8", genre: "Comedy", tone: "weekend", accent: "#e3aa76" },
];

const navigation = [
  { label: "Home", hash: "#/home" },
  { label: "Movies", hash: "#/movies" },
  { label: "Series", hash: "#/series" },
  { label: "Anime", hash: "#/anime" },
];

function getRoute(): string {
  return window.location.hash || "#/home";
}

function App() {
  const [route, setRoute] = useState(getRoute);
  const [search, setSearch] = useState("");
  const [list, setList] = useState<number[]>([2, 7]);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const currentKind = route === "#/movies" ? "Movie" : route === "#/series" ? "Series" : route === "#/anime" ? "Anime" : null;
  const filteredMedia = useMemo(() => {
    const query = search.trim().toLowerCase();
    return media.filter((item) => {
      const matchesKind = currentKind === null || item.kind === currentKind;
      const matchesSearch = !query || `${item.title} ${item.genre}`.toLowerCase().includes(query);
      return matchesKind && matchesSearch;
    });
  }, [currentKind, search]);

  const toggleList = (id: number) => {
    setList((current) => current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]);
  };

  const title = route === "#/mylist" ? "My List" : currentKind === "Movie" ? "Popular Movies" : currentKind === "Series" ? "Popular TV Shows" : currentKind === "Anime" ? "Popular Anime" : "Find your next favorite";
  const visibleMedia = route === "#/mylist" ? media.filter((item) => list.includes(item.id)) : filteredMedia;

  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#/home" aria-label="CineBox home">
          <span className="brand-mark">C</span>
          <span>CineBox</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          {navigation.map((item) => <a className={route === item.hash ? "active" : ""} href={item.hash} key={item.hash}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search titles" aria-label="Search titles" />
          </label>
          <a className="list-button" href="#/mylist">My List <span>{list.length}</span></a>
        </div>
      </header>

      <main>
        {route === "#/home" && <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Trending on TMDB</p>
            <h1 id="hero-title">Stories worth<br /><em>staying up for.</em></h1>
            <p className="hero-text">Discover remarkable movies, series, and anime selected for curious viewers.</p>
            <div className="hero-actions"><a className="primary-button" href="#/movies">Explore catalog</a><button className="text-button" onClick={() => setSelected(media[0])}>View featured title <span>→</span></button></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="sun" /><div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="hero-caption"><strong>The Last Horizon</strong><span>2025 · Sci-Fi · ★ 8.7</span></div></div>
        </section>}

        <section className="catalog-section" aria-labelledby="catalog-title">
          <div className="section-heading"><div><p className="eyebrow">Curated for you</p><h2 id="catalog-title">{title}</h2></div>{route !== "#/mylist" && <div className="view-toggle"><button className="selected">All</button><button>Top rated</button><button>Newest</button></div>}</div>
          {visibleMedia.length > 0 ? <div className="card-grid">{visibleMedia.map((item) => <MediaCard item={item} inList={list.includes(item.id)} onOpen={() => setSelected(item)} onToggle={() => toggleList(item.id)} key={item.id} />)}</div> : <div className="empty-state"><h3>Your list is ready for its first story.</h3><a className="primary-button" href="#/movies">Browse titles</a></div>}
          {route !== "#/mylist" && <button className="catalog-pagination load-more" onClick={() => setSearch("")}>Load more <span>↓</span></button>}
        </section>
      </main>

      <footer><span>© 2025 CineBox</span><span>Metadata provided by TMDB</span><a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">View on TMDB</a></footer>
      {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><article className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setSelected(null)} aria-label="Close details">×</button><div className={`modal-poster poster-${selected.tone}`}><span>{selected.kind}</span></div><div><p className="eyebrow">{selected.genre} · {selected.year}</p><h2 id="detail-title">{selected.title}</h2><p className="modal-copy">A highly rated {selected.kind.toLowerCase()} for your next viewing session. Explore more details and save it to your personal list.</p><div className="modal-meta"><strong>★ {selected.rating}</strong><span>{selected.genre}</span></div><button className="primary-button" onClick={() => toggleList(selected.id)}>{list.includes(selected.id) ? "Remove from My List" : "Add to My List"}</button></div></article></div>}
    </div>
  );
}

type MediaCardProps = { item: MediaItem; inList: boolean; onOpen: () => void; onToggle: () => void };

function MediaCard({ item, inList, onOpen, onToggle }: MediaCardProps) {
  return <article className="media-card"><button className={`poster poster-${item.tone}`} onClick={onOpen} aria-label={`Open ${item.title}`}><span>{item.kind}</span><b>{item.title}</b></button><div className="card-info"><div><h3>{item.title}</h3><p>{item.year} · {item.genre}</p></div><button className={`save-button ${inList ? "saved" : ""}`} onClick={onToggle} aria-label={inList ? `Remove ${item.title} from My List` : `Add ${item.title} to My List`}>{inList ? "✓" : "+"}</button></div><div className="rating"><span>★ {item.rating}</span><span>{item.kind}</span></div></article>;
}

createRoot(document.getElementById("root")!).render(<App />);
