export const createRegex = (extraChars = '') => {
  const basePattern = 'A-ZÁÉÍÓÚÜÑáéíóúüña-z0-9 '
  const escapedExtraChars = extraChars.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const pattern = `^[${basePattern}${escapedExtraChars}]+$`
  return new RegExp(pattern)
}
