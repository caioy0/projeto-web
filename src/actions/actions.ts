// src/app/actions.ts
'use server';

// import { cookies } from 'next/headers'; // To set the auth token in a cookie
// import { registerUser, loginUser } from '@/lib/auth';
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import slugify from "slugify";

// Create products in @app/register-product
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const sale = formData.get("sale") === "on"; // checkbox
    const salePrice = sale
      ? formData.get("salePrice")
        ? parseFloat(formData.get("salePrice") as string)
        : null
      : null;
    const quantity = parseInt(formData.get("quantity") as string);
    const categoryId = formData.get("categoryId") as string;

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        sale,
        salePrice,
        quantity,
        categoryId,
      },
    });

    // Redirect to homepage after successful creation
    redirect("/");
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export interface CreateCategoryData {
  name: string;
}

// Create category @/app/create-category
export async function createCategory(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Category name is required");

  await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
    },
  });

  // Optionally redirect after creation
  redirect("/"); 
}


// Helper function to set the JWT token as a cookie
// async function setAuthToken(token: string) {
//   (await cookies()).set({
//     name: 'token',
//     value: token,
//     httpOnly: true, // Crucial for security: prevents JS access
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     path: '/',
//   });
// }

// export async function registerUserAction(formData: FormData) {
//   const rawFormData = {
//     name: formData.get('name') as string,
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   };

//   try {
//     // This throws an error if registration fails (e.g., user exists)
//     await registerUser(rawFormData);
//     // Redirect to login on successful registration
//     redirect('/login?message=Account created successfully. Please log in.');
//   } catch (error) {
//     // Return the error message to be displayed in the form
//     console.error('Registration error:', error);
//     return { error: error instanceof Error ? error.message : 'Registration failed' };
//   }
// }

// export async function loginUserAction(formData: FormData) {
//   const rawFormData = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   };

//   try {
//     // This throws an error if login fails
//     const { token } = await loginUser(rawFormData);

//     // Set the token in an HTTP-only cookie
//     await setAuthToken(token);

//     // Redirect to dashboard on successful login
//     redirect('/dashboard');
//   } catch (error) {
//     console.error('Login error:', error);
//     return { error: error instanceof Error ? error.message : 'Login failed' };
//   }
// }

// // An action to log the user out by clearing the cookie
// export async function logoutUserAction() {
//   (await cookies()).delete('token');
//   redirect('/');
// }