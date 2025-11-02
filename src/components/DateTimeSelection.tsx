import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimeSelectionProps {
  onSelectDateTime: (date: Date, time: string) => void;
  onBack: () => void;
  serviceName: string;
  stepNumber?: number;
}

const availableTimeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export function DateTimeSelection({
  onSelectDateTime,
  onBack,
  serviceName,
  stepNumber = 2,
}: DateTimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSelectDateTime(selectedDate, selectedTime);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          <span className="text-xl font-bold">{stepNumber}</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Selecione a Data e Horário
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Serviço: <span className="font-semibold text-foreground">{serviceName}</span>
        </p>
      </div>

      <Card className="p-6 shadow-[var(--shadow-medium)]">
        <h3 className="text-lg font-semibold text-foreground mb-4">Escolha a Data</h3>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date.getDay() === 0}
            locale={ptBR}
            className={cn("p-3 pointer-events-auto rounded-md border")}
          />
        </div>
      </Card>

      {selectedDate && (
        <Card className="p-6 shadow-[var(--shadow-medium)] animate-in fade-in slide-in-from-bottom duration-500">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Horários Disponíveis para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {availableTimeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "cta" : "secondary-action"}
                size="lg"
                onClick={() => setSelectedTime(time)}
                className="h-14"
              >
                <Clock className="w-4 h-4" />
                {time}
              </Button>
            ))}
          </div>
        </Card>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button
          variant="cta"
          size="lg"
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="flex-1"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
