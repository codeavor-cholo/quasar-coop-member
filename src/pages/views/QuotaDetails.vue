<template>
    <q-page>
        <q-item class="bg-grey-2 q-pt-md q-px-md">
          <q-item-section>
            <q-item-label class="text-h6">{{returnQuotaBalanceUnit.unit}}</q-item-label>
            <q-item-label caption lines="2">Monthly Quota Balance ( {{returnQuotaBalanceUnit.remainingDays}} Days Left )</q-item-label>
            <q-item-label class="text-h6 text-teal">{{returnQuotaBalanceUnit.quotaTotalPaid | currency}} / {{returnQuotaBalanceUnit.quotaTotalPayment | currency}}</q-item-label>
          </q-item-section>
            <q-item-section side top>
                <q-btn color="grey-10" flat icon="arrow_left" @click="$router.go(-1)" label="Back" dense/>
            </q-item-section> 
        </q-item> 
        <q-item class="bg-grey-2">
            <q-item-section>
                <q-linear-progress stripe rounded size="20px" :value="returnQuotaBalanceUnit.progress" color="warning"/>
            </q-item-section>
        </q-item>
        <q-item class="bg-grey-2 q-pb-md">
            <q-item-section>
                <q-item-label caption lines="2">Unpaid Balance</q-item-label>
                <q-item-label class="text-h6 text-orange-8">{{returnQuotaBalanceUnit.quotaBalance | currency}} / {{returnQuotaBalanceUnit.remainingDays}} Unpaid Days</q-item-label> 
            </q-item-section>    
            <q-item-section side>
                <q-icon name="warning" color="orange-8"/>
            </q-item-section>    
        </q-item>
        
        <q-date
            v-model="date"
            :events="eventsFn"
            minimal=""
            flat
            class="full-width"
            :options="optionsFn"
            :today-btn="false"
            disable=""
            event-color="orange-8"
        />

        <div class="q-pa-md row justify-around text-grey-6">
           <span><q-chip color="orange-8" size="xs" /> Unpaid Days</span> 
           <span><span class="text-grey-3 q-pa-xs"> 12 </span> Paid Days </span> 
        </div>
        <q-item-label header>Latest 10 Transactions</q-item-label>
        <div v-for="n in returnLatestTransactions.slice(0, 10)" :key="n['.key']">
        <q-item clickable="" v-ripple class="cursor-pointer" :to="`/reciept/${n['.key']}`">
            <q-item-section>
            <q-item-label>#{{n.TransactionID}}</q-item-label>
            <q-item-label caption lines="2">
                {{n.ManagementFee | currency}}
            </q-item-label>
            </q-item-section>
            <q-item-section side top>
            <q-item-label caption>{{$moment(n.timestamp.toDate()).format('MMM DD,YYYY')}}</q-item-label>
            </q-item-section>
        </q-item>
        </div>           
    </q-page>
