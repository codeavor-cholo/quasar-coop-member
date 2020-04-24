<template>
  <div>
    <q-card>
      <q-card-section class="row items-center q-pb-none">

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
            filled
            v-model="amount"
            label="Amount "
            prefix="P"
            lazy-rules
            :rules="[
              val => currencyToNumber(val) > 0 || 'Please enter amount',
              val => currencyToNumber(val) < cashAdvanceBalance || 'Invalid amount'
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
          <div>
            <span>Reason</span>
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
            />
          </div>
          

          <!-- <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Remaining Balance
            </q-item-label>
            <q-item-label class="text-h6 text-teal">₱ 5000.00</q-item-label>
            </q-item-section>
          </q-item> -->

          <div>
              <q-btn label="Submit" type="submit" color="primary" class="full-width"/>
          </div>
          </q-form>
      </q-card-section>
  </q-card>
  </div>
</template>
<script>
import { VMoney } from 'v-money'

import { firefirestore, firebaseDb } from 'boot/firebase'
import { mapGetters, mapMutations } from 'vuex'

export default {
  directives: {
    money: VMoney
  },
  firestore () {
    return {
      MemberData: firebaseDb.collection('MemberData').doc('NGTSC2020012'),
      Transactions: firebaseDb.collection('Transactions')
                        .where('Advances', '>', 0)
                        .where('MemberID', '==', 'NGTSC2020012')
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
      }
    }
  },
  computed: {
    ...mapGetters('SubModule', ['currencyToNumber']),
    cashAdvanceBalance () {
      return this.currencyToNumber(this.MemberData.ShareCapital) / 2
    }
  },
  methods: {
    ...mapMutations('SubModule', {
      closeLoanDialog: 'setRequestLoanDialog'
    }), 
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
            MemberID: this.MemberData['.key'],
            Amount: this.amount,
            DailyCharge: this.dailyCharge,
            Reason: this.reason,
            Status: 'onprocess',
            DateRelease: null,
            timestamp: firefirestore.FieldValue.serverTimestamp()
          }
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
      
    }
  }
}
</script>