export interface MetApiResponse {
  meta: {
    benchmark: string
    success: boolean
    detail?: string
  }
  data: any
}
