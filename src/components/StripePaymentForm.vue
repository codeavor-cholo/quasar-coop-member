<template>
    <q-card class="q-pa-sm" style="width:100vw">
        <q-card-section class="row items-center q-pb-none">
        <span class="text-h6">Online Payment Form</span>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeLoanDialog" />
        </q-card-section>
        <q-card-section>
            <q-input v-model="amount" type="number" label="Amount to Pay" prefix="₱" outlined="" color="teal"/>
        </q-card-section>
        <q-card-section>
            <stripe-elements ref="elementsRef" :pk="publishableKey" :amount="returnToPay" @token="tokenCreated" @loading="loading = $event" outline>
            </stripe-elements> 
        </q-card-section>
        <q-card-actions vertical align="center">
            <q-btn flat :label="`Pay ₱${returnToPay}`" color="teal"  @click="submit"/>
            <q-btn flat label="Cancel" @click="closeLoanDialog"/>
        </q-card-actions>
    </q-card>
</template>
<script>
import { StripeElements } from 'vue-stripe-checkout'
import { VMoney } from 'v-money'
import { date } from 'quasar'
import axios from 'axios'
import { firefirestore, firebaseDb, firebaseAuth } from 'boot/firebase'
import { mapGetters, mapMutations } from 'vuex'
export default {
    props: ['memberid','billdata','type'],
    directives: {
        money: VMoney
    },
    components: {
        StripeElements
    },
    firestore () {
        return {
            MemberData: firebaseDb.collection('MemberData').doc(this.memberid),
        }
    },
    data(){
        return{
            amount: 0,
            publishableKey: 'pk_test_kUO5j8FaZUKitD1Qh3ibZ2HP00YkxaEOOS', 
            token: null,
            charge: null,
            paydetails: null,
            loading: false,
        }
    },
    computed: {
        ...mapGetters('SubModule', ['currencyToNumber']),
        returnBillTotal(){
            console.log(this.billdata,'billdata')
            let bill = this.billdata
            if(this.type == 'billing'){
                if(bill.BillingBalance !== undefined){
                    if(bill.paymentStatus !== "Full Payment"){
                    if(bill.billPaidAmount !== undefined){
                            this.amount = bill.BillingBalance - bill.billPaidAmount
                        return bill.BillingBalance - bill.billPaidAmount
                    } else {
                        this.amount = bill.BillingBalance
                        return bill.BillingBalance
                    }
                    }
                } else {
                    if(bill.paymentStatus !== "Full  Payment"){
                    if(bill.billPaidAmount !== undefined){
                        this.amount = bill.QuotaBalance - bill.billPaidAmount
                        return bill.QuotaBalance - bill.billPaidAmount
                    } else {
                            this.amount = bill.QuotaBalance
                        return bill.QuotaBalance
                    }
                    }
                }
            }
        },
        returnToPay(){


            if(this.amount !== 0){
                return parseFloat(this.amount)
            } else {
                return this.returnBillTotal
            }

        },
        returnSelectedMember(){
            return this.MemberData
        }
    },
    async mounted() {
        // this.TransactionID = await this.genTransactionID
      this.$binding('lastTransaction', firebaseDb.collection('Transactions').orderBy('TransactionID', 'desc').limit(1))
        .then(data => {
          if (data.length != 0) {
            // has data
            this.TransactionID = ++data[0].TransactionID
            this.OrNo = ++data[0].OrNo
          } else {
            // empty Transactions
            var transacIdFormat = 100000
            var ORFormat = 1000000
            this.TransactionID = transacIdFormat
            this.OrNo = ORFormat
          }
        })
    },
    methods:{
        ...mapMutations('SubModule', {
        closeLoanDialog: 'setRequestLoanDialog'
        }), 
        submit () {
            this.$refs.elementsRef.submit();
        },
        tokenCreated (token) {
            this.token = token;
            console.log(token,'token')
            // for additional charge objects go to https://stripe.com/docs/api/charges/object
            this.charge = {
                source: token.card,
                amount: this.returnToPay,
            }
            this.sendTokenToServer(this.charge);
        },
        sendTokenToServer (charge) {
            // Send to server
            console.log(charge,'charge')
            if(this.returnToPay === 0){
                this.$q.dialog({
                    title: `Unable to Continue??`,
                    message: 'Please Select Payment Type??',
                    color: 'pink-6',
                    textColor: 'grey',
                    icon: 'negative',
                    ok: 'Ok'
                })
            }else{
                this.$q.dialog({
                    title: `Continue with the payment?`,
                    message: 'This action cannot be undone.',
                    color: 'teal',
                    textColor: 'grey',
                    icon: 'negative',
                    ok: 'YES',
                    cancel: 'NO'
                }).onOk(()=>{
                    this.paydetails = charge
                    // this.payCheckout()
                    if(this.type == 'billing'){
                        this.PayFeeBills()
                    }
                    // this.reserveNowCard()            
                })

            }
        },
        payBillings(){
            try {
                console.log('paying bills')
            } catch (error) {
                console.log(error,'payBillings')
            }
        },
        async PayFeeBills () {
            let vm = this
            const bill = this.billdata
            let billID = bill['.key']
            let billType = bill.QuotaBalance !== undefined ? 'quota' : 'loans'
            let MemberID = bill.MemberID


            var payment = {
                MemberID: bill.MemberID,
                OrNo: vm.OrNo,
                TransactionID: vm.TransactionID,
                TransactionType: 'Bills Payment',    
                Total: vm.returnBillTotal,
                AmountPaid: parseFloat(vm.amount),  
                TrackingNumber: billID.slice(0,10).toUpperCase(), 
                timestamp: firefirestore.FieldValue.serverTimestamp(),
                staffID: 'Online Payment',
                onlinePaymentDetails: this.charge   
            }
            let smsAmount = vm.returnBillTotal
            let remainingBalance = 0
            if(vm.returnBillTotal >= vm.amount){
                remainingBalance = vm.returnBillTotal - vm.amount
                payment.remainingBalance = remainingBalance
                smsAmount = vm.amount
            }

            let status = 'Full Payment'
            if(remainingBalance > 0){
                status = 'Partial Payment'
                payment.paymentStatus = status
            } else {
                payment.paymentStatus = status
            }

            let loanID = bill.CashReleaseTrackingID
            let activeLoans = this.returnSelectedMember.activeLoans
            let update = null
            if(billType == 'loans'){
                update = activeLoans.filter(a=>{ 
                    return a.CashReleaseTrackingID == loanID
                })[0]
            }

            console.log(update)

            let totalAmountPaid = parseFloat(vm.amount)
            if(bill.paymentStatus == 'Partial Payment' || status == 'Partial Payment'){
                let additional = bill.billPaidAmount !== undefined ? parseFloat(bill.billPaidAmount) : 0
                totalAmountPaid = parseFloat(vm.amount) + additional
                console.log('dto 1')
                if(totalAmountPaid > vm.returnBillTotal){
                    console.log('dto 2')
                    totalAmountPaid = vm.returnBillTotal
                }
            } else {
                console.log('dto 3')
                totalAmountPaid = vm.returnBillTotal
            }


            console.log('payment',payment)
            console.log('bill',billID, bill)
            console.log(smsAmount,'smsAmount')
            console.log(totalAmountPaid,'amout paid bills in paymnt')
            console.log(vm.getMobileNumber(),'getMobileNumber')
            firebaseDb.collection('Transactions').add(payment)
            .then(async (doc) => {
                this.$forceUpdate()
                console.log(doc.id,'doc id')
                console.log(payment, 'payment details')
                vm.sendSMS(doc.id,payment.MemberID,smsAmount) 

                if(billType == 'quota'){
                    //update billing with status
                    firebaseDb.collection('BillingTrackers').doc(billID).update({paymentStatus: status,billPaidAmount: totalAmountPaid})
                    .then(()=>{
                        console.log('bill updated success')
                        vm.$q.notify({
                        icon: 'info',
                        color: 'positive',
                        message: 'Bill Payment Success'
                        })
                        vm.closeLoanDialog()
                        // vm.clearForm()
                     }).catch((err)=>{
                         console.log(err,'bill update error')
                     }) 

                } else {
                    firebaseDb.collection('BillingTrackers').doc(billID).update({paymentStatus: status,billPaidAmount: totalAmountPaid})
                    .then(()=>{
                        console.log('bill updated success')
                        //update advances and active loans in member data

                        // array remove
                        let arrayRemove = {...update}

                        // array update
                        let arrayUpdate = {...update}
                        arrayUpdate.paidAmount = parseFloat(arrayUpdate.paidAmount) + parseFloat(this.amountPaidBills)
                        
                        if(status == 'Full Payment'){
                            firebaseDb.collection('MemberData').doc(MemberID).update({
                                Advances: firefirestore.FieldValue.increment(-Math.abs(update.TotalBalance)),
                            }).then(()=>{
                                firebaseDb.collection('MemberData').doc(MemberID).update({
                                    activeLoans: firefirestore.FieldValue.arrayRemove(arrayRemove),
                                }).then(()=>{
                                                                
                                    console.log('active Loans remove success because paid full')
                                    vm.$q.notify({
                                        icon: 'info',
                                        color: 'positive',
                                        message: 'Bill Payment Success'
                                    })
                                    vm.closeLoanDialog()
                                }).catch(err=>{
                                console.log(err,'active loans update error')
                                })  
                            }).catch(err=>{
                                console.log(err,'advances update error')
                            })               
                        } else {
                            firebaseDb.collection('MemberData').doc(MemberID).update({
                                activeLoans: firefirestore.FieldValue.arrayRemove(arrayRemove),
                            }).then(()=>{
                                console.log('partially paid')
                                firebaseDb.collection('MemberData').doc(MemberID).update({
                                    activeLoans: firefirestore.FieldValue.arrayUnion(arrayUpdate),
                                }).then(()=>{
                                console.log('active Loans union success')
                                vm.$q.notify({
                                    icon: 'info',
                                    color: 'positive',
                                    message: 'Bill Payment Success'
                                })
                                vm.closeLoanDialog()

                                }).catch(error=>{
                                console.log(error,'active Loans union  error')
                                })   
                            }).catch(error=>{
                                console.log(error,'active Loans remove error')
                            }) 
                        }
                     }).catch((err)=>{
                         console.log(err,'bill update error')
                     }) 

                }


            }).catch(err => {
                vm.$q.notify({
                icon: 'info',
                color: 'negative',
                message: 'An error occur'
                })
                console.log(err)
            })

        },
        sendSMS(paymentid,memberID,amount){
                let trackID = paymentid.toString().slice(0,10)
                let number = this.getMobileNumber(memberID)
                let TodayDate = date.formatDate(new Date(), 'YYYY-MM-DD hh:mm A')
                let header= {
                        'Access-Control-Allow-Origin': '*',
                }
                let message = 'SMS Reciept for the payment of P'+ amount + '.00 on '+ TodayDate +'. PaymentID# '+ trackID.toUpperCase()
                let apinumber = 4

                let data = 'number=' + number + '&' + 'message=' + message + '&' + 'apinumber=' + apinumber
                console.log(data,'data sent')

                const options = {
                    method: 'POST',
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    data: data,
                    url: 'https://smsapisender.000webhostapp.com/index.php',
                }      

                axios.post('https://toned-tabulation.000webhostapp.com/index.php', data)
                .then(response => {
                console.log(response)
                })
                .catch((error) => {
                console.log(error.response)
                })            
        },
        getMobileNumber(){
            try {
                return this.MemberData.Phone
            } catch (error) {
                console.log(error,'error getting number')
                return 0
            }
        },
    }
}
</script>