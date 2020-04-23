<template>
    <q-page>
        <q-item class="bg-grey-2 q-pb-md">
            <q-item-section>
            <q-item-label caption lines="2">Cash Advance Balance</q-item-label>
            <q-item-label class="text-h6 text-teal">₱ 650.00 / ₱ 1000.00</q-item-label>
                <q-linear-progress stripe rounded size="20px" :value="progress" color="warning" class="q-mt-sm" />
            </q-item-section>
        </q-item>
        <q-btn color="grey-10" icon="payment" label="pay balance" class="q-my-md full-width"  />
        <q-btn color="grey-10" icon="money" label="request cash advance" class="full-width q-mb-md" @click="openRequestDialog" />
        <q-item-label header>Cash Advance Transactions</q-item-label>
        <div v-for="n in 9" :key="n">
        <q-item clickable v-ripple class="cursor-pointer" @click="viewTransactionDetails">
            <q-item-section>
            <q-item-label>#JSDF3948{{n}}</q-item-label>
            <q-item-label caption lines="2">₱ 65.00 (MF)</q-item-label>
            </q-item-section>
            <q-item-section side top>
            <q-item-label caption>04/1{{n}}/2020</q-item-label>
            </q-item-section>
        </q-item>
        </div> 
        <!-- request loan -->
        <q-dialog v-model="requestLoanDialog" persistent>
            <cash-advance-form></cash-advance-form>
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

export default {
    components: {
        CashAdvanceForm,
        TransactionDetails
    },
    data () {
        return{
            progress: .6,
            requestLoanDialog: false,
            transactionDetailsDialog: false
        }
    },
    methods: {
        openRequestDialog () {
            this.requestLoanDialog = !this.requestLoanDialog
        },
        viewTransactionDetails () {
            this.transactionDetailsDialog = !this.transactionDetailsDialog
        }
    }
}
</script>