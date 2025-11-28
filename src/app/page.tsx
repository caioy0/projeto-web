// app/page.tsx 
import ProductsList from "@/components/Product/ProductList";
import Header from "@/components/Header";
import Filter from "@/components/FilterBar"; 
import SearchBar from "@/components/SearchBar";
import DarkVeil from "@/components/DarkVeil";

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function Home(props: HomePageProps) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || '';
  const category = searchParams.category || 'none';

return (
    <main className="relative min-h-screen p-6">

      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none bg-[#050505]">
        <DarkVeil 
            speed={3.0} 
        />
      </div>

      <div className="relative z-10">
        <Header/>
        
        <div className="mt-8 mb-8 flex flex-wrap flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="md:order-2">
            <Filter category={category} search={search} categories={[]} /> 
          </div>
          <div className="md:order-1 w-full md:w-auto">
            <SearchBar search={search} category={category} />
          </div>
        </div>
        <ProductsList search={search} category={category} />
      </div>
    </main>
  );
}