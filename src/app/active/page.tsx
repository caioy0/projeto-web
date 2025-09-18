// @/app/active/page.tsx
import Active from "@/components/Active";
import Header from "@/components/Header";

export default async function ActivePage(){
    return (
        <main>
            <Header></Header>
            <Active></Active>
        </main>
    );
}