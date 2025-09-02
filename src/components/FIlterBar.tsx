// src/components/FilterBar.tsx
type FilterProps = {
    setCategory: (category: string) => void;
    category: string;
  };
  
  export default function Filter({ setCategory, category }: FilterProps) {
    return (
      <div className="flex justify-end mb-4 font-bold">
        <button
          className={`mx-2 px-4 py-2 rounded hover:bg-gray-200 ${
            category === 'none' ? 'bg-gray-200' : 'bg-white text-black'
          }`}
          onClick={() => setCategory('none')}
        >
          Remover Filtro
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded hover:bg-gray-200 ${
            category === 'lamen' ? 'bg-gray-200' : 'bg-white text-black'
          }`}
          onClick={() => setCategory('lamen')}
        >
          Lamen
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded hover:bg-gray-200 ${
            category === 'cafe' ? 'bg-gray-200' : 'bg-white text-black'
          }`}
          onClick={() => setCategory('cafe')}
        >
          Café
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded hover:bg-gray-200 ${
            category === 'bebida' ? 'bg-gray-200' : 'bg-white text-black'
          }`}
          onClick={() => setCategory('bebida')}
        >
          Bebida
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded hover:bg-gray-200 ${
            category === 'coreana' ? 'bg-gray-200' : 'bg-white text-black'
          }`}
          onClick={() => setCategory('coreana')}
        >
          Comida Coreana
        </button>
      </div>
    );
  }
  