export interface MetapiResponse<T = any> {
  meta: {
    benchmark: string
    success: boolean
    detail?: string | import('zod').ZodIssue[]
  }
  data: T
}
