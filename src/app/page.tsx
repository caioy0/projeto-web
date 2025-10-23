// app/page.tsx 
import ProductsList from "@/components/Product/ProductList";
import Header from "@/components/Header";
import Filter from "@/components/FilterBar"; 
import SearchBar from "@/components/SearchBar";

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
    <main className="p-6">
      <Header/>
      
      <div className="mt-8 mb-8 flex flex-wrap flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="md:order-2">
          <Filter category={category} search={search} /> 
        </div>
        <div className="md:order-1 w-full md:w-auto">
          <SearchBar search={search} category={category} />
        </div>
      </div>

      {/* Server component já filtrando e passando para Card */}
      <ProductsList search={search} category={category} />
    </main>
  );
}