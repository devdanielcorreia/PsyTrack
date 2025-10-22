import { useCallback, useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext.tsx'
import { cn } from '@/lib/utils.ts'

const navLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Características (Traits)', to: '/admin/traits' },
  { label: 'Quizzes', to: '/admin/quizzes' },
  { label: 'Avaliações', to: '/admin/assessments' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSignOut = useCallback(async () => {
    try {
      setSigningOut(true)
      setError(null)
      await signOut()
      navigate('/', { replace: true })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Nao foi possivel encerrar a sessao. Tente novamente.'
      setError(message)
      setSigningOut(false)
    }
  }, [navigate, signOut])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 text-gray-700">
        Carregando…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex h-screen bg-slate-100 text-gray-800">
      <aside className="flex w-64 flex-col justify-between border-r border-slate-200 bg-white p-6 shadow-md">
        <div>
          <header className="mb-6 text-xl font-bold text-indigo-700">PsyTrack</header>
          <nav className="space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }: { isActive: boolean }) =>
                  cn(
                    'block rounded py-2 px-4 transition hover:bg-indigo-50',
                    isActive && 'bg-indigo-100 font-semibold text-indigo-700',
                  )
                }
                end={link.to === '/admin'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="space-y-2">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full rounded bg-red-500 py-2 px-4 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {signingOut ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
