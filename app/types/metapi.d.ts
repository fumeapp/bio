export interface MetapiResponse<T = any> {
  meta: {
    benchmark: string
    success: boolean
    detail?: MetapiDetail
  }
  data: T
}

export type MetapiDetail = string | import('zod').ZodIssue[]
