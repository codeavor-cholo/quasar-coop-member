<template>
    <q-page class="">
        <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Account Balance
            </q-item-label>
            <q-item-label class="text-h6 text-teal">₱ 5000.00</q-item-label>
            </q-item-section>
        </q-item>
        <q-btn color="grey-10" icon="account_balance_wallet" label="withdraw Request" class="q-my-md full-width" @click="onClick" />

        <q-item-label header>Savings Account Transactions</q-item-label>
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
    </q-page>
</template>