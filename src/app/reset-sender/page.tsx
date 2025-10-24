import ResetSender from "@/components/Forms/ResetSender";
import Header from "@/components/Header";

export default async function ResetPage(){
    return (
        <main>
            <div>
                <Header></Header>
            </div>
            <div>
                <ResetSender></ResetSender>
            </div>
        </main>
    )
}