export function getTransaction (state) {
  return state.transaction
}

export function getWithdrawDialog (state) {
  return state.withdrawDialog
}

export function getRequestLoanDialog (state) {
  return state.requestLoanDialog
}
export const currencyToNumber = () => (value) => {
  const isString = typeof value
  if (isString === 'string') {
    let val = value.toString()
    return parseInt(val.replace(/\,/g,''))
  }
  return value
  
}
