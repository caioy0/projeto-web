import Orders from "@/components/Orders/Orders";
import OrderForm from "@/components/Orders/OrdersForm";
import Header from "@/components/Header";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
    <Header></Header>
      <OrderForm />
      <Orders />
    </div>
  );
}
