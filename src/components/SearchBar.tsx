type SearchBarProps = {
  query: string;
  onChange: (value: string) => void;
};

function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default SearchBar;