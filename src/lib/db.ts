import { supabase } from '@/lib/supabase'
import type { Assessment, Quiz, Trait } from '@/types/psy'

// Tipagens auxiliares para modelar um CRUD genérico em cima do Supabase.
type Identifier = number | string
type FilterValue = string | number | boolean | null
type QueryFilters<TRow> = Partial<Record<keyof TRow & string, FilterValue>>
type OrderOptions<TRow> = {
  column: keyof TRow & string
  ascending?: boolean
}

type ListOptions<TRow> = {
  scope?: FilterValue
  filters?: QueryFilters<TRow>
  orderBy?: OrderOptions<TRow>
  limit?: number
  select?: string
}

type ReadOptions = {
  scope?: FilterValue
  select?: string
}

type MutationOptions = {
  scope?: FilterValue
  select?: string
}

type ScopeKeyName<TRow, TScopeKey extends keyof TRow | undefined> = TScopeKey extends keyof TRow
  ? TScopeKey
  : never

export type InsertInput<
  TRow extends Record<string, unknown>,
  TScopeKey extends keyof TRow | undefined = undefined
> = Omit<TRow, 'id' | 'criado_em' | ScopeKeyName<TRow, TScopeKey>>

export type UpdateInput<
  TRow extends Record<string, unknown>,
  TScopeKey extends keyof TRow | undefined = undefined
> = Partial<Omit<TRow, 'id' | 'criado_em' | ScopeKeyName<TRow, TScopeKey>>>

type CrudConfig<
  TRow extends Record<string, unknown>,
  TScopeKey extends keyof TRow | undefined = undefined
> = {
  table: string
  defaultSelect?: string
  idColumn?: keyof TRow & string
  scopeKey?: TScopeKey
  defaultOrder?: OrderOptions<TRow>
}

export type Crud<
  TRow extends Record<string, unknown>,
  TScopeKey extends keyof TRow | undefined = undefined
> = {
  list: (options?: ListOptions<TRow>) => Promise<TRow[]>
  getById: (id: Identifier, options?: ReadOptions) => Promise<TRow | null>
  create: (payload: InsertInput<TRow, TScopeKey>, options?: MutationOptions) => Promise<TRow | null>
  update: (
    id: Identifier,
    payload: UpdateInput<TRow, TScopeKey>,
    options?: MutationOptions
  ) => Promise<TRow | null>
  remove: (id: Identifier, options?: { scope?: FilterValue }) => Promise<TRow | null>
}

const DEFAULT_SELECT = '*'

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : JSON.stringify(error)

const applyFilters = <TRow>(query: any, filters?: QueryFilters<TRow>) => {
  if (!filters) return query
  let current = query
  for (const [column, value] of Object.entries(filters)) {
    if (value === undefined) continue
    current = value === null ? current.is(column, null) : current.eq(column, value)
  }
  return current
}

const applyScope = <TRow>(
  query: any,
  scopeKey: keyof TRow | undefined,
  scopeValue: FilterValue | undefined
) => {
  if (!scopeKey || scopeValue === undefined) return query
  return query.eq(scopeKey as string, scopeValue)
}

const resolveScope = (
  table: string,
  scopeKey: string | undefined,
  action: string,
  scopeValue: FilterValue | undefined
): FilterValue | undefined => {
  if (scopeKey && scopeValue === undefined) {
    throw new Error(`[Supabase:${table}] ${action} requer um valor para "${scopeKey}".`)
  }
  return scopeValue
}

export const createCrud = <
  TRow extends Record<string, unknown>,
  TScopeKey extends keyof TRow | undefined = undefined
