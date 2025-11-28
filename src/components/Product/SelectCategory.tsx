// @/components/CreateProduct/SelectCategory.tsx
'use client';

type Category = {
  id: string;
  name: string;
};

export default function CategorySelect({ categories }: { categories: Category[] }) {
  return (
    <div className="w-full">
      <label
        htmlFor="categoryId"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Categoria <span className="text-purple-400">*</span>
      </label>
      
      <div className="relative group">
        <select
          id="categoryId"
          name="categoryId"
          required
          className="w-full appearance-none px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all cursor-pointer placeholder-gray-500"
          defaultValue=""
        >

          <option value="" disabled className="bg-[#050505] text-gray-500">
            Selecione uma categoria...
          </option>

          {categories.map((cat) => (
            <option 
              key={cat.id} 
              value={cat.id}
              className="bg-[#050505] text-gray-200 py-2"
            >
              {cat.name}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400 group-hover:text-purple-400 transition-colors">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}