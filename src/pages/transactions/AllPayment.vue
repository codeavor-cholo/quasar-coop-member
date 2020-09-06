<template>
    <q-page>
        <div class="text-h6 q-py-md q-px-md">All Transactions
            <q-btn color="grey-10" icon="sort" label="filter" outline="" @click="adjustDate = true" class="float-right" />
        </div>

        <q-item class="bg-grey-2 q-pt-md q-mx-md" v-show="returnFilterLabel !== ''">
            <q-item-section>
            <q-item-label caption lines="2">Filter:</q-item-label>
            <q-item-label class="text-overline" lines="2">{{ returnFilterLabel }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
                <q-btn color="grey-10" icon="close" flat @click="goFilter = false,resetDates" />
            </q-item-section>
        </q-item>  

        <q-item class="bg-grey-2 q-mx-md q-mb-md q-py-md">
            <q-item-section>
            <q-item-label caption lines="2">Transactions Total Amount
            </q-item-label>
            <q-item-label class="text-h6 text-teal">{{ returnTransactionsTotal | currency }}</q-item-label>
            </q-item-section>
        </q-item>  

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

        <q-dialog v-model="adjustDate" persistent>
          <q-card style="width:90vw" class="q-pa-sm">
            <q-card-section class="">
                <div class="text-h6">Filter Date</div>
                <q-btn-toggle
                class="q-mt-md"
                v-model="dateButtonOption"
                toggle-color="teal"
                :options="[
                    {label: 'by date', value: 'byDate'},
                    {label: 'date range', value: 'dateRange'},
                    {label: 'month & year', value: 'monthYear'},
                ]"
                @input="goFilter = false"
                />
            </q-card-section>
            <q-card-section class="row items-center" v-if="dateButtonOption == 'byDate'">
                <q-input v-model="filterDateInput" type="date" label="Date" outlined="" class="col q-mr-md" color="teal" :rules="[val => !!val || 'Field is required']"/>
            </q-card-section>
            <q-card-section class="row q-gutter-md" v-else-if="dateButtonOption == 'monthYear'">
                <q-select v-model="monthYear" :options="returnMonth" label="Month / Year" filled class="col"/>
            </q-card-section>
            <q-card-section class="col q-gutter-sm items-center" v-else>
                <q-input v-model="filterDateFrom" type="date" label="From" outlined="" class="col" color="teal" :rules="[val=> new Date(val) < new Date(this.filterDateTo) || 'Check Your Date Range',val => !!val || 'Field is required']"/>
                <q-input v-model="filterDateTo" type="date" label="To" outlined="" class="col" color="teal" :rules="[val=> new Date(val) > new Date(this.filterDateFrom) || 'Check Your Date Range',val => !!val || 'Field is required',val=> new Date(val) < new Date() || `There is no payment records in the future. Please select today's date for the date range maximum.`]"/>
            </q-card-section>

            <q-card-actions align="right" class="row justify-between">
              <q-btn flat label="remove filter" color="grey-10" icon="close" v-close-popup @click="goFilter = false,resetDates" v-show="goFilter"/>
              <q-btn flat label="done" color="teal" v-close-popup @click="showInputData"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
        

        <q-dialog v-model="transactionDetailsDialog">
            <transaction-details :transaction="transaction"></transaction-details>
        </q-dialog>

    </q-page>
</template>
<script>
import TransactionDetails from '../../components/TransactionDetails.vue'
import { firebaseDb,firebaseAuth } from 'boot/firebase'
import { date } from 'quasar'

export default {
    components: {
        TransactionDetails
    },
    data () {
        return {
            monthYear: date.formatDate(new Date(),'MMMM YYYY'),
            adjustDate: false,
            transactionDetailsDialog: false,
            transaction: null,
            accountLog: {},
            dateButtonOption: 'byDate',
            filterDateInput: date.formatDate(new Date(),'YYYY-MM-DD'),
            filterDateTo:  date.formatDate(new Date(),'YYYY-MM-DD'),
            filterDateFrom: '',
            goFilter: false,
        }
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
    computed: {
        returnMonth(){
            let todayYear = date.formatDate(new Date(),'MMMM YYYY')
            let months = []
            for(var x=-12; x <= 10; x++){
                let monthsAdd = date.formatDate(date.addToDate(new Date(), { month : x }),'MMMM YYYY')
                months.push(monthsAdd)
            }
            return months
        },
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

                if(this.goFilter){
                    let baseStart = null
                    if(this.dateButtonOption == 'byDate'){
                        filter = filter.filter(a=>{
                             return date.formatDate(a.timestamp.toDate(),'MMM DD YYYY') == date.formatDate(this.filterDateInput,'MMM DD YYYY')
                        })
                    } else if(this.dateButtonOption == 'monthYear'){
                        filter = filter.filter(a=>{
                             return date.formatDate(a.timestamp.toDate(),'MMMM YYYY') == this.monthYear
                        })
                    } else {
                        filter = filter.filter(a=>{

                            if (date.isBetweenDates(a.timestamp.toDate(),new Date(this.filterDateFrom), new Date(this.filterDateTo), { inclusiveFrom: true, inclusiveTo: true, onlyDate: true  })) {
                                return a
                            }
                        })
                        console.log(filter,'filter?')
                    }
                }

                let order = this.$lodash.orderBy(filter,a=>{
                    return a.timestamp.toDate()
                },'desc')
                return order
            } catch (error) {
                return []
            }
        }, 
        returnTransactionsTotal(){
            return this.$lodash.sumBy(this.returnTransactions,a=> {return parseFloat(a.Total)})   
        },
        returnFilterLabel(){
            try {
                if(this.goFilter){
                    if(this.dateButtonOption == 'byDate'){
                        return `${this.$moment(this.filterDateInput).format('LL')}`
                    } else if(this.dateButtonOption == 'monthYear'){
                        return this.monthYear
                    } else {
                        return `${this.$moment(this.filterDateFrom).format('LL')} - ${this.$moment(this.filterDateTo).format('LL')}`
                    }
                } else {
                    return ''
                }
            } catch (error) {
                return ''
            }
        },       
    },

    methods: {
        resetDates(){
            this.filterDateTo = date.formatDate(new Date(),'YYYY-MM-DD')
            this.filterDateInput = date.formatDate(new Date(),'YYYY-MM-DD')
        },
        showInputData(){
            this.goFilter = true
        }
        // viewTransactionDetails (transac) {
            
        //     this.$store.commit('SubModule/setTransaction', transac)
        //     this.$router.push('/reciept')
        //     // this.transaction = transac
        //     // this.transactionDetailsDialog = !this.transactionDetailsDialog
            
        // },
    }
}
</script>
