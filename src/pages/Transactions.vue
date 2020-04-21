<template>
    <q-page>
        <q-tabs
            v-model="tab"
            class="text-teal"
            active-bg-color="grey-8"
            active-color="white"
        >
            <q-tab name="all"  label="All" />
            <q-tab name="savings"  label="Savings" />
            <q-tab name="cashadvance"  label="Cash Advance" />
            
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="all" class="q-pa-none">
                <div class="text-h6 q-pt-md q-px-md">All Transactions</div>
                <div v-for="n in 9" :key="n">
                <q-item clickable="" v-ripple class="cursor-pointer">
                    <q-item-section>
                    <q-item-label>#JSDF3948{{n}}</q-item-label>
                    <q-item-label caption lines="2">₱ 65.00 (MF)</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                    <q-item-label caption>04/1{{n}}/2020</q-item-label>
                    </q-item-section>
                </q-item>
                </div>
            </q-tab-panel>
            <q-tab-panel name="savings">
                <q-item class="bg-grey-2">
                    <q-item-section>
                    <q-item-label caption lines="2">Account Balance
                    </q-item-label>
                    <q-item-label class="text-h6 text-teal">₱ 5000.00</q-item-label>
                    </q-item-section>
                </q-item>
                <q-btn color="grey-10" icon="account_balance_wallet" label="withdraw Request" class="q-my-md full-width" @click="onClick" />
            </q-tab-panel>
            <q-tab-panel name="cashadvance">
                <q-item class="bg-grey-2 q-pb-md">
                    <q-item-section>
                    <q-item-label caption lines="2">Cash Advance Balance</q-item-label>
                    <q-item-label class="text-h6 text-teal">₱ 650.00 / ₱ 1000.00</q-item-label>
                        <q-linear-progress stripe rounded size="20px" :value="progress" color="warning" class="q-mt-sm" />
                    </q-item-section>
                </q-item>
                <q-btn color="grey-10" icon="payment" label="pay balance" class="q-my-md full-width" @click="onClick" />
                <q-btn color="grey-10" disable="" icon="money" label="request cash advance" class="full-width" @click="onClick" />
            </q-tab-panel>
        </q-tab-panels>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            tab: 'all',
            progress: .6
        }
    }
}
</script>