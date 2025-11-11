// Interfaces para manejo de errores de la API
interface ValidationError {
  campo: string
  ubicacion: string
  mensaje: string
  valor_recibido: string
  tipo_error: string
}

interface ValidationErrorResponse {
  error: string
  mensaje: string
  errores: ValidationError[]
  codigo_estado: number
}

interface BadRequestErrorResponse {
  error: {
    status: number
    name: string
    message: string
  }
}

interface AxiosError {
  response: {
    status: number
    data: ValidationErrorResponse | BadRequestErrorResponse | { message?: string; error?: string }
  }
}

export interface ErrorInfo {
  title: string
  description: string
}

/**
 * Maneja errores de la API y retorna información formateada para mostrar en toast
 * @param error - Error capturado del catch
 * @returns Información del error formateada para mostrar al usuario
 */
export function handleApiError (error: unknown): ErrorInfo {
  let errorTitle = 'Error al crear la cita'
  let errorDescription = 'Hubo un problema al crear la cita. Por favor, inténtalo de nuevo.'

  // Verificar si es un error de axios con respuesta del servidor
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError

    if (axiosError.response?.status) {
      const statusCode = axiosError.response.status
      const responseData = axiosError.response.data

      if (statusCode === 422) {
        // Error de validación - formato específico para 422
        const validationData = responseData as ValidationErrorResponse
        errorTitle = validationData.error || 'Error de validación'

        if (validationData.errores && Array.isArray(validationData.errores)) {
          // Mostrar el primer error de validación
          const primerError = validationData.errores[0]
          errorDescription = `${validationData.mensaje || 'Datos inválidos'}\n\nCampo: ${primerError.campo}\nMensaje: ${primerError.mensaje}`
        } else {
          errorDescription = validationData.mensaje || 'Los datos enviados no son válidos.'
        }
      } else if (statusCode === 400) {
        // Error BadRequest - formato específico para 400
        const badRequestData = responseData as BadRequestErrorResponse
        if (badRequestData.error?.message) {
          errorTitle = badRequestData.error.name || 'Error de solicitud'
          errorDescription = badRequestData.error.message
        } else {
          errorTitle = 'Error de solicitud'
          errorDescription = 'Solicitud inválida.'
        }
      } else {
        // Otros códigos de error HTTP
        const genericData = responseData as { message?: string; error?: string }
        errorTitle = `Error ${statusCode}`
        errorDescription = genericData.message || genericData.error || 'Error del servidor.'
      }
    }
  }

  return {
    title: errorTitle,
    description: errorDescription
  }
}

/**
 * Maneja errores específicos de creación de citas
 * @param error - Error capturado del catch
 * @returns Información del error formateada para mostrar al usuario
 */
export function handleAppointmentCreationError (error: unknown): ErrorInfo {
  const baseError = handleApiError(error)

  // Personalizar el título base si es necesario
  if (baseError.title === 'Error al crear la cita') {
    baseError.title = 'Error al crear la cita'
  }

  return baseError
}
