import { SignInOnServer } from '@/modules/auth/actions/auth.action'
import Image from 'next/image'
import { IconComponent } from '@/app/components/Icon.component'

export default function LoginPage () {
  return (
    <main>
      <div className="flex flex-col lg:flex-row h-screen bg-app-terciary">
        {/* Sección Izquierda: Imagen de Fondo */}
        <div
          className="lg:w-1/2 w-full flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/login/img-fondo.webp')" }}
        >
          <div className="flex items-center justify-center">
            <Image
              src="/aldonatelogo.webp"
              width={436}
              height={542}
              alt="Lima 21 Barber Shop"
              className="max-w-xs lg:max-w-md"
              loading='eager'
              priority />
          </div>
        </div>

        {/* Sección Derecha: Formulario de Inicio de Sesión */}
        <div className="lg:w-1/2 w-full flex flex-col items-center justify-center bg-white p-8">
          <div className='flex flex-col gap-6 sm:gap-8 px-4 md:px-8 lg:px-12 xl:px-20'>
            <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center underline'>Inicia sesión</h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 text-center lg:text-left">
              Inicia sesión fácilmente con tu cuenta de Google para una experiencia rápida y segura.
            </p>

            <form
              action={SignInOnServer}
              className='w-full flex justify-center'
            >
              <button
                className={'inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 gap-2 text-sm sm:text-base md:text-lg'}
                type='submit'
              >
                <IconComponent name='google' width={30} height={30} className="w-5 h-5 sm:w-6 sm:h-6" />
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
