<template>
  <div>
    <q-card>
      <q-card-section class="row items-center q-pb-none">

      <q-space />
      <q-btn icon="close" flat round dense @click="closeWithdrawDialog()" />
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
          >
          <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Account Balance
            </q-item-label>
            <q-item-label class="text-h6 text-teal">{{ accountBalance | currency }}</q-item-label>
            </q-item-section>
          </q-item> 
          <q-field
            filled
            v-model="amount"
            label="Amount "
            prefix="P"
          >
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <input :id="id" class="q-field__input text-left" :value="value" @change="e => emitValue(e.target.value)" v-money="moneyFormatForDirective" v-show="floatingLabel">
            </template>
          </q-field>

          <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Remaining Balance
            </q-item-label>
            <q-item-label 
              :class="{'text-h6': true, 'text-teal': remainingBalance >= 0, 'text-red': remainingBalance < 0 }"
            >
              {{ remainingBalance | currency }}
              </q-item-label>
            </q-item-section>
          </q-item>

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
import { firebaseDb, firefirestore } from 'boot/firebase'
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    accountBalance: {
      type: Number,
      required: true,
      default: 0
    }
  },
  directives: {
    money: VMoney
  },
  data () {
    return {
      amount: 0,
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
    remainingBalance () {
      return this.currencyToNumber(this.accountBalance) - this.currencyToNumber(this.amount)
    }
  },
  methods: {
    ...mapMutations('SubModule', {
      closeWithdrawDialog: 'setWithdrawDialog'
    }),
    onSubmit () {
      if (this.remainingBalance >= 0) {
        this.$q.dialog({
          title: 'Withdrawal Confirmation',
          message: `Would you like to withdraw P ${this.amount} savings?`,
          cancel: true,
          persistent: true
        }).onOk(() => {
          console.log('>>>> OK')
          const withdraw = {
            MemberID: this.MemberData['.key'],
            SavingsDeposit: this.accountBalance,
            Amount: this.amount,
            RemainingBalance: this.remainingBalance,
            timestamp: firefirestore.FieldValue.serverTimestamp(),
            status: 'onprocess',
            dateRelease: null
          }
          firebaseDb.collection('WithdrawalApplications').add(withdraw)
            .then(async () => {
              await firebaseDb.collection('MemberData').doc('NGTSC2020012').update({
                SavingsDeposit: firefirestore.FieldValue.increment(-Math.abs(this.amount))
              })
              this.$q.notify({
                icon: 'info',
                message: 'Application submitted please wait for the confirmation.',
                color: 'positive'
              })
              this.closeWithdrawDialog()
            })
        })
      } else {
        this.$q.notify({
          icon: 'info',
          message: 'Invalid Amount',
          color: 'negative'
        })
      }
      
    }
  }
}
</script>