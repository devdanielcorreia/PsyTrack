import { useAuth } from '@/context/AuthContext.tsx'
import Login from '@/pages/auth/Login.tsx'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-silver">
        <p className="text-sm font-medium text-brand-navy">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-silver p-6 text-center">
      <h1 className="text-3xl font-semibold text-brand-navy">Bem-vindo à PsyTrack</h1>
      <p className="mt-3 max-w-md text-sm text-slate-600">
        Sessão ativa. Em breve esta área exibirá dashboards, controles de avaliação e ferramentas
        específicas do seu perfil.
      </p>
    </div>
  )
}
