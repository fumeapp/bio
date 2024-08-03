export interface Metapi {
    _meta: {
        benchmark: string
    }
    data: any
}

let start:number|undefined = undefined

const r = (data: any) => {
    let end = performance.now()
    return {
        _meta: { benchmark: start ? `${(end - start).toFixed(3)}ms` : 'n/a', },
        data: data,
    }
}

const i = () => {
    start = performance.now()
    return { r }
}


export const metapi = {
    i,
    r,
}