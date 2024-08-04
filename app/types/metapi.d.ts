export interface MetapiResponse<T> {
  meta: {
    benchmark: string
    success: boolean
    detail?: string
  }
  data: T
}
