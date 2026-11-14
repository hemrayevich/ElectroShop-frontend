import { ref, reactive } from 'vue'

/**
 * Form state management composable with client and 422 server validation handling.
 *
 * @param {Object} initialValues Initial key-value mapping of form fields
 * @param {Object} validationRules Mapping of field names to array of validator functions
 */
export function useForm(initialValues = {}, validationRules = {}) {
  const values = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})
  const submitting = ref(false)
  const generalError = ref('')

  function validateField(field) {
    touched[field] = true
    const rules = validationRules[field]
    if (!rules) {
      delete errors[field]
      return true
    }

    const rulesList = Array.isArray(rules) ? rules : [rules]
    for (const rule of rulesList) {
      if (typeof rule === 'function') {
        const err = rule(values[field], values)
        if (err) {
          errors[field] = err
          return false
        }
      }
    }

    delete errors[field]
    return true
  }

  function validate() {
    let isValid = true
    for (const field of Object.keys(validationRules)) {
      touched[field] = true
      const ok = validateField(field)
      if (!ok) {
        isValid = false
      }
    }
    return isValid
  }

  function setFieldError(field, message) {
    touched[field] = true
    errors[field] = message
  }

  function clearErrors() {
    for (const key of Object.keys(errors)) {
      delete errors[key]
    }
    generalError.value = ''
  }

  function setServerErrors(apiError) {
    if (apiError?.errors && typeof apiError.errors === 'object') {
      for (const [field, messages] of Object.entries(apiError.errors)) {
        touched[field] = true
        errors[field] = Array.isArray(messages) ? messages[0] : String(messages)
      }
    }

    if (apiError?.message) {
      generalError.value = apiError.message
    }
  }

  function reset(newValues = {}) {
    for (const key of Object.keys(values)) {
      delete values[key]
    }
    Object.assign(values, initialValues, newValues)
    clearErrors()
    for (const key of Object.keys(touched)) {
      delete touched[key]
    }
    submitting.value = false
  }

  function handleBlur(field) {
    validateField(field)
  }

  async function handleSubmit(onSubmit) {
    clearErrors()
    if (!validate()) {
      return false
    }

    submitting.value = true
    try {
      await onSubmit(values)
      return true
    } catch (err) {
      if (err?.status === 422) {
        setServerErrors(err)
      } else {
        generalError.value = err?.message || 'Произошла ошибка при отправке формы'
      }
      return false
    } finally {
      submitting.value = false
    }
  }

  return {
    values,
    errors,
    touched,
    submitting,
    generalError,
    validateField,
    validate,
    setFieldError,
    clearErrors,
    setServerErrors,
    reset,
    handleBlur,
    handleSubmit,
  }
}

export default useForm
