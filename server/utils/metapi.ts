import type { H3Event } from 'h3'
import type { MetapiDetail, MetapiResponse } from '~/types/metapi'

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

const success = (message: string, data?: any): MetapiResponse => {
  return {
    meta: {
      benchmark: bench(),
      success: true,
      detail: message,
    },
    data,
  }
}

const error = (event: H3Event, detail: MetapiDetail, code: number = 400): MetapiResponse => {
  setResponseStatus(event, code)
  return {
    meta: {
      benchmark: bench(),
      success: false,
      detail,
    },
    data: [],
  }
}

const notFound = (event: H3Event): MetapiResponse => error(event, 'Not Found', 404)

const renderNullError = (event: H3Event, data: any): MetapiResponse => {
  if (data === null) return error(event, 'Not Found', 404)
  return render(data)
}

const metapi = () => {
  start = performance.now()
  return { render, success, error, renderNullError, notFound }
}
export default metapi
