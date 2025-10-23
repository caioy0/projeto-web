// @/app/create-category/page.tsx
import CreateCategory from "@/components/Product/CreateCategory";
import Header from "@/components/Header";

export default async function RegisterCategoryPage() {
    return(
        <main>
            <Header/>
            <CreateCategory/>
        </main>
    );
}