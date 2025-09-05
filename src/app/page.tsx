// app/page.tsx (Server Component)
import Header from "@/components/Header";
import Filter from "@/components/FilterBar"; 
import { Card } from "@/components/Cards";
import { products } from "@/data/products";

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
    const correspondeCategory = category === 'none' || item.category === category;
    const correspondeBusca = item.name.toLowerCase().includes(search.toLowerCase());
    return correspondeCategory && correspondeBusca;
  });

  return (
    <main className="p-6">
      <Header/>
      
      <div className="mt-8 mb-8 flex flex-wrap flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="md:order-2">
          {/* Now passing the correct props */}
          <Filter category={category} search={search} /> 
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