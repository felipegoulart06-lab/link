import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

interface ThankYouProps {
  serviceName: string;
  stepNumber?: number;
}

export function ThankYou({ serviceName, stepNumber = 4 }: ThankYouProps) {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-700">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          <span className="text-xl font-bold">{stepNumber}</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Obrigado!</h2>
        <p className="text-sm text-muted-foreground">
          Recebemos seus dados. Nossa equipe entrará em contato em breve.
        </p>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Agradecemos o interesse no serviço selecionado. Em breve retornaremos via
          email ou WhatsApp para dar continuidade ao seu projeto.
        </p>
      </div>

      <Card className="p-6 bg-accent/5 border-accent/20">
        <h3 className="font-semibold text-foreground mb-4">Resumo:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-accent" />
            <span className="text-muted-foreground">Serviço:</span>
            <span className="font-semibold ml-auto">{serviceName}</span>
          </div>
        </div>
      </Card>

      <Button variant="cta" size="xl" className="w-full" asChild>
        <Link to="/">Voltar ao Início</Link>
      </Button>
    </div>
  );
}