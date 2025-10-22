import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'

import { supabase } from '../lib/supabase'

type SignInParams = {
  email: string
  password: string
}

type SignUpParams = {
  email: string
  password: string
  role: 'psychologist' | 'company' | 'employee'
  metadata?: Record<string, unknown>
  psychologistProfile?: Record<string, unknown>
}

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (params: SignInParams) => Promise<User | null>
  signUp: (params: SignUpParams) => Promise<User | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      setLoading(true)
      const { data, error } = await supabase.auth.getSession()

      if (!isMounted) return

      if (error) {
        console.error('Failed to load session', error)
        setUser(null)
        setSession(null)
      } else {
        setSession(data.session ?? null)
        setUser(data.session?.user ?? null)
      }

      setLoading(false)
    }

    void bootstrap()

    // Mantém o contexto sincronizado com qualquer mudança de sessão (login, logout, refresh).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }: SignInParams) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      throw error
    }

    return data.user ?? null
  }

  const signUp = async ({
    email,
    password,
    role,
    metadata = {},
    psychologistProfile = {},
  }: SignUpParams) => {
    // Persistimos o role no metadata para ser consumido por policies RLS no backend.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, ...metadata } },
    })

    if (error) {
      throw error
    }

    const createdUser = data.user ?? null

    // Se o novo usuário for psicólogo, registramos também na tabela de domínio.
    if (createdUser && role === 'psychologist') {
      const { error: profileError } = await supabase
        .from('psychologists')
        .insert({ id: createdUser.id, ...psychologistProfile })

      if (profileError) {
        throw profileError
      }
    }

    return createdUser
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [user, session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
