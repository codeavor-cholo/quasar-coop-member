<template>
    <q-page>
        <q-item class="q-pa-md bg-grey-2">
            <q-item-section>
                <q-item-label class="text-h6">#{{returnBill['.key'].slice(0,10).toUpperCase()}}</q-item-label>
                <q-item-label caption lines="2" v-if="type == 'loans'">{{returnBill.BillingDate}}</q-item-label>
                <q-item-label caption lines="2" v-else>{{returnBill.BillingMonth}}</q-item-label>
                <q-item-label overline class="text-teal" v-if="returnBill.paymentStatus !== undefined">{{returnBill.paymentStatus.toUpperCase()}}</q-item-label>
            </q-item-section>
            <q-item-section side top>
                <q-btn color="grey-10" flat icon="arrow_left" @click="$router.go(-1)"  label="Back" dense/>
            </q-item-section> 
            
        </q-item>
        <q-separator />
        <q-item-label header class="q-px-lg q-mt-sm">
            Billing Breakdown
        </q-item-label>
        <div v-if="type == 'loans'">
        <q-item class="q-px-lg q-pt-none" >
            <q-item-section>
            <q-item-label>Advances</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label caption>{{returnBill.Advances | currency}} </q-item-label>
            </q-item-section>
        </q-item>

        <q-item class="q-px-lg q-pt-none" >
            <q-item-section>
            <q-item-label>Interest Amount</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label caption>+ {{returnBill.InterestRate}} ({{returnBill.InterestAmount | currency}}) </q-item-label>
            </q-item-section>
        </q-item>


        </div>
        <div v-else>
            <q-item class="q-px-lg q-pt-none" >
                <q-item-section>
                <q-item-label>Jeep / Unit</q-item-label>
                </q-item-section>

                <q-item-section side>
                <q-item-label caption>{{returnBill.PlateNumber}} </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg q-pt-none" >
                <q-item-section>
                <q-item-label>Amount Per Day</q-item-label>
                </q-item-section>

                <q-item-section side>
                <q-item-label caption>{{returnBill.AmountPerDay | currency}} </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg q-pt-none" >
                <q-item-section>
                <q-item-label>Unpaid Days</q-item-label>
                </q-item-section>

                <q-item-section side>
                <q-item-label caption>x {{returnBill.NoPayDays}} Days</q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg q-pt-none" v-show="returnBill.AmountPayables !== undefined && returnBill.AmountPayables !== 0">
                <q-item-section>
                <q-item-label>Amount Payables </q-item-label>
                <q-item-label caption>(Operator/Driver Balances)</q-item-label>
                </q-item-section>

                <q-item-section side>
                <q-item-label caption>+ {{returnBill.AmountPayables | currency}} </q-item-label>
                </q-item-section>
            </q-item>
        </div>
        <q-separator spaced inset v-show="type == 'loans'"/>
        <q-item class="q-px-lg q-pt-none" v-show="type == 'loans'">
            <q-item-section>
                <q-item-label caption lines="2"><q-icon name="warning" /> + 2% Interest Rate, when unpaid before the due date.</q-item-label>
            </q-item-section>
        </q-item>
        <q-separator inset />
        <q-item class="q-px-lg" v-if="type == 'loans'">
            <q-item-section>
            <q-item-label class="text-weight-bold">TOTAL AMOUNT</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{returnBill.BillingBalance| currency}} </q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="q-px-lg" v-else>
            <q-item-section>
            <q-item-label class="text-weight-bold">TOTAL AMOUNT</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{returnBill.QuotaBalance| currency}} </q-item-label>
            </q-item-section>
        </q-item>
        <div  v-if="type == 'loans'">
            <q-item class="q-px-lg" v-show="returnBill.billPaidAmount !== undefined && returnBill.paymentStatus !== 'Full Payment'">
                <q-item-section>
                <q-item-label class="text-weight-bold">PAID AMOUNT</q-item-label>
                </q-item-section>

                <q-item-section side>
                <q-item-label class="text-h6 text-grey text-weight-bold">- {{returnBill.billPaidAmount| currency}} </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg" v-show="returnBill.billPaidAmount !== undefined  && returnBill.paymentStatus !== 'Full Payment'">
                <q-item-section>
                <q-item-label class="text-weight-bold">REMAINING BALANCE</q-item-label>
                </q-item-section>

                <q-item-section side>
                <q-item-label class="text-h6 text-teal text-weight-bold">{{returnBill.BillingBalance - returnBill.billPaidAmount| currency}} </q-item-label>
                </q-item-section>
            </q-item>
            <div class="q-pa-md q-mb-md" v-show="returnBill.paymentStatus !== 'Full Payment'">
                <div v-if="checkIfHasLatest">
                <q-btn color="grey-10" icon="payment" :label="`pay ₱ ${returnBill.BillingBalance - returnBill.billPaidAmount}`" class="full-width" v-if="Bill.billPaidAmount !== undefined" @click="openRequestDialog"/>
                <q-btn color="grey-10" icon="payment" :label="`pay ₱ ${returnBill.BillingBalance}`" class="full-width" v-else @click="openRequestDialog"/>
                </div>
                <div v-else> <q-banner class="bg-warning text-white text-weight-bolder">
                    Check the latest billing statement to pay this cash advance's balance.
                    <template v-slot:action>
                        <q-btn flat color="white" label="Go to latest billing statement" :to="`${returnLatestKey}`"/>
                    </template>
                </q-banner></div>
            </div>
        </div>
        <div v-else>
            <q-item class="q-px-lg" v-show="returnBill.billPaidAmount !== undefined  && returnBill.paymentStatus !== 'Full Payment'">
                <q-item-section>
                <q-item-label class="text-weight-bold">PAID AMOUNT</q-item-label>
                </q-item-section>

                <q-item-section side>
                <q-item-label class="text-h6 text-grey text-weight-bold">- {{returnBill.billPaidAmount| currency}} </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg" v-show="returnBill.billPaidAmount !== undefined  && returnBill.paymentStatus !== 'Full Payment'">
                <q-item-section>
                <q-item-label class="text-weight-bold">REMAINING BALANCE</q-item-label>
                </q-item-section>

                <q-item-section side>
                <q-item-label class="text-h6 text-teal text-weight-bold">{{returnBill.QuotaBalance - returnBill.billPaidAmount| currency}} </q-item-label>
                </q-item-section>
            </q-item>
            <div class="q-pa-md q-mb-md" v-show="returnBill.paymentStatus !== 'Full Payment'">
                <q-btn color="grey-10" icon="payment" :label="`pay ₱ ${returnBill.QuotaBalance - returnBill.billPaidAmount}`" class="full-width" v-if="Bill.billPaidAmount !== undefined" @click="openRequestDialog"/>
                <q-btn color="grey-10" icon="payment" :label="`pay ₱ ${returnBill.QuotaBalance}`" class="full-width" v-else @click="openRequestDialog"/>

            </div>
        </div>

        <q-dialog v-model="requestLoanDialog" persistent>
            <stripe-payment-form :memberid="returnBill.MemberData['.key']" :billdata="returnBill" :type="'billing'"></stripe-payment-form>
        </q-dialog>
    </q-page>
