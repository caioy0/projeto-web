// src/components/SearchBar.tsx
type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <label htmlFor="busca"></label>
      <input
        type="text"
        id="busca"
        name="busca"
        placeholder="Buscar..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={handleChange}
      />
    </div>
  );
}
