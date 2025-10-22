// Tipos principais usados pelo painel do psicólogo (PsyTrack)

export type Trait = {
  id: number
  nome: string
  descricao?: string
  psicologo_id: number
  criado_em?: string
}

export type Quiz = {
  id: number
  titulo: string
  psicologo_id: number
  ativo?: boolean
  criado_em?: string
}

export type Question = {
  id: number
  quiz_id: number
  ordem: number
  texto_pt: string
  texto_es?: string
  texto_en?: string
}

export type Alternative = {
  id: number
  question_id: number
  texto_pt: string
  peso: number
}

export type Assessment = {
  id: number
  nome: string
  descricao?: string
  psicologo_id: number
  criado_em?: string
}

export type AssessmentQuiz = {
  assessment_id: number
  quiz_id: number
}

export type Response = {
  id: number
  application_id: number
  question_id: number
  alternativa_id: number
}

export type Result = {
  id: number
  application_id: number
  trait_id: number
  score: number
  percentual: number
}
