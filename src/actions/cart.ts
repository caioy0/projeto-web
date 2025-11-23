// @app/actions/cart.ts
"use server";

import prisma from "@/lib/prisma";

type CartItem = {
    productId: string;
    quantity: number;
    // Add other fields as needed, e.g. price, name, etc.
};

export async function updateCart(userId: string, items: CartItem[]) {
    await prisma.cart.upsert({
        where: { userId },
        create: { userId, items },
        update: { items },
    });
}
