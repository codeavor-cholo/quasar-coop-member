<template>
    <q-page>

        <q-tabs
            v-model="tab"
            class="text-teal"
            active-bg-color="grey-8"
            active-color="white"
        >
            <q-tab name="all"  label="All Payments" />
            <q-tab name="savings"  label="Savings" />
            <q-tab name="cashadvance"  label="Cash Advance" />
            
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="all" class="q-pa-none">
                <AllPayment/>
            </q-tab-panel>
            <q-tab-panel name="savings">
                <Savings/>
            </q-tab-panel>
            <q-tab-panel name="cashadvance">
                <CashAdvance/>
            </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>
<script>
import AllPayment from './transactions/AllPayment.vue'
import Savings from './transactions/Savings.vue'
import CashAdvance from './transactions/CashAdvance.vue'

export default {
    components:{
        AllPayment,
        Savings,
        CashAdvance
    },
    data () {
        return {
            tab: 'all',
            banner: true,
        }
    }
}
</script>