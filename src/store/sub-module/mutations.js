export function setTransaction (state, payload) {
  state.transaction = payload
}

export function setWithdrawDialog (state) {
  state.withdrawDialog = !state.withdrawDialog
}

export function setRequestLoanDialog (state) {
  state.requestLoanDialog = !state.requestLoanDialog
}
