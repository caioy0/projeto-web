import Header from "@/components/Header";
import GradientText from "@/components/GradientText";
import ScrollReveal from "@/components/ScrollReveal";

export default async function About() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Header />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 py-20 text-center">
        
        <div className="mb-16 scale-110 md:scale-125">
            <GradientText
            colors={["#a855f7", "#3b82f6", "#d946ef", "#a855f7"]} // Roxo -> Azul -> Rosa
            animationSpeed={4}
            showBorder={false}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
            >
            Projeto para Aula de Prog Web
            </GradientText>
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
            
            <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={3}
                blurStrength={5}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl"
            >
                <div className="grid gap-8 md:grid-cols-2 text-left">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-1">Criadores</h3>
                            <p className="text-xl font-medium text-gray-200">Lucas Borges & Kaio Yugo</p>
                        </div>
                        <div>
                            <h3 className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-1">Tecnologias</h3>
                            <div className="flex flex-wrap gap-2">
                                {["TypeScript", "Tailwind CSS", "Next.js", "Prisma", "React Bits", "MongoDB"].map((tech) => (
                                    <span key={tech} className="text-sm px-2 py-1 rounded bg-white/10 text-gray-300 border border-white/5">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-pink-400 text-sm font-semibold uppercase tracking-wider mb-1">Sobre o Projeto</h3>
                        <p className="text-gray-300 leading-relaxed">
                            Uma proposta moderna de e-commerce focada no universo gamer. 
                            A plataforma oferece uma experiência imersiva para a venda de jogos digitais, 
                            hardwares de alta performance e softwares essenciais, unindo design minimalista 
                            com funcionalidades robustas.
                        </p>
                    </div>
                </div>
            </ScrollReveal>

        </div>
      </main>
    </div>
  );
}