import type { H3Event } from 'h3'

export interface MetapiResponse {
  meta: {
    benchmark: string
    success: boolean
    detail?: string
  }
  data: any
}

let start: number | undefined

const bench = (): string => {
  const end = performance.now()
  return start ? `${(end - start).toFixed(3)}ms` : 'n/a'
}

const render = (data: any): MetapiResponse => {
  return {
    meta: {
      benchmark: bench(),
      success: true,
    },
    data,
  }
}

const success = (message: string): MetapiResponse => {
  return {
    meta: {
      benchmark: bench(),
      success: true,
      detail: message,
    },
    data: [],
  }
}

const error = (event: H3Event, message: string, code: number = 400): MetapiResponse => {
  setResponseStatus(event, code)
  return {
    meta: {
      benchmark: bench(),
      success: false,
      detail: message,
    },
    data: [],
  }
}

const renderNullError = (event: H3Event, data: any): MetapiResponse => {
  if (data === null) return error(event, 'Not Found', 404)
  return render(data)
}

const init = () => {
  start = performance.now()
  return { render, success, error, renderNullError }
}

export const metapi = {
  init,
  render,
  error,
  renderNullError,
}
