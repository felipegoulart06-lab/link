import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ClipboardList } from "lucide-react";

type QuestionType = "radio" | "text" | "textarea" | "boolean";

interface QuestionConfig {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[]; // for radio
}

interface ServiceQuestionsProps {
  serviceId: string;
  serviceName: string;
  onBack: () => void;
  onSubmit: (answers: Record<string, string>) => void;
}

const QUESTIONS_BY_SERVICE: Record<string, QuestionConfig[]> = {
  // 1️⃣ Consultoria Estratégica
  "consultoria-estrategica": [
    {
      id: "objetivo-principal",
      label: "Qual é o principal objetivo da sua empresa neste momento?",
      type: "radio",
      options: [
        "Vender mais",
        "Melhorar presença online",
        "Automatizar processos",
        "Outro",
      ],
    },
    {
      id: "possui-sistemas",
      label: "Você já possui site, CRM ou algum sistema ativo?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "canais-atuais",
      label:
        "Quais canais sua empresa utiliza hoje? (ex: WhatsApp, Instagram, e-mail, loja online, etc.)",
      type: "text",
    },
    {
      id: "problema-urgente",
      label:
        "Há algum problema atual que você gostaria de resolver com urgência?",
      type: "textarea",
    },
    {
      id: "foco-consultoria",
      label: "Deseja que a consultoria seja voltada para:",
      type: "radio",
      options: [
        "Estratégia digital geral",
        "Planejamento de automação",
        "Reestruturação de site/projeto atual",
      ],
    },
    // Perguntas adicionais
    {
      id: "planejamento-estrategico",
      label:
        "Você já tem algum planejamento estratégico ou meta definida para os próximos meses?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "organizacao-processos",
      label: "Qual é o nível atual de organização dos seus processos internos?",
      type: "radio",
      options: [
        "Muito organizado",
        "Razoavelmente organizado",
        "Bagunçado / precisa de estrutura",
      ],
    },
    {
      id: "desafio-digital",
      label: "Qual é o seu maior desafio hoje no digital?",
      type: "radio",
      options: [
        "Falta de presença",
        "Falta de vendas",
        "Falta de automação",
        "Falta de estratégia",
        "Outro",
      ],
    },
    {
      id: "orcamento",
      label: "Qual é o seu orçamento estimado para implementar melhorias?",
      type: "radio",
      options: ["Baixo", "Médio", "Alto", "Ainda não sei"],
    },
    {
      id: "resultados-apos-consultoria",
      label:
        "Quais resultados você espera alcançar após a consultoria? (ex: aumentar conversão, reduzir retrabalho, estruturar funil...)",
      type: "textarea",
    },
  ],

  // 2️⃣ Desenvolvimento de Sites e Plataformas
  "desenvolvimento-sites-plataformas": [
    {
      id: "tipo-projeto",
      label: "Qual tipo de projeto você deseja criar?",
      type: "radio",
      options: [
        "Site institucional",
        "Landing Page",
        "Blog",
        "Sistema / Plataforma personalizada",
      ],
    },
    {
      id: "dominio-hospedagem",
      label: "Já possui domínio e hospedagem?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "conteudo",
      label:
        "Deseja que a Active Background cuide também do conteúdo (textos e imagens)?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "sites-referencia",
      label:
        "Cite 1 ou 2 sites que você gosta como referência (visualmente ou em estrutura).",
      type: "text",
    },
    {
      id: "recursos-site",
      label:
        "Quais recursos o site deve ter? (ex: formulário de contato, agendamento, área restrita, login de cliente, etc.)",
      type: "textarea",
    },
    // Perguntas adicionais
    {
      id: "logo-identidade",
      label: "Você já possui logo e identidade visual definidas?",
      type: "radio",
      options: ["Sim", "Não", "Preciso criar"],
    },
    {
      id: "area-admin",
      label:
        "O site precisa de área administrativa para você editar conteúdo?",
      type: "radio",
      options: ["Sim", "Não", "Não sei"],
    },
    {
      id: "integracoes-externas",
      label:
        "O projeto deve ter integração com algum serviço externo? (ex: CRM, gateway de pagamento, WhatsApp, API externa)",
      type: "textarea",
    },
    {
      id: "quantidade-paginas",
      label: "O site terá quantas páginas (aproximadamente)?",
      type: "radio",
      options: ["1 página", "3–5 páginas", "6–10 páginas", "Mais de 10"],
    },
    {
      id: "objetivo-site",
      label: "Qual é o objetivo principal do site?",
      type: "radio",
      options: [
        "Captar clientes",
        "Mostrar informações",
        "Vender produtos",
        "Automatizar atendimentos",
      ],
    },
    {
      id: "conteudo-pronto",
      label:
        "Você já possui textos e fotos prontas ou precisará que produzamos?",
      type: "radio",
      options: ["Já tenho", "Quero que vocês criem"],
    },
  ],

  // 3️⃣ Automação e Integrações Inteligentes (n8n, APIs)
  "automacao-integracoes-inteligentes": [
    {
      id: "area-automatizar",
      label: "Qual área você deseja automatizar primeiro?",
      type: "radio",
      options: [
        "Atendimento (WhatsApp, Chatbot)",
        "Vendas (CRM, propostas, follow-up)",
        "Operacional (planilhas, relatórios, APIs)",
        "Outro",
      ],
    },
    {
      id: "ferramentas-atuais",
      label:
        "Você já utiliza alguma ferramenta que deseja integrar? (ex: Pipedrive, RD Station, WhatsApp API, Planilhas Google, etc.)",
      type: "text",
    },
    {
      id: "demonstração-ou-planejamento",
      label:
        "Deseja visualizar uma demonstração primeiro ou iniciar direto o planejamento do fluxo?",
      type: "radio",
      options: ["Demonstração", "Planejamento"],
    },
    {
      id: "processo-retrabalho",
      label:
        "Existe algum processo atual que está dando muito retrabalho e gostaria de automatizar?",
      type: "textarea",
    },
    {
      id: "quantidade-usuarios",
      label: "Quantas pessoas/equipes usariam essa automação?",
      type: "text",
    },
    // Perguntas adicionais
    {
      id: "etapa-automatizada",
      label: "Seu processo atual já possui alguma etapa automatizada?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "ferramentas-dados",
      label:
        "Em quais ferramentas seus dados estão hoje? (ex: CRM, Excel, sistema próprio, Google Workspace...)",
      type: "text",
    },
    {
      id: "notificacoes",
      label: "Você precisa que a automação envie notificações?",
      type: "radio",
      options: ["WhatsApp", "E-mail", "Ambos", "Não precisa"],
    },
    {
      id: "quantidade-etapas",
      label: "Quantas etapas o fluxo precisa ter (aproximadamente)?",
      type: "radio",
      options: ["Poucas etapas", "Moderado", "Muitas etapas / fluxo complexo"],
    },
    {
      id: "gargalo-processo",
      label:
        "Qual é o maior gargalo no processo atual? (ex: demora na resposta, perda de leads, repetição de tarefas...)",
      type: "textarea",
    },
    {
      id: "relatorios-automaticos",
      label: "Você precisa de relatórios automáticos?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "frequencia-execucao",
      label: "Essa automação deve rodar:",
      type: "radio",
      options: [
        "Em tempo real",
        "Uma vez ao dia",
        "Semanalmente",
        "Sob demanda",
      ],
    },
  ],

  // 4️⃣ Pacote de Marketing e Criação de Conteúdo
  "marketing-conteudo": [
    {
      id: "objetivo-marketing",
      label: "Qual é o principal objetivo do marketing hoje?",
      type: "radio",
      options: [
        "Aumentar visibilidade da marca",
        "Gerar mais leads/clientes",
        "Lançar um novo produto/serviço",
      ],
    },
    {
      id: "redes-atuais",
      label: "Quais redes sociais você usa atualmente?",
      type: "text",
    },
    {
      id: "produzir-videos",
      label: "Deseja incluir produção de vídeos e gravações profissionais?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "estilo-comunicacao",
      label: "Qual é o estilo de comunicação da sua marca?",
      type: "radio",
      options: [
        "Profissional e direto",
        "Criativo e moderno",
        "Divertido e descontraído",
        "Outro",
      ],
    },
    {
      id: "materiais-base",
      label:
        "Possui materiais anteriores (logos, posts, vídeos) que podemos usar como base?",
      type: "textarea",
    },
    // Perguntas adicionais
    {
      id: "calendario-editorial",
      label: "Você possui um calendário editorial hoje?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "publico-alvo",
      label: "Qual é o público-alvo da sua empresa? (explique quem são seus clientes ideais)",
      type: "textarea",
    },
    {
      id: "trafego-pago",
      label: "Você quer incluir tráfego pago (anúncios)?",
      type: "radio",
      options: ["Sim", "Não", "Futuramente"],
    },
    {
      id: "frequencia-postagens",
      label: "Qual é a frequência ideal de postagens para você?",
      type: "radio",
      options: ["1–2 por semana", "3–5 por semana", "Diário", "Outro"],
    },
    {
      id: "marca-em-tres-palavras",
      label: "Como você descreveria sua marca em 3 palavras? (ex: moderna, técnica, acolhedora)",
      type: "text",
    },
    {
      id: "portfolio-anterior",
      label:
        "Já possui portfólio de trabalhos anteriores que gostaria de manter como base?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "roteiro-profissional",
      label: "Deseja que os vídeos tenham roteiro profissional?",
      type: "radio",
      options: ["Sim", "Não"],
    },
  ],

  // 5️⃣ Pacote Start – Transforme sua Empresa Digitalmente
  "pacote-start": [
    {
      id: "presenca-digital",
      label:
        "Você já tem presença digital (site, redes, WhatsApp comercial)?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "melhoria-principal",
      label: "O que você mais gostaria de melhorar na sua empresa hoje?",
      type: "radio",
      options: [
        "Ter um site profissional",
        "Vender mais online",
        "Automatizar o atendimento",
        "Organizar tudo em um só lugar",
      ],
    },
    {
      id: "porte-empresa",
      label: "Qual é o porte atual da sua empresa?",
      type: "radio",
      options: ["Profissional autônomo", "Pequena empresa", "Média empresa"],
    },
    {
      id: "momento-atual",
      label: "Qual dessas opções mais combina com seu momento atual?",
      type: "radio",
      options: [
        "Quero começar do zero",
        "Quero melhorar o que já tenho",
        "Quero expandir com novas tecnologias",
      ],
    },
    {
      id: "plano-ou-projeto",
      label:
        "Prefere um plano mensal com acompanhamento contínuo ou um projeto pontual?",
      type: "radio",
      options: ["Plano mensal", "Projeto único"],
    },
    // Perguntas adicionais
    {
      id: "area-urgente",
      label: "Qual área você acha mais urgente melhorar agora?",
      type: "radio",
      options: [
        "Site",
        "Mídias sociais",
        "Atendimento automatizado",
        "Organização interna",
      ],
    },
    {
      id: "familiaridade-tecnologia",
      label: "Qual é o seu nível de familiaridade com tecnologia?",
      type: "radio",
      options: ["Alto", "Médio", "Baixo"],
    },
    {
      id: "projeto-anterior-fracasso",
      label:
        "Você já teve algum projeto digital antes que não deu certo?",
      type: "radio",
      options: ["Sim", "Não"],
    },
    {
      id: "preferencia-solucao",
      label: "Prefere soluções mais simples ou mais completas?",
      type: "radio",
      options: ["Solução simples e rápida", "Solução completa e profissional"],
    },
    {
      id: "equipe-interna-digital",
      label: "A empresa tem equipe interna para cuidar da parte digital?",
      type: "radio",
      options: ["Sim", "Não", "Parcialmente"],
    },
    {
      id: "tempo-resultados",
      label: "Em quanto tempo você gostaria de ver resultados iniciais?",
      type: "radio",
      options: ["Até 30 dias", "60–90 dias", "Sem pressa, quero algo bem construído"],
    },
    {
      id: "canais-essenciais",
      label: "Quais canais você considera essenciais para o seu negócio?",
      type: "radio",
      options: [
        "Site",
        "Instagram",
        "WhatsApp comercial",
        "CRM",
        "Automação",
        "Todos",
      ],
    },
  ],
};

