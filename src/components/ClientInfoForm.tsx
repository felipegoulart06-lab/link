import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, ArrowLeft } from "lucide-react";

const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Nome deve ter no mínimo 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  company: z.string().trim().max(120, { message: "Nome da empresa muito longo" }).optional(),
  email: z
    .string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" }),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, { message: "Formato esperado: (XX) 99999-9999" }),
  projectDetails: z.string().trim().max(1000, { message: "Máximo de 1000 caracteres" }).optional(),
});

export type ClientInfoData = z.infer<typeof clientSchema>;

interface ClientInfoFormProps {
  onBack: () => void;
  onSubmit: (data: ClientInfoData) => void;
  serviceName: string;
  serviceId?: string;
  stepNumber?: number;
  questionsAnswers?: Record<string, string>;
}

const WEBHOOK_BY_SERVICE_ID: Record<string, string> = {
  "desenvolvimento-sites-plataformas": "https://n8n.activebackground.com.br/webhook-test/660c2603-ae7d-48ed-8cd2-7a634b3aa6f2",
  "consultoria-estrategica": "https://n8n.activebackground.com.br/webhook-test/a39b21d1-51ed-4cbf-96e9-1ba80ed374c2",
  "automacao-integracoes-inteligentes": "https://n8n.activebackground.com.br/webhook-test/384e2516-1a91-4652-a487-48bb8713594a",
  "marketing-conteudo": "https://n8n.activebackground.com.br/webhook-test/b0d8f974-86b9-48d9-8631-ee268cb6fb78",
  "pacote-start": "https://n8n.activebackground.com.br/webhook-test/06b9a4c5-689d-4d92-87f1-bc389b01b812",
};

export function ClientInfoForm({ onBack, onSubmit, serviceName, serviceId, stepNumber = 3, questionsAnswers }: ClientInfoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientInfoData>({ resolver: zodResolver(clientSchema) });

  const rawPhone = watch("phone") || "";

  // Máscara de telefone: (XX) 99999-9999
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const d0 = digits.slice(0, 2);
    const d1 = digits.slice(2, 7);
    const d2 = digits.slice(7, 11);
    if (digits.length <= 2) return d0 ? `(${d0}` : "";
    if (digits.length <= 7) return `(${d0}) ${d1}`;
    return `(${d0}) ${d1}-${d2}`;
  };

  useEffect(() => {
    if (!rawPhone) return;
    const masked = formatPhone(rawPhone);
    if (masked !== rawPhone) setValue("phone", masked, { shouldValidate: false });
  }, [rawPhone, setValue]);

  const submit = async (data: ClientInfoData) => {
    const url = serviceId ? WEBHOOK_BY_SERVICE_ID[serviceId] : undefined;
    try {
      if (url) {
        // Em desenvolvimento, usamos o proxy do Vite chamando o caminho relativo
        const urlToUse = import.meta.env.DEV ? new URL(url).pathname : url;
        await fetch(urlToUse, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: serviceId,
            serviceName,
            ...data,
            questionnaire: {
              answers: questionsAnswers ?? {},
              answerCount: questionsAnswers ? Object.keys(questionsAnswers).length : 0,
            },
            submittedAt: new Date().toISOString(),
            source: "booking-client-info",
          }),
        });
      }
    } catch (err) {
      // Silenciosamente prossegue para o próximo passo mesmo que o webhook falhe (ex.: modo de teste n8n)
      console.error("Webhook submission failed", err);
    }
    onSubmit(data);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          <span className="text-xl font-bold">{stepNumber}</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Dados do Cliente</h2>
        <p className="text-sm text-muted-foreground">Informe seus dados para prosseguir ao agendamento</p>
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

      <form onSubmit={handleSubmit(submit)} className="space-y-5">
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
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa (Opcional)</Label>
              <Input
                id="company"
                placeholder="Ex.: Active Background"
                {...register("company")}
                className={errors.company ? "border-destructive" : ""}
              />
              {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
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
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDetails">Detalhes do Projeto (Opcional)</Label>
              <Textarea
                id="projectDetails"
                placeholder="Descreva o que precisa, objetivos e contexto"
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
          <Button variant="cta" size="lg" type="submit" className="flex-1">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
}