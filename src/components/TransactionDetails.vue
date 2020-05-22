<template>
  <div>
    <q-card style="width: 250px">
        <q-card-section class="row items-center q-pb-none">
        
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section>
          <div>
          <p>Transaction Number: {{ transaction.TransactionID }}</p>
          <p>OR Number: {{ transaction.OrNo }}</p>
          <p>Date: {{ $moment(transaction.timestamp.toDate()).format('l') }}</p>
        </div>
        <q-separator spaced></q-separator>

         <q-list dense separator>
            <q-item>
              <q-item-section>Membership Fee</q-item-section>
              <q-item-section avatar>{{ transaction.MembershipFee | currency }}</q-item-section>
            </q-item>

            <q-item>
              <q-item-section>Management Fee</q-item-section>
              <q-item-section avatar>{{ transaction.ManagementFee | currency }}</q-item-section>
            </q-item>

            <q-item>
              <q-item-section>Share Capital</q-item-section>
              <q-item-section avatar>{{ transaction.ShareCapital | currency }}</q-item-section>
            </q-item>

            <q-item>
              <q-item-section>Savings Deposit</q-item-section>
              <q-item-section avatar>{{ transaction.SavingsDeposit | currency }}</q-item-section>
            </q-item>

            <q-item v-if="transaction.isIncludeOperator">

              <q-item-section >
                <div>
                    Paid for Operator:
                    <ul>
                      <li>ManagementFee: {{ transaction.paidForOperator.ManagementFee | currency }}</li>
                      <li>ShareCapital: {{ transaction.paidForOperator.ShareCapital | currency }}</li>
                      <li>SavingsDeposit: {{ transaction.paidForOperator.SavingsDeposit | currency }} </li>
                      <li>Advances: {{ transaction.paidForOperator.Advances | currency }} </li>
                    </ul>
                </div>
              </q-item-section>
            </q-item>

            <q-item v-if="transaction.OthersDes != ''">
              <q-item-section>
                <div>
                  Other Payments: 
                  <ul>
                    <li>{{ transaction.OthersDesc }}: {{ transaction.OthersAmount | currency }}</li>
                  </ul>
                </div>
              </q-item-section>
            </q-item>

         </q-list>
          
        </q-card-section>

        <q-card-actions>
          <q-list>
            <q-item>
              <q-item-section>Amount Paid: </q-item-section>
              <q-item-section avatar>{{ transaction.AmountPaid | currency }}</q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section>Total: </q-item-section>
              <q-item-section avatar>{{ transaction.Total | currency }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-actions>
    </q-card>
  </div>
</template>
<script>
export default {
  props: {
    transaction: {
      type: Object,
      required: true,
      default: () => {
        return {
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
        }
      }
    }
  }
}
</script>
<style scoped>
p {
  margin: 0 !important;
  
}
</style>