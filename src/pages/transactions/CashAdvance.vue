<template>
    <q-page>
        <q-banner class="text-white q-mb-md" :class="returnColor" v-show="returnLatest == [] && returnLatest.Status != 'released'">
        <div v-if="returnLatest.Status == 'approved'">
           <q-icon name="check_circle" /> Your loan request is approved ! Go to office and cash it out using this Tracking#: <b>{{returnLatest.CashReleaseTrackingID}}</b> 
        </div>
        <div v-else-if="returnLatest.Status == 'rejected'">
            <q-icon name="cancel" /> Your loan request is rejected ! Reason: <b>{{returnLatest.RejectReason}}</b> 
        </div>
        <div v-else-if="returnLatest.Status == 'onprocess'">
            <q-icon name="queue" /> We are currently processing your loan request. We will contact you soon via SMS once we finish looking in to your loan request. Thank you. 
        </div>
        <template v-slot:action>
            <q-btn flat color="white" label="Dismiss" @click="banner = false"/>
        </template>
        </q-banner>
        <!-- <q-btn @click="test">test</q-btn> -->
        <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Share Capital
            </q-item-label>
            <q-item-label class="text-h6 text-teal">{{ returnMemberData.ShareCapital | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="bg-grey-2 q-pb-md">
            <q-item-section>
            <q-item-label caption lines="2">Used Cash Advance / Max Amount </q-item-label>
            <q-item-label class="text-h6 text-teal">{{ returnActiveLoansSum | currency }} / {{ returnMemberData.ShareCapital / 2 | currency }}</q-item-label>
                <q-linear-progress stripe rounded size="20px" :value="returnActiveLoansSum / (returnMemberData.ShareCapital / 2)" color="warning" class="q-mt-sm" />
            </q-item-section>
        </q-item>
        <q-btn color="grey-10" icon="payment" label="pay balance" class="q-my-md full-width" @click="test" />
        <q-btn :disable="canRequestLoan" color="grey-10" icon="money" label="request cash advance" class="full-width q-mb-sm" @click="openRequestDialog"/>
        
        <div class="text-caption text-center q-mb-md" :class="returnActiveLoansLength == 3 ? 'text-red q-px-sm' : 'text-teal'" v-show="returnLatest.Status != 'onprocess'">
            <q-icon :name="returnActiveLoansLength == 3 ? 'cancel' : 'check_circle'"/> 
            You have {{returnActiveLoansLength}} / 3 Active Loans.
            <span v-show="returnActiveLoansLength == 3">Please finish paying one of your loans. Before you can request another one.</span>
        </div>
        <div class="text-caption text-center text-warning q-px-sm" v-show="returnLatest.Status == 'onprocess'"> <q-icon name="warning" /> You still have a pending loan application. Wait for the processing to be finished before requesting another one.</div>

        <q-item-label header>Cash Advance Transactions</q-item-label>
        <div v-for="transac in returnTransactions" :key="transac['.key']">
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
            <cash-advance-form :memberid="returnMemberData['.key']"></cash-advance-form>
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

import { firebaseDb,firebaseAuth } from 'boot/firebase'
import { mapGetters, mapMutations } from 'vuex'

export default {
    components: {
        CashAdvanceForm,
        TransactionDetails
    },
    firestore () {
        return {
            MemberData: firebaseDb.collection('MemberData'),
            Transactions: firebaseDb.collection('Transactions'),
            Applications: firebaseDb.collection('LoanApplications')
        }
    },
    data () {
        return{
            progress: .6,
            banner: true,
            // requestLoanDialog: false,
            transactionDetailsDialog: false,
            accountLog: {}
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
    computed: {
        ...mapGetters('SubModule', {
            requestLoanDialog: 'getRequestLoanDialog',
            currencyToNumber: 'currencyToNumber'
        }),
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
                return this.Transactions.filter(a=>{
                    return a.MemberID == key
                })
            } catch (error) {
                return []
            }
        },
        returnApplications(){
            try {
                let key = this.returnMemberData['.key']
                return this.Applications.filter(a=>{
                    return a.MemberID == key
                })
            } catch (error) {
                return []
            }
        },
        returnLatest(){
            try {
                let applications = this.returnApplications.filter(a=>{
                    return a.Status != 'released'
                })

                let latest = this.$lodash.orderBy(this.returnApplications,a=>{
                    if(a.Status == "rejected"){
                        a.dateBasis = a.dateRejected.toDate().toString()
                    }else if(a.Status == "onprocess"){    
                         a.dateBasis = a.timestamp.toDate().toString()
                    }else if(a.Status == "released"){    
                         a.dateBasis = a.dateReleased.toDate().toString()
                    } else {
                        a.dateBasis = a.dateApproved.toDate().toString()
                    }
                    return a.dateBasis
                },'desc')



                let first = {...this.$lodash.head(latest)}
                delete first['.key']
                return first
            } catch (error) {
               return {} 
            }
        },
        returnColor(){
            if(this.returnLatest.Status == 'onprocess') return 'bg-warning'
            else if(this.returnLatest.Status == 'approved') return 'bg-primary'
            else if(this.returnLatest.Status == 'rejected') return 'bg-red'
            return 'bg-teal'
        },
        canRequestLoan () {
            console.log(this.returnMemberData,'activev')
            if(this.returnActiveLoansLength >= 3) return true
            if(this.returnLatest.Status == 'onprocess') return true
            return this.currencyToNumber(this.returnMemberData.ShareCapital) <= 7500 
        },
        returnActiveLoansLength(){
            let loans = this.returnMemberData.activeLoans
            if(loans == undefined) return 0
            return this.returnMemberData.activeLoans.length
        },
        returnActiveLoansSum(){
            let loans = this.returnMemberData.activeLoans
            if(loans == undefined) return 0
            let sum  = this.$lodash.sumBy(loans,a=>{
                return parseInt(a.Amount)
            })
            return sum
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