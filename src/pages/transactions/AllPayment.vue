<template>
    <q-page>
        <div class="text-h6 q-pt-md q-px-md">All Transactions</div>
        <div v-for="transac in Transactions" :key="transac['.key']">
        <q-item clickable v-ripple class="cursor-pointer" @click="viewTransactionDetails(transac)">
            <q-item-section>
            <q-item-label>#{{transac.TransactionID}}</q-item-label>
            <q-item-label caption lines="2">₱ {{transac.Total}}</q-item-label>
            </q-item-section>
            <q-item-section side top>
            <q-item-label caption>{{ $moment(transac.timestamp.toDate()).format('l') }}</q-item-label>
            </q-item-section>
        </q-item>
        </div>

        <q-dialog v-model="transactionDetailsDialog">
            <transaction-details :transaction="transaction"></transaction-details>
        </q-dialog>

    </q-page>
</template>
<script>
import TransactionDetails from '../../components/TransactionDetails.vue'
import { firebaseDb } from 'boot/firebase'

export default {
    components: {
        TransactionDetails
    },
    firestore () {
        return {
            Transactions: firebaseDb.collection('Transactions').where('MemberID', '==', 'NGTSC2020012').orderBy('timestamp', 'desc')
        }
    },
    data () {
        return {
            transactionDetailsDialog: false,
            transaction: null
        }
    },
    methods: {
        viewTransactionDetails (transac) {
            
            this.$store.commit('SubModule/setTransaction', transac)
            this.$router.push('/reciept')
            // this.transaction = transac
            // this.transactionDetailsDialog = !this.transactionDetailsDialog
            
        },
    }
}
</script>
