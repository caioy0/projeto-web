// @/app/orders/page.tsx
import Orders from "@/components/Orders/Orders";
import OrderForm from "@/components/Orders/OrdersForm";
import Header from "@/components/Header";

export default function OrdersPage() {
  return (
    <main>
      <div className="space-y-8">
      <Header/>
      </div>
      <div>
        <OrderForm />
        <Orders />
      </div>
    </main>
  );
}
