<template>
  <div>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
      <span class="text-h6">Cash Advance Request Form</span>
      <q-space />
      <q-btn icon="close" flat round dense @click="closeLoanDialog" />
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
          >
          <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Cash Advance Balance
            </q-item-label>
            <q-item-label class="text-h6 text-teal">{{ cashAdvanceBalance | currency }}</q-item-label>
            </q-item-section>
          </q-item>
          

          <q-field
            class="q-pt-md"
            filled
            v-model="amount"
            label="Amount "
            prefix="P"
            lazy-rules
            :rules="[
              val => currencyToNumber(val) > 0 || 'Please enter amount',
              val => currencyToNumber(val) <= cashAdvanceBalance || 'Invalid amount'
            ]"
          >
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <input auto-focus :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
            </template>
          </q-field>       

          <q-field
            filled
            v-model="dailyCharge"
            label="Daily Charge"
            prefix="P"
            lazy-rules
            :rules="[
              val => currencyToNumber(val) > 0 || 'Please enter daily charge',
              val => currencyToNumber(val) < cashAdvanceBalance || 'Invalid amount'
            ]"
          >
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
            </template>
          </q-field>
          <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">To Pay Amount</q-item-label>
            <q-item-label class="text-h6 text-teal">{{ cashAdvanceToPayAmount | currency }}</q-item-label>
            <q-item-label caption lines="2">Request Amount + 2 Months Interest ({{InterestRates.amount * 2}}%)</q-item-label>
            </q-item-section>
          </q-item>
                    
          <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Remaining Balance:
             <b>{{ cashAdvanceBalance - currencyToNumber(amount) | currency }}</b> 
            </q-item-label>
            <q-item-label caption lines="2">Estimated Days to Pay:
             <b>{{ showDays }} Days</b> 
            </q-item-label>
            <q-item-label caption lines="2" class="text-warning q-pt-sm">
              <q-icon name="info" /> {{InterestRates.amount}}% Interest Rates will be applied 2 months after the cash advance is released. 
            </q-item-label>
            </q-item-section>
          </q-item>  




          <div>
            <div class="q-pb-sm text-grey-8">Reason:</div>
            <q-option-group
              :options="options"
              label="Reason"
              type="radio"
              v-model="reason"
              dense
            >
            
            </q-option-group>
            <q-input
              v-if="reason === 'other reason'"
              v-model="text"
              filled
              autogrow
              placeholder="Iba pang rason"
              class="q-mt-sm"
            />
          </div>
          

          <!-- <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Remaining Balance
            </q-item-label>
            <q-item-label class="text-h6 text-teal">₱ 5000.00</q-item-label>
            </q-item-section>
          </q-item> -->

          <q-checkbox v-model="checkGuidelines" color="teal" class="bg-grey-2 q-pa-sm text-caption" label="By checking this, you agree to all coop's guidelines regarding cash advances." />

          <q-btn class="full-width q-my-sm" :color="showGuidelines ? 'grey' : 'teal'" :icon="showGuidelines ? 'close' : 'send'" dense flat :label="showGuidelines ? 'close guidelines' : 'read guidelines'" size="sm" @click="showGuidelines = !showGuidelines" />

          <div class="bg-grey-2 q-pa-md q-my-none text-grey-6" v-show="showGuidelines">
            <b>Guidelines for Cash Advances</b>
            <ol class="text-caption">
              <li> Only members with Share Capital of {{this.ShareOfStocksMin.amount}} or more can Cash Advance.</li>
              <li> Members has to fill-up a Cash Advance Application Form.</li>
              <li> Members can Cash Advance half of their total Share Capital. 

                <div class="q-my-sm">a. Members with existing balances can still Cash Advance as long as their total balance doesn't exceed the half of their Share Capital.
                </div>
                <div  class="q-mb-sm">
                  b. Each Cash Advances wil be applied interest separately.
                </div>
              </li>
              <li> Members will state the exact amount they will pay regularly to pay their balance in Cash Advance on their application. </li>
              <li> Cash Advances has fixed interest of {{this.InterestRates.amount}}% per month.</li>
              <li> Cash advances has no fixed term or payment method.</li>
            </ol>
          </div>


          <div>
              <q-btn label="Submit" type="submit" color="primary" class="full-width" :disable="canSubmit"/>
              <q-btn label="cancel" flat color="grey" class="full-width q-mt-sm" @click="closeLoanDialog"/>
          </div>
          </q-form>
      </q-card-section>
  </q-card>
  </div>
