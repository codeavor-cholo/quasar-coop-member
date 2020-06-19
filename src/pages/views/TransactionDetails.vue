<template>
    <q-page>
        
        <q-item class="q-pa-md bg-grey-2">
            <q-item-section>
                <q-item-label class="text-h6">#{{ T.TransactionID }}</q-item-label>
                <q-item-label caption lines="2">{{ $moment(T.timestamp != '' ? T.timestamp.toDate() : '').format('LL') }}</q-item-label>
                <q-item-label overline class="text-teal">PAID</q-item-label>
            </q-item-section>
            <q-item-section side top>
                <q-btn color="grey-10" flat icon="arrow_left" @click="$router.go(-1)" label="Back" dense/>
            </q-item-section> 
        </q-item>
        <q-separator />
        <div v-if="T.TransactionType == 'Payment'">
        <q-item-label header class="q-px-lg q-mt-sm">
            Billing Breakdown
        </q-item-label>
        <q-item v-if="T.jeepneyDetails != undefined" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Jeep / Unit </q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ T.jeepneyDetails.PlateNumber }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="T.MembershipFee != 0" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Membership Fee</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ T.MembershipFee | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="T.ManagementFee != 0" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Management Fee</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ T.ManagementFee | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="T.ShareCapital != 0" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Share of Stocks</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ T.ShareCapital | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="T.SavingsDeposit != 0" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Savings Deposit</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption> {{ T.SavingsDeposit | currency }} </q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="T.AdvancesAmount != 0 && T.AdvancesAmount !== undefined" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Advances (Loans) Total</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ T.AdvancesAmount | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <div v-if="T.Advances !== []">
            <q-item class="q-px-lg q-py-none text-grey-6" dense="" v-for="(adv,i) in T.Advances" :key="i">
                <q-item-section>
                <q-item-label class="q-pl-md">- #{{ adv.trackID.toUpperCase() }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ adv.paidAmount | currency }}</q-item-label>
                </q-item-section>
            </q-item>
        </div>
        <q-item v-if="T.OthersAmount != 0" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Others Total</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ T.OthersAmount | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <div v-if="T.Others !== []">
            <q-item class="q-px-lg q-py-none text-grey-6" dense="" v-for="(other,i) in T.Others" :key="i">
                <q-item-section>
                <q-item-label class="q-pl-md">- {{ other.description }} (x{{ other.qty }})</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ other.totalPrice | currency }}</q-item-label>
                </q-item-section>
            </q-item>
        </div>
        


        
        <q-separator spaced inset />
        <div v-if="T.isIncludeOperator">
            <!-- paid for operator -->
            <q-item-label header class="q-px-lg q-mt-sm">
                Paid for Operator
            </q-item-label>
            <q-item class="q-px-lg q-py-none" dense="" v-show="T.paidForOperator.ManagementFee !== 0">
                <q-item-section>
                <q-item-label>Management Fee</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ T.paidForOperator.ManagementFee !== 0 ? T.paidForOperator.ManagementFee : '' | currency }}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg q-py-none" dense="" v-show="T.paidForOperator.ShareCapital !== 0">
                <q-item-section>
                <q-item-label>Share of Stocks</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ T.paidForOperator.ShareCapital !== 0 ? T.paidForOperator.ShareCapital : '' | currency }}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg q-py-none" dense="" v-show="T.paidForOperator.SavingsDeposit !== 0 ">
                <q-item-section>
                <q-item-label>Savings Deposit</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{  T.paidForOperator.SavingsDeposit !== 0 ? T.paidForOperator.SavingsDeposit : '' | currency }}</q-item-label>
                </q-item-section>
            </q-item>
            <!-- <q-item class="q-px-lg q-py-none" dense="">
                <q-item-section>
                <q-item-label>Advances</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ T.isIncludeOperator ? T.paidForOperator.Advances : '' | currency }}</q-item-label>
                </q-item-section>
            </q-item> -->
        </div>
        </div>
        <div v-else>
            <q-item-label header class="q-px-lg q-mt-sm">
                Billing Breakdown
            </q-item-label>
            <q-item v-if="T.TrackingNumber != undefined" class="q-px-lg q-py-none" dense="">
                <q-item-section>
                <q-item-label>Payment Type</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ T.TransactionType }}</q-item-label>
                </q-item-section>
            </q-item> 
            <q-item v-if="T.TrackingNumber != undefined" class="q-px-lg q-py-none" dense="">
                <q-item-section>
                <q-item-label>Tracking Number </q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ T.TrackingNumber }}</q-item-label>
                </q-item-section>
            </q-item> 
            <q-item v-if="T.paymentStatus != undefined" class="q-px-lg q-py-none" dense="">
                <q-item-section>
                <q-item-label>Payment Status </q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ T.paymentStatus }}</q-item-label>
                </q-item-section>
            </q-item>       
            <q-separator spaced inset />      
        </div>

        <q-item class="q-px-lg">
            
            <q-item-section>
            <q-item-label class="text-weight-bold">Amount Paid</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{ T.AmountPaid | currency }} </q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="q-px-lg" v-if="T.remainingBalance != undefined">
            
            <q-item-section>
            <q-item-label class="text-weight-bold">Remaining Balance</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{ T.remainingBalance | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="q-px-lg">
            
            <q-item-section>
            <q-item-label class="text-weight-bold">TOTAL AMOUNT</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{ T.Total | currency }}</q-item-label>
            </q-item-section>
        </q-item>

        <div class="q-pa-md q-mb-md">
            <q-btn color="grey-10" icon="file_download" label="download reciept" class="full-width" @click="test"/>
        </div>
    </q-page>
</template>
<script>
import { mapGetters } from 'vuex'
import { firebaseDb, firebaseAuth, firefirestore } from 'boot/firebase'

export default {
    computed: {
        // ...mapGetters('SubModule', {
        //     transaction: 'getTransaction'
        // })
    },
    created(){
        console.log(this.$route.params.id,'trans ID')
    },
    firestore () {
        return {
            T: firebaseDb.collection('Transactions').doc(this.$route.params.id),
        }
    },
    methods: {
        test () {
            console.log(this.T)
        }
    }
}
</script>