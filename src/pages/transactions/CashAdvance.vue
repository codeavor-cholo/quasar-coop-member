<template>
    <q-page>
        <q-btn @click="test">test</q-btn>
        <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Share Capital
            </q-item-label>
            <q-item-label class="text-h6 text-teal">{{ MemberData.ShareCapital | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="bg-grey-2 q-pb-md">
            <q-item-section>
            <q-item-label caption lines="2">Cash Advance Balance</q-item-label>
            <q-item-label class="text-h6 text-teal">{{ MemberData.Advances | currency }} / ₱ 1000.00</q-item-label>
                <q-linear-progress stripe rounded size="20px" :value="progress" color="warning" class="q-mt-sm" />
            </q-item-section>
        </q-item>
        <q-btn color="grey-10" icon="payment" label="pay balance" class="q-my-md full-width"  />
        <q-btn :disable="canRequestLoan" color="grey-10" icon="money" label="request cash advance" class="full-width q-mb-md" @click="openRequestDialog" />
        <q-item-label header>Cash Advance Transactions</q-item-label>
        <div v-for="transac in Transactions" :key="transac['.key']">
        <q-item clickable="" v-ripple class="cursor-pointer" @click="viewTransactionDetails(transac)">
            <q-item-section>
            <q-item-label>#{{transac.TransactionID}}</q-item-label>
            <q-item-label caption lines="2">{{ transac.Total | currency }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
            <q-item-label caption>{{ $moment(transac.timestamp.toDate()).format('l') }}</q-item-label>
            </q-item-section>
        </q-item>
        </div> 
        <!-- request loan -->
        <q-dialog v-model="requestLoanDialog" persistent>
            <cash-advance-form></cash-advance-form>
        </q-dialog>

        <!-- view transaction details -->
        <q-dialog v-model="transactionDetailsDialog">
            <transaction-details></transaction-details>
        </q-dialog>

    </q-page>
</template>
<script>
import CashAdvanceForm from '../../components/CashAdvanceForm.vue'
import TransactionDetails from '../../components/TransactionDetails.vue'

import { firebaseDb } from 'boot/firebase'
import { mapGetters, mapMutations } from 'vuex'

export default {
    components: {
        CashAdvanceForm,
        TransactionDetails
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
        return{
            progress: .6,
            // requestLoanDialog: false,
            transactionDetailsDialog: false
        }
    },
    computed: {
        ...mapGetters('SubModule', {
            requestLoanDialog: 'getRequestLoanDialog',
            currencyToNumber: 'currencyToNumber'
        }),
        canRequestLoan () {
            return this.currencyToNumber(this.MemberData.ShareCapital) <= 7500 || this.currencyToNumber(this.MemberData.Advances)
        }
    },
    methods: {
        ...mapMutations('SubModule', {
            openLoanDialog: 'setRequestLoanDialog'
        }),
        test () {
            console.log(this.canRequestLoan)
        },
        openRequestDialog () {
            // this.requestLoanDialog = !this.requestLoanDialog
            this.openLoanDialog()
        },
        viewTransactionDetails (transac) {
            this.$store.commit('SubModule/setTransaction', transac)
            this.$router.push('/reciept')
            // this.transactionDetailsDialog = !this.transactionDetailsDialog
        }
    }
}
</script>