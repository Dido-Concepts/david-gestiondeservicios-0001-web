'use client'

import { useState } from 'react'
import Paso1 from '@/app/public/components/Paso1.component'
import Paso2 from '@/app/public/components/Paso2.component'
import Paso3 from '@/app/public/components/Paso3.component'
import Paso4 from '@/app/public/components/Paso4.component'
import Paso5 from '@/app/public/components/Paso5.component'
import Paso6 from '@/app/public/components/Paso6.component'
import Paso7 from '@/app/public/components/Paso7.component' // Importamos Paso7

// Interfaces para los tipos de datos
interface SelectedDateTime {
  month: string;
  day: number;
  time: string;
}

interface FormData {
  sede?: { id: string; name: string };
  service?: { id: string; name: string };
  professional?: { id: string; name: string };
  dateTime?: SelectedDateTime;
  loginOption?: 'login' | 'guest';
}

export default function RegisterPage () {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({})
  const totalSteps = 7 // Actualizamos a 7 pasos

  // Función para avanzar al siguiente paso
  const handleNext = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  // Función para retroceder al paso anterior
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="p-4">
      {step === 1 && <Paso1 onNext={handleNext} />}
      {step === 2 && <Paso2 onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <Paso3 onNext={handleNext} onBack={handleBack} />}
      {step === 4 && <Paso4 onNext={handleNext} onBack={handleBack} />}
      {step === 5 && <Paso5 onNext={handleNext} onBack={handleBack} />}
      {step === 6 && <Paso6 formData={formData} onNext={handleNext} />}
      {step === 7 && <Paso7 />}
    </div>
  )
}
