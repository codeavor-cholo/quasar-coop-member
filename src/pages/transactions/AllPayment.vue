<template>
    <q-page>
        <div class="text-h6 q-pt-md q-px-md">All Transactions</div>
        <div v-for="transac in returnTransactions" :key="transac['.key']">
        <q-item clickable v-ripple class="cursor-pointer" :to="`/reciept/${transac['.key']}`">
            <q-item-section>
            <q-item-label>#{{transac.TransactionID}}</q-item-label>
            <q-item-label caption lines="2">{{transac.Total | currency}}</q-item-label>
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
import { firebaseDb,firebaseAuth } from 'boot/firebase'

export default {
    components: {
        TransactionDetails
    },
    firestore () {
        return {
            MemberData: firebaseDb.collection('MemberData'),
            Transactions: firebaseDb.collection('Transactions')
        }
    },
    created(){
        let self = this
        firebaseAuth.onAuthStateChanged(function(user) {
            
            if (user) {
            self.accountLog = {...user}
            }
        })
    },
    data () {
        return {
            transactionDetailsDialog: false,
            transaction: null,
            accountLog: {}
        }
    },
    computed: {
        returnMemberData(){
            try {
                let user = this.accountLog
                let split = user.email.split('@')
                let id = split[0].toUpperCase()

                return this.MemberData.filter(a=>{
                    return id == a['.key']
                })[0]                
            } catch (error) {
                return {}
            }
        },
        returnTransactions(){
            try {
                let key = this.returnMemberData['.key']
                let filter = this.Transactions.filter(a=>{
                    return a.MemberID == key
                })
                let order = this.$lodash.orderBy(filter,a=>{
                    return a.timestamp.toDate()
                },'desc')
                return order
            } catch (error) {
                return []
            }
        },        
    },

    methods: {
        // viewTransactionDetails (transac) {
            
        //     this.$store.commit('SubModule/setTransaction', transac)
        //     this.$router.push('/reciept')
        //     // this.transaction = transac
        //     // this.transactionDetailsDialog = !this.transactionDetailsDialog
            
        // },
    }
}
</script>
