import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/context/AuthContext.tsx'

type UserRole = 'psychologist' | 'company' | 'employee'

const DEFAULT_ROLE: UserRole = 'psychologist'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>(DEFAULT_ROLE)
  const [rememberMe, setRememberMe] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRole(DEFAULT_ROLE)
    setRememberMe(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)

    try {
      if (!isSignup) {
        await signIn({ email, password })
        setMessage('Login realizado com sucesso.')
      } else {
        if (!name.trim()) {
          throw new Error('Informe o nome completo.')
        }

        const user = await signUp({
          email,
          password,
          role,
          metadata: { name, rememberMe },
          psychologistProfile: role === 'psychologist' ? { full_name: name } : undefined,
        })

        setMessage(
          user
            ? 'Cadastro concluido. Verifique seu e-mail para confirmar a conta.'
            : 'Cadastro enviado. Verifique seu e-mail para concluir o processo.',
        )
      }

      resetForm()
    } catch (submitError) {
      const messageText =
        submitError instanceof Error
          ? submitError.message
          : 'Nao foi possivel concluir a operacao.'
      setError(messageText)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 font-sans text-gray-800">
      <Card className="mx-auto w-full max-w-md rounded-md border border-gray-200 bg-white p-6 shadow-md sm:w-96">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-teal-700">
            {isSignup ? 'Cadastrar na PsyTrack' : 'Entrar na PsyTrack'}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {isSignup ? 'Crie sua conta para comecar.' : 'Acesse sua conta PsyTrack.'}
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm text-gray-600">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  placeholder="Ex.: Dra. Ana Psicologa"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={submitting}
                  required
                  autoComplete="name"
                  className="border-gray-300 text-gray-800 focus-visible:ring-1 focus-visible:ring-teal-400"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-gray-600">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={submitting}
                required
                autoComplete="email"
                className="border-gray-300 text-gray-800 focus-visible:ring-1 focus-visible:ring-teal-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-gray-600">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={submitting}
                required
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                className="border-gray-300 text-gray-800 focus-visible:ring-1 focus-visible:ring-teal-400"
              />
            </div>

            {isSignup && (
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-sm text-gray-600">
                  Perfil de acesso
                </Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger
                    id="role"
                    className="border-gray-300 text-gray-800 focus-visible:ring-1 focus-visible:ring-teal-400 focus-visible:ring-offset-0"
                  >
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="psychologist">Psicologo(a)</SelectItem>
                    <SelectItem value="company">Empresa</SelectItem>
                    <SelectItem value="employee">Funcionario(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  disabled={submitting}
                />
                Manter-me conectado
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-teal-600" role="status">
                {message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-teal-600 font-semibold text-white hover:bg-teal-700"
              disabled={submitting}
            >
              {submitting ? 'Processando...' : isSignup ? 'Cadastrar' : 'Entrar'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center space-y-2 text-sm text-gray-600">
          <p>
            {isSignup ? 'Ja tem conta?' : 'Ainda nao tem conta?'}{' '}
            <button
              type="button"
              className="text-teal-600 underline-offset-2 hover:underline"
              onClick={() => {
                setIsSignup((prev) => !prev)
                setError(null)
                setMessage(null)
              }}
              disabled={submitting}
            >
              {isSignup ? 'Entrar' : 'Cadastrar-se'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
