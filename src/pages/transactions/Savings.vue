<template>
    <div>
        <q-banner class="text-white q-mb-md" :class="returnColor" v-show="returnLatest.status !== 'released'">
        <div v-if="returnLatest.status == 'approved'">
           <q-icon name="check_circle" /> Your loan request is approved ! Go to office and cash it out using this Tracking#: <b>{{returnLatest.CashReleaseTrackingID.toUpperCase()}}</b> 
        </div>
        <div v-else-if="returnLatest.status == 'rejected'">
            <q-icon name="cancel" /> Your loan request is rejected ! Reason: <b>{{returnLatest.RejectReason}}</b> 
        </div>
        <div v-else-if="returnLatest.status == 'onprocess'">
            <q-icon name="queue" /> We are currently processing your loan request. We will contact you soon via SMS once we finish looking in to your loan request. Thank you. 
        </div>
        <template v-slot:action>
            <q-btn flat color="white" label="Dismiss" @click="banner = false"/>
        </template>
        </q-banner>
        <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Account Balance
            </q-item-label>
            <q-item-label class="text-h6 text-teal">{{ returnMemberData.SavingsDeposit | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-btn 
        color="grey-10" 
        icon="account_balance_wallet" 
        label="withdraw Request" 
        :disable="canWithdrawSavings"
        class="q-my-md full-width"
        @click="openDialog"
        />
        <q-item-label header>Savings Account Transactions</q-item-label>
        <div v-for="transac in returnTransactions" :key="transac['.key']">
        <q-item clickable="" v-ripple class="cursor-pointer" :to="`/reciept/${transac['.key']}`">
            <q-item-section>
            <q-item-label class="text-uppercase">#{{ transac.baseID}}</q-item-label>
            <q-item-label caption lines="2">{{transac.baseAmount | currency }} - {{transac.baseTransaction}}</q-item-label>
            </q-item-section>
            <q-item-section side top>
            <q-item-label caption>{{ $moment(transac.baseTime).format('LL') }}</q-item-label>
            </q-item-section>
        </q-item>
        </div>        
        <!-- withdrawal application form -->
         <q-dialog v-model="withdrawDialog">
            <withdrawal-form :accountBalance="accountBalance" :MemberData="memberProfile"></withdrawal-form>
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
import { firebaseDb,firebaseAuth } from 'boot/firebase'
import { mapGetters, mapMutations } from 'vuex'

export default {
    components: {
        WithdrawalForm,
        TransactionDetails
    },
    firestore () {
        return {
            MemberData: firebaseDb.collection('MemberData'),
            Transactions: firebaseDb.collection('Transactions'),
            Applications: firebaseDb.collection('WithdrawalApplications'),
        }
    },
    data () {
        return {
            // withdrawDialog: false,
            transactionDetailsDialog: false,
            transaction: null,
            accountBalance: 0,
            accountLog: {},
            memberProfile: {}
        }
    },
    created(){
        let self = this
        firebaseAuth.onAuthStateChanged(function(user) {
            
            if (user) {
            self.accountLog = {...user}
            // self.withdrawDialog = false
            }
        })
    },
    computed: {
        // ...mapGetters('SubModule', ['currencyToNumber'], {
        //     withdrawDialog: 'getWithdrawDialog'
        // }),
        ...mapGetters('SubModule', {
            withdrawDialog: 'getWithdrawDialog',
            currencyToNumber: 'currencyToNumber'
        }),
        returnMemberData(){
            try {
                console.log(this.withdrawDialog,'dialog value')
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
                    a.baseTime = a.timestamp.toDate()
                    a.baseAmount = a.SavingsDeposit
                    a.baseID = a.TransactionID
                    a.baseTransaction = 'Savings Deposit'
                    return a.MemberID == key && a.SavingsDeposit !== 0 && a.SavingsDeposit !== undefined
                })


                let applications = this.Applications.filter(a=>{
                    a.baseTime = new Date(a.dateReleased)
                    a.baseAmount = a.Amount
                    a.baseTransaction = 'Withdraw'
                    a.baseID = a.CashReleaseTrackingID == undefined ? 'Walk-In Withdrawal' : a.CashReleaseTrackingID
                    return a.MemberID == key && a.status == 'released'
                })




                let order = this.$lodash.orderBy([...filter,...applications],a=>{
                    return a.baseTime
                },'desc')


                console.log(applications,'applications')

                return order
            } catch (error) {
                return []
            }
        },  
        returnApplications(){
            try {
                let key = this.returnMemberData['.key']
                // console.log(this.returnBillingsWithLoanPayment)
                return this.Applications.filter(a=>{
                    return a.MemberID == key
                })
            } catch (error) {
                return []
            }
        },
        returnLatest(){
            try {
                console.log(this.returnApplications)

                let applications = this.returnApplications.filter(a=>{
                    return a.status != 'released'
                })

                let latest = this.$lodash.orderBy(this.returnApplications,a=>{
                    if(a.status == "rejected"){
                        a.dateBasis = a.dateRejected.toDate()
                    }else if(a.status == "onprocess"){    
                         a.dateBasis = a.timestamp.toDate()
                    }else if(a.status == "released"){    
                         a.dateBasis = new Date(a.dateReleased)
                    } else {
                        a.dateBasis = a.dateApproved.toDate()
                    }
                    return a.dateBasis
                },'desc')



                let first = {...this.$lodash.head(latest)}
                console.log(first,'first')
                if(latest.length == 0) return {status: 'released'}
                delete first['.key']
                return first
            } catch (error) {
                console.log('returnStatus', error)
               return {} 
            }
        },
        returnColor(){
            if(this.returnLatest.status == 'onprocess') return 'bg-warning'
            else if(this.returnLatest.status == 'approved') return 'bg-primary'
            else if(this.returnLatest.status == 'rejected') return 'bg-red'
            return 'bg-teal'
        },
        canWithdrawSavings() {
            console.log(this.returnMemberData,'activev')
            if(this.returnLatest.status == 'onprocess') return true
            if(this.returnLatest.status == 'approved') return true
            return this.currencyToNumber(this.returnMemberData.SavingsDeposit) == 0
        },

    },
    methods: {
        ...mapMutations('SubModule', {
            openWithdrawDialog: 'setWithdrawDialog'
        }),
        test () {
            console.log(this.Transactions)
        },
        openDialog () {
            this.accountBalance = this.returnMemberData.SavingsDeposit
            this.memberProfile = this.returnMemberData
            // this.withdrawDialog = !this.withdrawDialog
            this.openWithdrawDialog()
        },
    }
}
</script>