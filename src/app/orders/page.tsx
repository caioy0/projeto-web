// @/app/orders/page.tsx
import Header from "@/components/Header";
import Orders from "@/components/Orders/Orders";
export default async function Checkout() {
    
    return(
        <main>
            <Header/>
            <div>
                <Orders></Orders>
            </div>
        </main>
    );
}