</template>
<script>
import { firebaseDb, firebaseAuth, firefirestore } from 'boot/firebase'
import { date } from 'quasar'
export default {
    data(){
        return {
            progress: .2,
            role: 'operator',
            date: date.formatDate(new Date(),'YYYY/MM/DD'),
            events: [ '2019/02/01', '2019/02/05', '2019/02/06', '2019/02/09', '2019/02/23' ],
            unitKey: '',
            accountLog: {}
        }
    },
    created(){
        this.unitKey = this.$route.params.id
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
        Transactions: firebaseDb.collection('Transactions'),
        BillingTrackers: firebaseDb.collection('BillingTrackers'),
        PayLater: firebaseDb.collection('PayLater'),
        JeepneyData: firebaseDb.collection('JeepneyData'),
        ManagementFeeDriver: firebaseDb.collection('FixedPayments').doc('ManagementFeeDriver'),
        ManagementFeeOperator: firebaseDb.collection('FixedPayments').doc('ManagementFeeOperator'),
        // InterestRates: firebaseDb.collection('FixedPayments').doc('InterestRates'),
        }
    },
    computed:{
        returnQuotaBalanceUnit(){
            try {
                let quota = {remainingDays: 0, quotaBalance: 0, progress: 0}
                let today = new Date()
                let start = date.startOfDate(today, 'month')
                let end = date.endOfDate(today, 'month')

                console.log(end,start)

                let transactions = this.returnLatestTransactions.filter(a=>{
                let base = a.timestamp.toDate()
                if (date.isBetweenDates(base, start, end, { inclusiveFrom: true, inclusiveTo: true })) {
                    
                    if(a.jeepneyDetails){
                        // console.log(a,'jeep with quota')
                        return a.ManagementFee !== 0 && a.jeepneyDetails['.key'] == this.unitKey
                    }
                }
                })

                console.log(transactions,'transactions')

                let managementFee = this.returnMemberData.Designation == 'Driver' ? this.ManagementFeeDriver.amount : this.ManagementFeeOperator.amount

                // recompute
                let sumQuota = this.$lodash.sumBy(transactions,a=>{
                return parseFloat(a.ManagementFee)
                })


                if(transactions.length <= 18){
                    quota.remainingDays = 18 - transactions.length
                    quota.quotaBalance = (18 - transactions.length) * managementFee
                    quota.progress = transactions.length/18
                    quota.quotaTotalPayment = sumQuota + (quota.remainingDays * managementFee)
                    quota.quotaTotalPaid = sumQuota
                    quota.unit = this.returnJeepDetails(this.unitKey).PlateNumber
                }

                // console.log(transactions,'returnQuotaBalance - transactions')
                //get number of days paid
                //get amount of management fee
                // console.log(quota,'quota')
                return quota
            } catch (error) {
                console.log(error,'returnQuotaBalance')
                return {remainingDays: 0, quotaBalance: 0, progress: 0}
            }
        }, 
        returnLatestTransactions(){
            try {
                let account = this.returnMemberData
                console.log(account,'account')
                let transactions = this.Transactions.filter(a=>{
                    if(a.jeepneyDetails){
                        return a.MemberID == account['.key'] && a.jeepneyDetails['.key'] == this.unitKey
                    }
                })

                return this.$lodash.orderBy(transactions,q=>{
                return q.timestamp.toDate()
                },'desc')
            } catch (error) {
                console.log(error,'returnLatestTransactions')
                return []
            }
        },  
        returnMemberData(){
            try {
                let user = firebaseAuth.currentUser == null ? this.accountLog : firebaseAuth.currentUser 
                let split = user.email.split('@')
                let id = split[0].toUpperCase()

                if(user){

                } else {
                return {
                    FirstName: '',
                    LastName: '',
                    Designation: ''
                }
                }


                return this.MemberData.filter(a=>{
                return id == a['.key']
                })[0]
            } catch (error) {
                console.log(error,'err')
                return {
                FirstName: '',
                LastName: '',
                Designation: ''
                }
            }
        }      
    },
    methods: {
        eventsFn (dates) {
            console.log(dates,'dates')
            let start = date.startOfDate(dates, 'month')
            let end = date.endOfDate(dates, 'month')
            console.log(start,'start')
            console.log(end,'end')

            let transactions = this.returnLatestTransactions.filter(a=>{
                return date.formatDate(dates,'YYYY/MM/DD') == date.formatDate(a.timestamp.toDate(),'YYYY/MM/DD')
            })

            if(transactions.length > 0){
                console.log('meron')
                return false
            } else {
                return true
            }

        },
        optionsFn (dates) {
            let start = date.startOfDate(dates, 'month')
            let end = date.endOfDate(dates, 'month')
            let transactions = this.returnLatestTransactions.filter(a=>{
                return date.formatDate(dates,'YYYY/MM/DD') == date.formatDate(a.timestamp.toDate(),'YYYY/MM/DD')
            })

            if(transactions.length > 0){
                console.log('meron')
                return false
            } else {
                return true
            }
        },
        returnJeepDetails(key){
            return this.JeepneyData.filter(a=>{return a['.key'] == key})[0]
        }
    }
}
</script>