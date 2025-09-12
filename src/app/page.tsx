// app/page.tsx 
import { Card } from "@/components/Cards";
import { products } from "@/data/products";
import Header from "@/components/Header";
import Filter from "@/components/FilterBar"; 
import SearchBar from "@/components/SearchBar";

interface HomePageProps {
  searchParams: {
    search?: string;
    category?: string;
  };
}

export default function Home({ searchParams }: HomePageProps) {
  const search = searchParams.search || '';
  const category = searchParams.category || 'none';

  const itensFilter = products.filter(item => {
    const equalsCategory = category === 'none' || item.category === category;
    const equalsSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return equalsCategory && equalsSearch;
  });

  return (
    <main className="p-6">
      <Header/>
      
      <div className="mt-8 mb-8 flex flex-wrap flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="md:order-2">
          {/* Now passing the correct props */}
          <Filter category={category} search={search} /> 
        </div>
         <div className="md:order-1 w-full md:w-auto">
          <SearchBar search={search} category={category} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {itensFilter.map(item => (
          <Card
            key={item.id} 
            id={item.id} 
            name={item.name}
            price={item.price}
            image={item.image}
            category={item.category}
            description={item.description}
          />
        ))}
      </div>
    </main>
  );
}