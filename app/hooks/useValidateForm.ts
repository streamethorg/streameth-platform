import { useCallback, useEffect, useState } from 'react'
import { ZodTypeAny, ZodError } from 'zod'

const useValidateForm = (formState: unknown, ValidationSchema: ZodTypeAny, isNestedSchema = false) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({})
  const [hasAttemptedFormSubmit, setHasAttemptedFormSubmit] = useState(false)

  const validateForm = useCallback(() => {
    if (!hasAttemptedFormSubmit) setHasAttemptedFormSubmit(true)
    const result = ValidationSchema.safeParse(formState)
    if ('error' in result) {
      const error: ZodError = result.error
      if (isNestedSchema) {
        setValidationErrors(error.format())
      } else {
        setValidationErrors(formatZodFieldErrors(error.flatten().fieldErrors))
      }
      return false
    } else {
      setValidationErrors({})
      return true
    }
  }, [formState, hasAttemptedFormSubmit, ValidationSchema, isNestedSchema])

  useEffect(() => {
    if (hasAttemptedFormSubmit) validateForm()
  }, [formState, hasAttemptedFormSubmit, validateForm])

  return {
    validationErrors,
    validateForm,
    setValidationErrors,
    setHasAttemptedFormSubmit,
    hasAttemptedFormSubmit,
  }
}

export const formatZodFieldErrors = (fieldErrors: Record<string, any>) => {
  const formattedErrors: Record<string, any> = {}

  for (let key in fieldErrors) {
    formattedErrors[key] = fieldErrors[key][0]
  }
  return formattedErrors
}

export default useValidateForm
