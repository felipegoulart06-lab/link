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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, Briefcase, ArrowLeft, Check } from "lucide-react";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
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
    .max(500, { message: "Detalhes devem ter no máximo 500 caracteres" })
    .optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onBack: () => void;
  serviceName: string;
  date: Date;
  time: string;
  price: number;
  stepNumber?: number;
}

export function ContactForm({ onBack, serviceName, date, time, price, stepNumber = 3 }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Agendamento confirmado:", {
      ...data,
      service: serviceName,
      date: format(date, "dd/MM/yyyy"),
      time,
      price,
    });

    setIsSubmitting(false);
    setIsConfirmed(true);

    toast({
      title: "Agendamento Confirmado!",
      description: "Você receberá uma confirmação por email e WhatsApp.",
    });
  };

  if (isConfirmed) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-700">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6 animate-in zoom-in duration-500 delay-150">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Agendamento Confirmado!
          </h2>
          <p className="text-muted-foreground mb-8">
            Seu horário foi reservado com sucesso. Enviamos os detalhes para seu email.
          </p>
        </div>

        <Card className="p-6 bg-accent/5 border-accent/20">
          <h3 className="font-semibold text-foreground mb-4">Detalhes do Agendamento:</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-accent" />
              <span className="text-muted-foreground">Serviço:</span>
              <span className="font-semibold ml-auto">{serviceName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent" />
              <span className="text-muted-foreground">Data:</span>
              <span className="font-semibold ml-auto">
                {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-muted-foreground">Horário:</span>
              <span className="font-semibold ml-auto">{time}</span>
            </div>
          </div>
        </Card>

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
          <span className="text-xl font-bold">{stepNumber}</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Seus Dados e Confirmação
        </h2>
        <p className="text-sm text-muted-foreground">
          Preencha suas informações para finalizar o agendamento
        </p>
      </div>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-foreground mb-4">Resumo da Reserva:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Serviço:</span>
            <span className="font-semibold ml-auto">{serviceName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Data:</span>
            <span className="font-semibold ml-auto">
              {format(date, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">Horário:</span>
            <span className="font-semibold ml-auto">{time}</span>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Card className="p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                placeholder="Digite seu nome completo"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDetails">Detalhes do Projeto (Opcional)</Label>
              <Textarea
                id="projectDetails"
                placeholder="Conte-nos um pouco sobre o que você precisa..."
                rows={4}
                {...register("projectDetails")}
                className={errors.projectDetails ? "border-destructive" : ""}
              />
              {errors.projectDetails && (
                <p className="text-sm text-destructive">{errors.projectDetails.message}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" size="lg" type="button" onClick={onBack} className="flex-1">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button
            variant="cta"
            size="lg"
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Confirmando..." : "CONFIRMAR AGENDAMENTO"}
          </Button>
        </div>
      </form>
    </div>
  );
}
