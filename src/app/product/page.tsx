// @/app/product/create-product/page.tsx
import Link from "next/link";
import Header from "@/components/Header";
import { PlusCircle, FolderPlus, Edit, Package } from "lucide-react"; // Certifique-se de ter lucide-react instalado

export default function ProductsPage() {
  
  const actions = [
    {
      title: "Criar Produto",
      href: "/product/create-product",
      icon: PlusCircle,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Criar Categoria",
      href: "/product/create-category",
      icon: FolderPlus,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Gerenciar Produtos",
      href: "/product/alt-product", 
      icon: Edit,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 relative overflow-hidden">
      
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <Header />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-12">
        
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-white w-fit">
            Dashboard de Produtos
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <Link 
              href={action.href} 
              key={index}
              className="group relative"
            >
              <div className="h-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20">
                
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} p-0.5 mb-6 opacity-90 group-hover:opacity-100 transition-opacity`}>
                   <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-[10px] flex items-center justify-center">
                      <action.icon size={28} className="text-white" />
                   </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                  {action.title}
                </h2>

                <div className="absolute bottom-8 right-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-purple-400">
                  <Package size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}