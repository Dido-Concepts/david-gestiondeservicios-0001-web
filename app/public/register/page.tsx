'use client'

import { useState } from 'react'
import Paso1 from '@/app/public/components/Paso1.component'
import Paso2 from '@/app/public/components/Paso2.component'

export default function RegisterPage () {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})

  const handleNext = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <div>
      {step === 1 && <Paso1 onNext={handleNext} />}
      {step === 2 && <Paso2 onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <div>Paso 3: {JSON.stringify(formData)}</div>}
    </div>
  )
}
