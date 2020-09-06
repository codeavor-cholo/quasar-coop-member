<template>
    <q-page>
        <q-item class="bg-grey-2 q-pt-md q-px-md">
          <q-item-section>
            <q-item-label caption lines="2">Cash Advance Balance - #{{returnActiveLoans.CashReleaseTrackingID.toUpperCase()}}</q-item-label>
            <q-item-label class="text-h6 text-teal">{{returnActiveLoans.paidAmount | currency}} / {{returnMax | currency}}</q-item-label>
          </q-item-section>
            <q-item-section side top>
                <q-btn color="grey-10" flat icon="arrow_left" @click="$router.go(-1)" label="Back" dense/>
            </q-item-section> 
        </q-item> 
        <q-item class="bg-grey-2">
            <q-item-section>
                <q-linear-progress stripe rounded size="20px" :value="returnTotal" color="warning"/>
            </q-item-section>
        </q-item>
        <q-item class="bg-grey-2 q-pb-md">
            <q-item-section>
                <q-item-label caption lines="2">Due Date</q-item-label>
                <q-item-label class="text-h6 text-orange-8">{{getLatestDueDate}}</q-item-label> 
                <q-item-label caption lines="2">+ 2% Interest Rate, when unpaid after the due date.</q-item-label>
            </q-item-section>    
            <q-item-section side>
                <q-icon name="warning" color="orange-8"/>
            </q-item-section>    
        </q-item>        
        <q-item-label header>Latest Payments</q-item-label>
        <div v-for="transac in returnTransactions" :key="transac['.key']">
        <q-item clickable="" v-ripple class="cursor-pointer" :to="`/reciept/${transac['.key']}`">
            <q-item-section>
            <q-item-label>#{{transac.TransactionID}}</q-item-label>
            <q-item-label caption lines="2">{{ transac.loanRelatedAmount | currency }} </q-item-label>
            </q-item-section>
            <q-item-section side top>
            <q-item-label caption>{{ $moment(transac.timestamp.toDate()).format('l') }}</q-item-label>
            </q-item-section>
        </q-item>
        </div>          
    </q-page>
</template>
<script>
import { mapGetters } from 'vuex'
import { firebaseDb, firebaseAuth, firefirestore } from 'boot/firebase'
import { date } from 'quasar'
export default {
    data(){
        return {
            progress: .65,
            role: 'operator',
            date: '2019/02/01',
            events: [ '2019/02/01', '2019/02/05', '2019/02/06', '2019/02/09', '2019/02/23' ],
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
    firestore () {
        return {
            MemberData: firebaseDb.collection('MemberData'),
            BillingTrackers: firebaseDb.collection('BillingTrackers'),
            Transactions: firebaseDb.collection('Transactions')
        }
    },
    computed:{
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
        returnActiveLoans(){
            try{
                let loans = this.returnMemberData.activeLoans[this.$route.params.index]
                console.log(loans,'loans')
                if(loans == undefined) return []
                
                return loans
            } catch (err){
                console.log(err,'returnActiveLoans')
            }
        },
        getLatestDueDate(){
            try{
                let loanID = this.returnActiveLoans.CashReleaseTrackingID
                let memberID = this.returnMemberData['.key']

                let bills = this.BillingTrackers.filter(a=>{
                    return a.CashReleaseTrackingID == loanID && a.MemberID == memberID
                })

                let latest = this.$lodash.orderBy(bills,q=>{
                    return new Date(q.BillingDate)
                },'desc')[0]

                let plus1month = date.addToDate(new Date(latest.BillingDate),{month: 1}) 
                return date.formatDate(plus1month,'MMMM DD, YYYY')

            } catch (err) {
                console.log(err,'getLatestDueDate')
                return ''
            }
        },
        returnTransactions(){
            try {
                let key = this.returnMemberData['.key']
                let loanID = this.returnActiveLoans.CashReleaseTrackingID
                let filter = this.Transactions.filter(a=>{
                    return a.MemberID == key 
                })
                
                let loanRelated = []
                filter.forEach(q=>{
                    if(q.AdvancesAmount !== 0 && q.AdvancesAmount !== undefined){
                        let advances = q.Advances
                        advances.forEach(w=>{
                            if(loanID == w.trackID){
                                q.loanRelatedAmount = w.paidAmount
                                loanRelated.push(q)
                            }
                        })   
                    } else if (this.checkIfAvailable(q.TrackingNumber) > -1){
                        q.loanRelatedAmount = q.AmountPaid
                        loanRelated.push(q)

                    }
                })

                console.log(loanRelated,'loanRelated')
                
                let order = this.$lodash.orderBy(loanRelated,a=>{
                    return a.timestamp.toDate()
                },'desc')

                return order
            } catch (error) {
                console.log(error,'returnTransactions')
                return []
            }
        },  
        returnTotal(){
            let diff = this.returnActiveLoans.TotalBalance ?? this.returnActiveLoans.toPayAmount
            return this.returnActiveLoans.paidAmount/ diff
        },
        returnMax(){
            let diff = this.returnActiveLoans.TotalBalance ?? this.returnActiveLoans.toPayAmount
            return diff
        }
    },
    methods: {
        eventsFn (date) {
            const parts = date.split('/')
            return parts[2] % 2 === 0
        },
        optionsFn (date) {
        return date >= '2019/02/03' && date <= '2019/02/15'
        },
        checkIfAvailable(trackNo){
            let filter = this.$lodash.findIndex(this.returnBillingsWithLoanPayment,a=>{
                return a['.key'].slice(0,10).toUpperCase() == trackNo
            })
            return filter
        },

    }
}
</script>