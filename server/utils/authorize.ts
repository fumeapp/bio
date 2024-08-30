type PolicyFunction<T extends object> = (args: T) => boolean

export function authorize<T extends object>(
  policyFunction: PolicyFunction<T>,
  args: T,
): void {
  if (!policyFunction(args))
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}
