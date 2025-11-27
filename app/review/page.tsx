'use client'

import { useSearchParams, notFound } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import React, { Suspense, useState } from 'react'
import { ClientQueryProvider } from '@/app/providers/ClientQueryProvider'
import { Calendar, Clock, MapPin, User, Scissors, Star } from 'lucide-react'

interface ReviewValidationResponse {
  valid: boolean
  review_id: number | null
  appointment_id: number | null
  customer_name: string | null
  service_name: string | null
  user_name: string | null
  start_datetime: string | null
  location_name: string | null
  already_reviewed: boolean
  token_expired: boolean
  message: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_SERVICE_URL || 'https://api-interna-development.up.railway.app'

async function validateReviewToken (token: string): Promise<ReviewValidationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v2/reviews/validate/${token}`, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al validar el token')
  }

  return response.json()
}

interface SubmitReviewRequest {
  token: string
  rating: number
  comment?: string
}

interface SubmitReviewResponse {
  success: boolean
  message: string
}

async function submitReview (data: SubmitReviewRequest): Promise<SubmitReviewResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v2/reviews/submit`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Error al enviar la reseña')
  }

  return response.json()
}

function StarRating ({ rating, onRatingChange, disabled }: { rating: number; onRatingChange: (rating: number) => void; disabled?: boolean }) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={`p-1 transition-transform ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          onClick={() => !disabled && onRatingChange(star)}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              (hoverRating || rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

function formatDateTime (dateTimeString: string): { date: string; time: string } {
  const date = new Date(dateTimeString)

  const dateFormatted = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const timeFormatted = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return { date: dateFormatted, time: timeFormatted }
}

function ReviewContent () {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { data, isLoading, isError } = useQuery<ReviewValidationResponse>({
    queryKey: ['review-validation', token],
    queryFn: () => validateReviewToken(token!),
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5 // 5 minutos
  })

  // Si no hay token, mostrar 404
  if (!token) {
    notFound()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando tu enlace de reseña...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    notFound()
  }

  // Token inválido
  if (data && !data.valid) {
    notFound()
  }

  // Token expirado
  if (data?.token_expired) {
    return (
      <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enlace expirado</h1>
          <p className="text-gray-600">El enlace para dejar tu reseña ha expirado.</p>
        </div>
      </div>
    )
  }

  // Ya se dejó una reseña
  if (data?.already_reviewed) {
    return (
      <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Gracias por tu reseña!</h1>
          <p className="text-gray-600">Ya has dejado una reseña para esta cita.</p>
        </div>
      </div>
    )
  }

  // Datos válidos - mostrar página de reseña
  const { date, time } = data?.start_datetime
    ? formatDateTime(data.start_datetime)
    : { date: '', time: '' }

  return (
    <div className="bg-white min-h-screen p-8 flex flex-col items-center">
      <div className="max-w-md w-full">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Deja tu reseña</h1>
          <p className="text-sm text-gray-600">
            ¡Hola {data?.customer_name}! Cuéntanos cómo fue tu experiencia.
          </p>
        </div>

        {/* Detalles de la cita */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center space-x-3">
            <Scissors className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">{data?.service_name}</p>
          </div>

          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">{data?.user_name}</p>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">{data?.location_name}</p>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900 capitalize">{date}</p>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-600" />
            <p className="text-gray-900">{time}</p>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Formulario de reseña */}
        <ReviewForm token={token} />
      </div>
    </div>
  )
}

function ReviewForm ({ token }: { token: string }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      setSubmitted(true)
    }
  })

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">¡Gracias por tu reseña!</h2>
        <p className="text-gray-600">Tu opinión nos ayuda a mejorar.</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    mutation.mutate({
      token,
      rating,
      comment: comment.trim() || undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Puntuación con estrellas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Cómo calificarías tu experiencia?
        </label>
        <div className="flex justify-center">
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            disabled={mutation.isPending}
          />
        </div>
        {rating > 0 && (
          <p className="text-center text-sm text-gray-500 mt-2">
            {rating === 1 && 'Muy malo'}
            {rating === 2 && 'Malo'}
            {rating === 3 && 'Regular'}
            {rating === 4 && 'Bueno'}
            {rating === 5 && 'Excelente'}
          </p>
        )}
      </div>

      {/* Comentario opcional */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comentario (opcional)
        </label>
        <textarea
          id="comment"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          placeholder="Cuéntanos más sobre tu experiencia..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={mutation.isPending}
        />
      </div>

      {/* Error */}
      {mutation.isError && (
        <div className="text-red-600 text-sm text-center">
          Hubo un error al enviar tu reseña. Por favor, intenta de nuevo.
        </div>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={rating === 0 || mutation.isPending}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          rating === 0 || mutation.isPending
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {mutation.isPending ? 'Enviando...' : 'Enviar reseña'}
      </button>
    </form>
  )
}

export default function ReviewPage () {
  return (
    <ClientQueryProvider>
      <Suspense fallback={
        <div className="bg-white min-h-screen p-8 flex flex-col items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      }>
        <ReviewContent />
      </Suspense>
    </ClientQueryProvider>
  )
}
