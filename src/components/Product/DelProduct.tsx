// @/components/CreateProduct/DelProducts.tsx
"use client";

import { deleteProduct } from "@/actions/product";
import { useFormStatus } from "react-dom";

function DeleteButton() {
  const { pending } = useFormStatus(); // Detecta quando a action está rodando

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
    >
      {pending ? "Deletando..." : "Deletar"}
    </button>
  );
}

export default function DelProduct({ id }: { id: string }) {
  return (
    <form action={async () => {
      await deleteProduct(id);
    }}>
      <DeleteButton />
    </form>
  );
}