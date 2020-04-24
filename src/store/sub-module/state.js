export default function () {
  return {
    transaction: {
      TransactionID: '',
      OrNo: '',
      timestamp: '',
      MembershipFee: '',
      ManagementFee: '',
      ShareCapital: '',
      SavingsDeposit: '',
      Advances: '',
      OthersDes: '',
      OtherAmount: '',
      AmountPaid: '',
      Total: '',
      isIncludeOperator: false,
      paidForOperator: {
        Advances: '',
        ManagementFee: '',
        SavingsDeposit: '',
        ShareCapital: ''
      }
    },
    withdrawDialog: false,
    requestLoanDialog: false,
  }
}
