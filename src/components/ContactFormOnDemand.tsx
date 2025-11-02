import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, ArrowLeft, Check } from "lucide-react";

const demandSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" }),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Telefone deve ter no mínimo 10 dígitos" })
    .max(15, { message: "Telefone deve ter no máximo 15 dígitos" })
    .regex(/^[0-9\s\-\(\)]+$/, { message: "Formato de telefone inválido" }),
  projectDetails: z
    .string()
    .trim()
    .min(10, { message: "Forneça ao menos 10 caracteres" })
    .max(1000, { message: "Detalhes devem ter no máximo 1000 caracteres" }),
});

type DemandFormData = z.infer<typeof demandSchema>;

interface ContactFormOnDemandProps {
  onBack: () => void;
  serviceName: string;
}

export function ContactFormOnDemand({ onBack, serviceName }: ContactFormOnDemandProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DemandFormData>({
    resolver: zodResolver(demandSchema),
  });

  const onSubmit = async (data: DemandFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    console.log("Solicitação de cotação enviada:", {
      ...data,
      service: serviceName,
    });

    setIsSubmitting(false);
    setIsConfirmed(true);

    toast({
      title: "Solicitação enviada!",
      description: "Entraremos em contato para a cotação do projeto.",
    });
  };

  if (isConfirmed) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-700">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Solicitação enviada!</h2>
          <p className="text-muted-foreground mb-8">
            Recebemos seus dados e retornaremos por email/WhatsApp com a cotação.
          </p>
        </div>

        <Button variant="cta" size="xl" className="w-full" asChild>
          <a href="/">Voltar ao Início</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          <span className="text-xl font-bold">2</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Dados para Cotação</h2>
        <p className="text-sm text-muted-foreground">Informe seus dados e detalhes do projeto</p>
      </div>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-foreground mb-4">Resumo:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Serviço:</span>
            <span className="font-semibold ml-auto">{serviceName}</span>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card className="p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="seu@email.com" {...register("email")} className={errors.email ? "border-destructive" : ""} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
              <Input id="phone" placeholder="(11) 99999-9999" {...register("phone")} className={errors.phone ? "border-destructive" : ""} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDetails">Detalhes do Projeto *</Label>
              <Textarea id="projectDetails" placeholder="Descreva o escopo, objetivos, integrações e prazos." rows={5} {...register("projectDetails")} className={errors.projectDetails ? "border-destructive" : ""} />
              {errors.projectDetails && <p className="text-sm text-destructive">{errors.projectDetails.message}</p>}
            </div>
          </div>
        </Card>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" size="lg" type="button" onClick={onBack} className="flex-1">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button variant="cta" size="lg" type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Enviando..." : "ENVIAR SOLICITAÇÃO"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export type { ContactFormOnDemandProps };