export function ServiceQuestions({ serviceId, serviceName, onBack, onSubmit }: ServiceQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = QUESTIONS_BY_SERVICE[serviceId] ?? [];

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const allAnswered = questions.every((q) => {
    const v = answers[q.id];
    return v !== undefined && String(v).trim().length > 0;
  });

  const handleContinue = () => {
    if (!allAnswered) return; // impede avanço sem responder tudo
    onSubmit(answers);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          <span className="text-xl font-bold">2</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Perguntas iniciais</h2>
        <p className="text-sm text-muted-foreground">
          Serviço: <span className="font-semibold text-foreground">{serviceName}</span>
        </p>
      </div>

      <Card className="p-6 shadow-[var(--shadow-medium)]">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Responda para entendermos sua necessidade</h3>
        </div>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <Label className="text-foreground">{q.label}</Label>
              {q.type === "radio" && q.options && (
                <RadioGroup value={answers[q.id]} onValueChange={(v) => handleChange(q.id, v)}>
                  {q.options.map((opt) => (
                    <div className="flex items-center gap-3" key={opt}>
                      <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                      <Label htmlFor={`${q.id}-${opt}`}>{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {q.type === "text" && (
                <Input
                  placeholder="Digite aqui"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === "textarea" && (
                <Textarea
                  rows={4}
                  placeholder="Descreva com mais detalhes"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === "boolean" && (
                <RadioGroup value={answers[q.id]} onValueChange={(v) => handleChange(q.id, v)}>
                  {[
                    { value: "Sim", label: "Sim" },
                    { value: "Não", label: "Não" },
                  ].map((opt) => (
                    <div className="flex items-center gap-3" key={opt.value}>
                      <RadioGroupItem value={opt.value} id={`${q.id}-${opt.value}`} />
                      <Label htmlFor={`${q.id}-${opt.value}`}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}
        </div>
      </Card>

      {!allAnswered && (
        <p className="text-sm text-red-500">Responda todas as perguntas para continuar.</p>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button variant="cta" size="lg" onClick={handleContinue} className="flex-1" disabled={!allAnswered}>
          Continuar
        </Button>
      </div>
    </div>
  );
}

export type { QuestionConfig };