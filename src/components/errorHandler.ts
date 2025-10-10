export const showError = (
  message: string,
  errorElement: HTMLDivElement,
): void => {
  errorElement.textContent = message
}

// error handling
export const clearError = (errorElement: HTMLDivElement): void => {
  errorElement.textContent = ''
}