>(
  config: CrudConfig<TRow, TScopeKey>
): Crud<TRow, TScopeKey> => {
  const {
    table,
    idColumn = 'id' as keyof TRow & string,
    scopeKey,
    defaultSelect = DEFAULT_SELECT,
    defaultOrder,
  } = config

  const buildSelect = (select?: string) => select ?? defaultSelect

  const list = async (options: ListOptions<TRow> = {}): Promise<TRow[]> => {
    const { scope, filters, orderBy = defaultOrder, limit, select } = options
    try {
      const resolvedScope = resolveScope(table, scopeKey as string | undefined, 'list', scope)
      let query: any = supabase.from<TRow>(table).select(buildSelect(select))
      query = applyScope(query, scopeKey, resolvedScope)
      query = applyFilters(query, filters)
      if (orderBy) {
        query = query.order(orderBy.column as string, {
          ascending: orderBy.ascending ?? true,
        })
      }
      if (typeof limit === 'number') {
        query = query.limit(limit)
      }
      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as TRow[]
    } catch (error) {
      throw new Error(`[Supabase:${table}] list falhou: ${getErrorMessage(error)}`)
    }
  }

  const getById = async (id: Identifier, options: ReadOptions = {}): Promise<TRow | null> => {
    const { scope, select } = options
    try {
      const resolvedScope = resolveScope(table, scopeKey as string | undefined, 'getById', scope)
      let query: any = supabase.from<TRow>(table).select(buildSelect(select)).eq(
        idColumn as string,
        id
      )
      query = applyScope(query, scopeKey, resolvedScope)
      const { data, error } = await query.maybeSingle()
      if (error) throw error
      return (data as TRow | null) ?? null
    } catch (error) {
      throw new Error(`[Supabase:${table}] getById falhou: ${getErrorMessage(error)}`)
    }
  }

  const create = async (
    payload: InsertInput<TRow, TScopeKey>,
    options: MutationOptions = {}
  ): Promise<TRow | null> => {
    const { scope, select } = options
    try {
      const resolvedScope = resolveScope(table, scopeKey as string | undefined, 'create', scope)
      const scopedPayload =
        scopeKey && resolvedScope !== undefined
          ? { ...payload, [scopeKey]: resolvedScope }
          : payload
      const { data, error } = await supabase
        .from<TRow>(table)
        .insert(scopedPayload as Partial<TRow>)
        .select(buildSelect(select))
        .maybeSingle()
      if (error) throw error
      return (data as TRow | null) ?? null
    } catch (error) {
      throw new Error(`[Supabase:${table}] create falhou: ${getErrorMessage(error)}`)
    }
  }

  const update = async (
    id: Identifier,
    payload: UpdateInput<TRow, TScopeKey>,
    options: MutationOptions = {}
  ): Promise<TRow | null> => {
    const { scope, select } = options
    try {
      const resolvedScope = resolveScope(table, scopeKey as string | undefined, 'update', scope)
      let query: any = supabase.from<TRow>(table).update(payload as Partial<TRow>)
      query = query.eq(idColumn as string, id)
      query = applyScope(query, scopeKey, resolvedScope)
      const { data, error } = await query.select(buildSelect(select)).maybeSingle()
      if (error) throw error
      return (data as TRow | null) ?? null
    } catch (error) {
      throw new Error(`[Supabase:${table}] update falhou: ${getErrorMessage(error)}`)
    }
  }

  const remove = async (
    id: Identifier,
    options: { scope?: FilterValue } = {}
  ): Promise<TRow | null> => {
    try {
      const resolvedScope = resolveScope(table, scopeKey as string | undefined, 'remove', options.scope)
      let query: any = supabase.from<TRow>(table).delete().eq(idColumn as string, id)
      query = applyScope(query, scopeKey, resolvedScope)
      const { data, error } = await query.select().maybeSingle()
      if (error) throw error
      return (data as TRow | null) ?? null
    } catch (error) {
      throw new Error(`[Supabase:${table}] remove falhou: ${getErrorMessage(error)}`)
    }
  }

  return {
    list,
    getById,
    create,
    update,
    remove,
  }
}

// CRUDs concretos do painel, sempre filtrados pelo psicólogo autenticado (psicologo_id).
export const psyDb = {
  traits: createCrud<Trait, 'psicologo_id'>({
    table: 'traits',
    scopeKey: 'psicologo_id',
    defaultOrder: { column: 'criado_em', ascending: false },
  }),
  quizzes: createCrud<Quiz, 'psicologo_id'>({
    table: 'quizzes',
    scopeKey: 'psicologo_id',
    defaultOrder: { column: 'criado_em', ascending: false },
  }),
  assessments: createCrud<Assessment, 'psicologo_id'>({
    table: 'assessments',
    scopeKey: 'psicologo_id',
    defaultOrder: { column: 'criado_em', ascending: false },
  }),
}

// Atalhos de tipagem para os módulos de Traits, Quizzes e Assessments.
export type TraitInsertInput = InsertInput<Trait, 'psicologo_id'>
export type TraitUpdateInput = UpdateInput<Trait, 'psicologo_id'>
export type QuizInsertInput = InsertInput<Quiz, 'psicologo_id'>
export type QuizUpdateInput = UpdateInput<Quiz, 'psicologo_id'>
export type AssessmentInsertInput = InsertInput<Assessment, 'psicologo_id'>
export type AssessmentUpdateInput = UpdateInput<Assessment, 'psicologo_id'>
