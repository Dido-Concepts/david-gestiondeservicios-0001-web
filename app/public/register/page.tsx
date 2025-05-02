'use client'

import Paso1 from '@/app/public/components/Paso1.component'
import Paso2 from '@/app/public/components/Paso2.component'
import Paso3 from '@/app/public/components/Paso3.component'
import Paso4 from '@/app/public/components/Paso4.component'
import Paso7 from '@/app/public/components/Paso7.component' // Importamos Paso7
import { useState } from 'react'

// Interfaces para los tipos de datos
interface SelectedDateTime {
  month: string;
  day: number;
  time: string;
}

export interface FormData {
  sede?: { id: string; name: string };
  service?: { id: string; name: string };
  professional?: { id: string; name: string };
  dateTime?: SelectedDateTime;
  loginOption?: 'login' | 'guest';
}

export default function RegisterPage () {
  const [step, setStep] = useState(1)
  // formData almacena los datos acumulados de todos los pasos
  const [formData, setFormData] = useState<FormData>({})
  const totalSteps = 7 // Actualizamos a 7 pasos

  // Función para avanzar al siguiente paso y guardar datos
  const handleNext = (data: Partial<FormData>) => {
    // Actualiza formData con los nuevos datos del paso actual
    const updatedFormData = { ...formData, ...data }
    setFormData(updatedFormData)
    // Opcional: Muestra los datos acumulados en la consola para depuración
    // console.log('Datos acumulados:', updatedFormData);
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  // Función para retroceder al paso anterior
  const handleBack = () => {
    // Podrías querer limpiar los datos del paso actual al retroceder,
    // pero por ahora solo cambiamos el paso.
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="p-4">
      {/* Renderiza el componente del paso actual */}
      {step === 1 && <Paso1 onNext={handleNext} />}
      {/* Puedes pasar partes de formData si un paso necesita datos previos */}
      {/* Ejemplo: <Paso2 data={formData} onNext={handleNext} onBack={handleBack} /> */}
      {step === 2 && <Paso2 onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <Paso3 onNext={handleNext} onBack={handleBack} />}
      {step === 4 && <Paso4 onNext={handleNext} onBack={handleBack} />}
      {/* ... Aquí irían los pasos 5 y 6 si existieran ... */}

      {/* Pasa los datos acumulados (formData) al componente del último paso */}
      {step === 7 && <Paso7 data={formData} onBack={handleBack} />}
      {/* ^^^^^^^^^^^^^^ Ahora formData se está usando (leyendo) */}
    </div>
  )
}
