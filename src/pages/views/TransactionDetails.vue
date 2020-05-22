<template>
    <q-page>
        
        <q-item class="q-pa-md bg-grey-2">
            <q-item-section>
                <q-item-label class="text-h6">#{{ transaction.TransactionID }}</q-item-label>
                <q-item-label caption lines="2">{{ $moment(transaction.timestamp != '' ? transaction.timestamp.toDate() : '').format('LL') }}</q-item-label>
                <q-item-label overline class="text-teal">PAID</q-item-label>
            </q-item-section>
            <q-item-section side top>
                <q-btn color="grey-10" flat icon="arrow_left" @click="$router.push('/')" label="Back" dense/>
            </q-item-section> 
        </q-item>
        <q-separator />
        <q-item-label header class="q-px-lg q-mt-sm">
            Billing Breakdown
        </q-item-label>
        <q-item v-if="transaction.MembershipFee != ''" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Membership Fee</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ transaction.MembershipFee | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="transaction.ManagementFee != ''" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Management Fee</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ transaction.ManagementFee | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="transaction.ShareCapital != ''" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Share of Stocks</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ transaction.ShareCapital | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="transaction.SavingsDeposit != ''" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Savings Deposit</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption> {{ transaction.SavingsDeposit | currency }} </q-item-label>
            </q-item-section>
        </q-item>
        <q-item v-if="transaction.SavingsDeposit != ''" class="q-px-lg q-py-none" dense="">
            <q-item-section>
            <q-item-label>Advances</q-item-label>
            </q-item-section>
            <q-item-section side>
            <q-item-label caption>{{ transaction.Advances | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <div v-if="transaction.OthersDes != ''">
            <q-item-label header class="q-px-lg q-mt-sm">
                Others
            </q-item-label>
            <q-item class="q-px-lg q-py-none" dense="">
                <q-item-section>
                <q-item-label>{{ transaction.OthersDes }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ transaction.OthersAmount | currency }}</q-item-label>
                </q-item-section>
            </q-item>
        </div>
        


        
        <q-separator spaced inset />
        <div v-if="transaction.isIncludeOperator">
            <!-- paid for operator -->
            <q-item-label header class="q-px-lg q-mt-sm">
                Paid for Operator
            </q-item-label>
            <q-item class="q-px-lg q-py-none" dense="">
                <q-item-section>
                <q-item-label>Management Fee</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ transaction.isIncludeOperator ? transaction.paidForOperator.ManagementFee : '' | currency }}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg q-py-none" dense="">
                <q-item-section>
                <q-item-label>Share of Stocks</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ transaction.isIncludeOperator ? transaction.paidForOperator.ShareCapital : '' | currency }}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg q-py-none" dense="">
                <q-item-section>
                <q-item-label>Savings Deposit</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ transaction.isIncludeOperator ? transaction.paidForOperator.SavingsDeposit : '' | currency }}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="q-px-lg q-py-none" dense="">
                <q-item-section>
                <q-item-label>Advances</q-item-label>
                </q-item-section>
                <q-item-section side>
                <q-item-label caption>{{ transaction.isIncludeOperator ? transaction.paidForOperator.Advances : '' | currency }}</q-item-label>
                </q-item-section>
            </q-item>
        </div>
        

        <q-item class="q-px-lg">
            
            <q-item-section>
            <q-item-label class="text-weight-bold">Amount Paid</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{ transaction.AmoutPaid | currency }} </q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="q-px-lg">
            
            <q-item-section>
            <q-item-label class="text-weight-bold">TOTAL AMOUNT</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{ transaction.Total | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <div class="q-pa-md q-mb-md">
            <q-btn color="grey-10" icon="file_download" label="download reciept" class="full-width" />
        </div>

    </q-page>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters('SubModule', {
            transaction: 'getTransaction'
        })
    },
    methods: {
        test () {
            console.log(this.transaction)
        }
    }
}
</script>