</template>
<script>
import { firebaseDb, firebaseAuth, firefirestore } from 'boot/firebase'
import { updateLocale } from 'moment'
import { VMoney } from 'v-money'
import { mapGetters, mapMutations } from 'vuex'
import StripePaymentForm from '../../components/StripePaymentForm.vue'

export default {
    components:{
        StripePaymentForm
    },
    data(){
        return {
            id: '',
            type: 'loans',
            changedBill: {},
            routeId: ''
        }
    },
    created(){
        this.type = this.$route.params.type
    },
    firestore () {
        return {
            Bill: firebaseDb.collection('BillingTrackers').doc(this.$route.params.id),
            BillingTrackers: firebaseDb.collection('BillingTrackers'),
            Transactions: firebaseDb.collection('Transactions')
        }
    },
    computed: {
        ...mapGetters('SubModule', {
            requestLoanDialog: 'getRequestLoanDialog',
            currencyToNumber: 'currencyToNumber'
        }),
        returnBill(){
            try {
                let bill = this.Bill
                console.log(bill,'this.BIll')
                if(this.$route.params.type == 'loans'){
                    const loanID = bill.CashReleaseTrackingID
                    const memberID = bill.MemberData['.key']
                    const billDate = bill.timestamp.toDate()
                    let transactions = this.Transactions.filter(a=>{
                        return a.MemberID == memberID && a.AdvancesAmount !== 0 && a.AdvancesAmount !== undefined && a.timestamp.toDate() > billDate
                    })

                    let getAmount = []
                    transactions.forEach(a=>{
                        a.Advances.forEach(b=>{
                            if(b.trackID == loanID){
                                getAmount.push(b)
                            }
                        })
                    })
                
                    let getAmountSum = this.$lodash.sumBy(getAmount,a=>{
                        return parseFloat(a.paidAmount)
                    })
                    console.log(transactions,'trans')
                    console.log(getAmount,'getAmount')
                    console.log(getAmountSum,'sum')

                    if(getAmount.length > 0){
                        bill.billPaidAmount =  getAmountSum
                        if(bill.BillingBalance == getAmountSum){
                            bill.paymentStatus = 'Full Payment'
                            this.changedBill = bill
                        } else {
                            bill.paymentStatus = 'Partial Payment'
                        }
                    }
                    
                    console.log(bill,'bill')
                }
                return bill
            } catch (error) {
                console.log(error,'error')
                return this.Bill
            }
        },
        checkIfHasLatest(){
            let filter = this.BillingTrackers.filter(a=>{
                return this.returnBill.CashReleaseTrackingID == a.CashReleaseTrackingID
            })

            let order = this.$lodash.orderBy(filter,a=>{
                return a.timestamp.toDate()
            },'desc')[0]

            if(order['.key'] == this.$route.params.id) return true
            return false
        },
        returnLatestKey(){
            let filter = this.BillingTrackers.filter(a=>{
                return this.returnBill.CashReleaseTrackingID == a.CashReleaseTrackingID
            })

            let order = this.$lodash.orderBy(filter,a=>{
                return a.timestamp.toDate()
            },'desc')[0]

            return order['.key']
        }
    },
    watch: {
        '$route'(to, from) {
            if(to.params.id !== from.params.id){
                console.log(to,from)
            }
        }
    },
    methods:{
        ...mapMutations('SubModule', {
            openLoanDialog: 'setRequestLoanDialog'
        }),
        openRequestDialog () {
            console.log('clicked')
            // this.requestLoanDialog = !this.requestLoanDialog
            this.openLoanDialog()
        },
        returnCurrency(num){
            let nums = `${num | currency}`
            return nums
        },
        updateBilling(newvalue,oldvalue){
            console.log(newvalue,'new')
            console.log(oldvalue,'old')
            const newBill = newvalue
            const billID = newBill['.key']
            firebaseDb.collection('BillingTrackers').doc(billID).set(newBill)
            .then(()=>{
                 console.log('updated full payment')
            })

        }
    }
}
</script>