import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  onDemand?: boolean;
  ctaLabel?: string;
}

interface ServiceSelectionProps {
  onSelectService: (service: Service) => void;
}

export const services: Service[] = [
  {
    id: "consultoria-estrategica",
    name: "Consultoria Estratégica",
    description: "Sessão 1:1 para mapeamento de projeto (CRM, Site, Automação).",
    duration: 60,
    price: 250,
  },
  {
    id: "desenvolvimento-sites-plataformas",
    name: "Desenvolvimento de Sites e Plataformas",
    description:
      "Criação de sites institucionais, landing pages, blogs, CRMs e plataformas sob medida (WordPress, Vite, React, Node.js).",
    duration: 0,
    price: 0,
    onDemand: true,
  },
  {
    id: "automacao-integracoes-inteligentes",
    name: "Automação e Integrações Inteligentes (n8n, APIs)",
    description:
      "Planejamento e implementação de fluxos automáticos (n8n, APIs, CRMs, WhatsApp, etc.). Inclui demonstração e consultoria inicial.",
    duration: 0,
    price: 0,
    onDemand: true,
  },
  {
    id: "marketing-conteudo",
    name: "Pacote de Marketing e Criação de Conteúdo",
    description:
      "Gestão de Redes Sociais, Design Gráfico e vídeos profissionais.",
    duration: 0,
    price: 0,
    onDemand: true,
  },
  {
    id: "pacote-start",
    name: "Pacote Start – Transforme sua Empresa Digitalmente",
    description:
      "Ideal para quem ainda não sabe por onde começar. Reunimos as principais soluções da Active Background (site, automação, redes sociais e consultoria estratégica) em um único plano personalizado.",
    duration: 0,
    price: 0,
    onDemand: true,
    ctaLabel: "Explorar Pacote Start",
  },
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find((s) => s.id === id);
};

export function ServiceSelection({ onSelectService }: ServiceSelectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          <span className="text-xl font-bold">1</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Escolha o Serviço Desejado
        </h2>
        <p className="text-muted-foreground">
          Selecione o serviço que melhor atende suas necessidades
        </p>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className="p-5 hover:shadow-[var(--shadow-medium)] transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30"
            onClick={() => onSelectService(service)}
          >
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-start pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration > 0 ? `${service.duration} min` : "Duração Variável"}</span>
                </div>
              </div>

              <Button variant="secondary-action" size="sm" className="w-full mt-2">
                {service.ctaLabel ?? "Selecionar"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export type { Service };
