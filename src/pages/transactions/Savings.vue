<template>
    <div>
        <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Account Balance
            </q-item-label>
            <q-item-label class="text-h6 text-teal">{{ MemberData.SavingsDeposit | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-btn 
        color="grey-10" 
        icon="account_balance_wallet" 
        label="withdraw Request" 
        class="q-my-md full-width"
        @click="openDialog"
        />
        <q-item-label header>Savings Account Transactions</q-item-label>
        <div v-for="transac in Transactions" :key="transac['.key']">
            <q-item clickable v-ripple class="cursor-pointer" @click="viewTransactionDetails(transac)">
                <q-item-section>
                <q-item-label>{{transac.TransactionID}} </q-item-label>
                <q-item-label caption lines="2">{{ transac.Total | currency }}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                <q-item-label caption>{{ $moment(transac.timestamp.toDate()).format('l')}}</q-item-label>
                </q-item-section>
            </q-item>
        </div>        
        <!-- withdrawal application form -->
         <q-dialog v-model="withdrawDialog" persistent>
            <withdrawal-form></withdrawal-form>
        </q-dialog>

        <!-- transaction details -->
        <q-dialog v-model="transactionDetailsDialog">
            <transaction-details :transaction="transaction"></transaction-details>
        </q-dialog>
    </div>
</template>
<script>
import WithdrawalForm from '../../components/WithdrawalForm.vue'
import TransactionDetails from '../../components/TransactionDetails.vue'
import { firebaseDb } from 'boot/firebase'

export default {
    components: {
        WithdrawalForm,
        TransactionDetails
    },
    firestore () {
        return {
            MemberData: firebaseDb.collection('MemberData').doc('NGTSC2020012'),
            Transactions: firebaseDb.collection('Transactions')
                        .where('MemberID', '==', 'NGTSC2020012')
                        .where('SavingsDeposit', '>', 0)
        }
    },
    data () {
        return {
            withdrawDialog: false,
            transactionDetailsDialog: false,
            transaction: null
        }
    },
    methods: {
        test () {
            console.log(this.Transactions)
        },
        openDialog () {
            this.withdrawDialog = !this.withdrawDialog
        },
        viewTransactionDetails (transaction) {
            this.transaction = transaction
            this.transactionDetailsDialog = !this.transactionDetailsDialog
        }
    }
}
</script>