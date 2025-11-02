import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MessageCircle, MapPin, Briefcase } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen bg-[var(--gradient-hero)] py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* TOPO - Identidade e Credibilidade */}
        <header className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          {/* Foto de Perfil/Logo */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-card shadow-[var(--shadow-medium)] flex items-center justify-center overflow-hidden border-4 border-primary/10">
            <img
              src="/LOGO INTERATIVO DA ACTIVEBACKGROUN.jpg"
              alt="ACTIVE BACKGROUND logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Nome da Marca */}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ACTIVE BACKGROUND
          </h1>
          
          {/* Chamada de Valor */}
          <p className="text-lg text-muted-foreground max-w-sm mx-auto">
            Tecnologia, Design e Automação para escalar seu negócio.
          </p>
        </header>

        {/* FUNIL DE AGENDAMENTO - Foco Principal */}
        <section className="space-y-4 mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-150">
          {/* CTA Principal - Maior e mais chamativo */}
          <Button 
            variant="cta" 
            size="xl" 
            className="w-full text-lg"
            asChild
          >
            <a href="/booking?step=datetime&service=consultoria-estrategica">
              <Calendar className="w-6 h-6" />
              FALAR COM ATENDENTE
            </a>
          </Button>

          {/* Botão Secundário - Pacotes */}
          <Button 
            variant="secondary-action" 
            size="lg" 
            className="w-full"
            asChild
          >
            <Link to="/booking">
              <Briefcase className="w-5 h-5" />
              CONHECER NOSSOS PACOTES DE SERVIÇOS
            </Link>
          </Button>
        </section>

        {/* LINKS SECUNDÁRIOS - Suporte e Conexão */}
        <section className="space-y-3 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                Mais informações
              </span>
            </div>
          </div>

          {/* WhatsApp */}
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            asChild
          >
            <a href="https://" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5" />
              Perguntas Frequentes (FAQ)
            </a>
          </Button>

          {/* Portfólio/Resultados */}
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            asChild
          >
            <a href="https://tokematic-neon-glow.lovable.app">
              <Briefcase className="w-5 h-5" />
              Conheça nossa Página Oficial
            </a>
          </Button>

          {/* Localização */}
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            asChild
          >
            <a href="google.com/maps/place/Balneário+Camboriú,+SC/data=!4m2!3m1!1s0x94d8b65cc2e52aad:0x2dc004f5e6adebc4?sa=X&ved=1t:242&ictx=111">
              <MapPin className="w-5 h-5" />
              Como Chegar
            </a>
          </Button>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
          <p>© 2025 ACTIVE BACKGROUND - Todos os direitos reservados</p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