</template>
<script>
import { VMoney } from 'v-money'

import { firefirestore, firebaseDb, firebaseAuth } from 'boot/firebase'
import { mapGetters, mapMutations } from 'vuex'

export default {
  directives: {
    money: VMoney
  },
  props: ['memberid'],
  firestore () {
    return {
      MemberData: firebaseDb.collection('MemberData').doc(this.memberid),
      InterestRates: firebaseDb.collection('FixedPayments').doc('InterestRates'),
      ShareOfStocksMin: firebaseDb.collection('FixedPayments').doc('ShareOfStocksMin')
    }
  },
  data () {
    return {
      amount: '',
      dailyCharge: '',
      reason: null,
      options: [
        { label: 'Pang-tubos ng lisensya', value: 'ransom license' },
        { label: 'Pang-oberhol ng makina/pang-kumpuni ng jeep', value: 'jeep maintenance'},
        { label: 'Pang-matrikula sa anak', value: 'tuition'},
        { label: 'Pang-gastos para sa pamilya', value: 'family expense'},
        { label: 'Iba pang rason', value: 'other reason' }
      ],
      text: '',
      moneyFormatForDirective: {
        decimal: '.',
        thousands: ',',
        precision: 0,
        masked: false /* doesn't work with directive */
      },
      checkGuidelines: false,
      showGuidelines: false,
      accountLog: null,
      memberDataYes: null,
      idYeah: ''
    }
  },
  created(){
    let self = this
    self.accountLog = {...firebaseAuth.currentUser}

  },
  computed: {
    ...mapGetters('SubModule', ['currencyToNumber']),
    returnActiveLoansSum(){
        let loans = this.MemberData.activeLoans
        if(loans == undefined) return 0
        let sum  = this.$lodash.sumBy(loans,a=>{
            return parseInt(a.Amount)
        })
        return sum
    },
    cashAdvanceBalance () {
      return (this.currencyToNumber(this.MemberData.ShareCapital) / 2) - this.returnActiveLoansSum
    },
    cashAdvanceToPayAmount (){
      let request = this.currencyToNumber(this.amount)
      return request + this.percentage(request,(this.InterestRates.amount * 2))
    },
    canSubmit(){
      return this.amount == '0' || this.dailyCharge == '0' || this.reason == null || this.checkGuidelines == false
    },
    showDays(){
      try {
        let charge = this.currencyToNumber(this.dailyCharge)
        if(charge == 0) return 0
        let days = this.currencyToNumber(this.cashAdvanceToPayAmount) / charge
        if(isNaN(days) == true) return 0  
        return Math.round(days)
      } catch (error) {
        return 0
      }
    }
  },
  methods: {

    ...mapMutations('SubModule', {
      closeLoanDialog: 'setRequestLoanDialog'
    }), 
    percentage(num, per)
    {
      return (num/100)*per;
    },    
    test () {
      console.log(this.reason)
    },
    onSubmit () {
      if (this.reason != null) {
        this.$q.dialog({
          title: 'Cash Advance Confirmation',
          message: `Would you like to cash advance P ${this.amount}?`,
          cancel: true,
          persistent: true
        }).onOk(() => {
          console.log('>>>> OK')
          const loan = {
            toPayAmount: this.cashAdvanceToPayAmount,
            MemberID: this.MemberData['.key'],
            FirstName: this.MemberData.FirstName,
            LastName: this.MemberData.LastName,
            Designation: this.MemberData.Designation,
            Amount: this.amount.replace(/[^a-zA-Z0-9]/g, ""),
            EstimatedDays: this.showDays,
            DailyCharge: this.dailyCharge.replace(/[^a-zA-Z0-9]/g, ""),
            Reason: this.reason,
            Status: 'onprocess',
            DateRelease: null,
            timestamp: firefirestore.FieldValue.serverTimestamp()
          }
          console.log(loan,'loan details')
          firebaseDb.collection('LoanApplications').add(loan)
            .then(() => {
              this.$q.notify({
                icon: 'info',
                message: 'Application succesfully submitted please wait for confirmation.',
                color: 'positive'
              })
              this.closeLoanDialog()
            })
        })
      } else {
        this.$q.notify({
          icon: 'info',
          message: 'Please select reason',
          color: 'info'
        })
      }
      
    },

  }
}
</script>