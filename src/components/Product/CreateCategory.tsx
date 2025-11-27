// @/components/CreateCategory/CreateCategory.tsx
import { createCategory } from "@/actions/product";
import { FolderPlus } from "lucide-react"; // Certifique-se de ter lucide-react instalado

export default function CreateCategoryPage() {
  return (
    <div className="relative min-h-screen w-full flex justify-center items-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-[#050505] text-gray-100 selection:bg-purple-500/30">
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-white mb-3">
            Nova Categoria
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Crie uma nova seção para organizar seus produtos e facilitar a navegação dos clientes.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          
          <form action={createCategory} className="flex flex-col gap-6">
            
            <div className="space-y-2">
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-300 ml-1"
              >
                Nome da Categoria <span className="text-purple-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Ex: Periféricos, Jogos de RPG..."
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <FolderPlus size={20} className="group-hover:scale-110 transition-transform" />
              Criar Categoria
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}