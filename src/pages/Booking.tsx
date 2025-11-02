import { useEffect, useState } from "react";
import { ServiceSelection, Service } from "@/components/ServiceSelection";
import { getServiceById } from "@/components/ServiceSelection";
import { DateTimeSelection } from "@/components/DateTimeSelection";
import { ContactForm } from "@/components/ContactForm";
import { ContactFormOnDemand } from "@/components/ContactFormOnDemand";
import { ServiceQuestions } from "@/components/ServiceQuestions";
import { ClientInfoForm, ClientInfoData } from "@/components/ClientInfoForm";
import { ThankYou } from "@/components/ThankYou";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "react-router-dom";

type BookingStep = "service" | "questions" | "clientInfo" | "thankyou" | "datetime" | "contact" | "contactOnDemand";

const Booking = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [questionsAnswers, setQuestionsAnswers] = useState<Record<string, string> | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfoData | null>(null);
  const [isAttendantFlow, setIsAttendantFlow] = useState<boolean>(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const step = searchParams.get("step");
    setIsAttendantFlow(step === "datetime");
    const serviceId = searchParams.get("service") || (step === "datetime" ? "consultoria-estrategica" : null);
    if (serviceId) {
      const svc = getServiceById(serviceId);
      if (svc) {
        setSelectedService(svc);
      }
    }
    if (step === "datetime") {
      setCurrentStep("datetime");
    }
  }, [searchParams]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    // Após selecionar qualquer serviço, ir para a página de perguntas
    setCurrentStep("questions");
  };

  const handleQuestionsSubmit = (answers: Record<string, string>) => {
    setQuestionsAnswers(answers);
    setCurrentStep("clientInfo");
  };

  const handleClientInfoSubmit = (data: ClientInfoData) => {
    setClientInfo(data);
    setCurrentStep("thankyou");
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setCurrentStep("contact");
  };

  const handleBackToService = () => {
    setCurrentStep("service");
    setSelectedService(null);
  };

  const handleBackToQuestions = () => {
    setCurrentStep("questions");
  };

  const handleBackToDateTime = () => {
    setCurrentStep("datetime");
  };

  return (
    <main className="min-h-screen bg-[var(--gradient-hero)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentStep === "service" || isAttendantFlow) {
                  window.location.href = "/";
                } else {
                  setCurrentStep("service");
                }
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-foreground">Agendamento Online</h1>
            </div>
            <div className="w-20"></div>
          </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(isAttendantFlow
            ? (["datetime", "contact"] as BookingStep[])
            : (["service", "questions", "clientInfo", "thankyou"] as BookingStep[])
          ).map((step, idx) => {
            const stepOrder = isAttendantFlow
              ? (["datetime", "contact"] as BookingStep[])
              : (["service", "questions", "clientInfo", "thankyou"] as BookingStep[]);
            const currentIndex = stepOrder.indexOf(currentStep);
            const isActive = currentIndex >= idx;
            return (
              <div
                key={step}
                className={`h-2 w-20 rounded-full transition-all duration-300 ${isActive ? "bg-primary" : "bg-border"}`}
              />
            );
          })}
        </div>
        </header>

        {/* Steps Content */}
        <div className="pb-8">
          {currentStep === "service" && (
            <ServiceSelection onSelectService={handleServiceSelect} />
          )}

          {currentStep === "questions" && selectedService && (
            <ServiceQuestions
              serviceId={selectedService.id}
              serviceName={selectedService.name}
              onBack={handleBackToService}
              onSubmit={handleQuestionsSubmit}
            />
          )}

          {currentStep === "clientInfo" && selectedService && (
            <ClientInfoForm
              onBack={handleBackToQuestions}
              onSubmit={handleClientInfoSubmit}
              serviceName={selectedService.name}
              serviceId={selectedService.id}
              questionsAnswers={questionsAnswers ?? {}}
              stepNumber={3}
            />
          )}

          {currentStep === "thankyou" && selectedService && (
            <ThankYou serviceName={selectedService.name} stepNumber={4} />
          )}

          {currentStep === "datetime" && selectedService && (
            <DateTimeSelection
              onSelectDateTime={handleDateTimeSelect}
              onBack={isAttendantFlow ? () => { window.location.href = "/"; } : handleBackToQuestions}
              serviceName={selectedService.name}
              stepNumber={isAttendantFlow ? 1 : 4}
            />
          )}

          {currentStep === "contact" &&
            selectedService &&
            selectedDate &&
            selectedTime && (
              <ContactForm
                onBack={handleBackToDateTime}
                serviceName={selectedService.name}
                date={selectedDate}
                time={selectedTime}
                price={selectedService.price}
                stepNumber={isAttendantFlow ? 2 : 5}
              />
            )}
        </div>
      </div>
    </main>
  );
};

export default Booking;
