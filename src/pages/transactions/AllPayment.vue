<template>
    <q-page>
        <div class="text-h6 q-pt-md q-px-md">All Transactions</div>
        <div v-for="n in 9" :key="n">
        <q-item clickable="" v-ripple class="cursor-pointer" to="/reciept">
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