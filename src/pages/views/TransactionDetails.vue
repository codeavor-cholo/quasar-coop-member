<template>
    <q-page>
        <q-item class="q-pa-md bg-grey-2">
            <q-item-section>
                <q-item-label class="text-h6">#KSLK9881</q-item-label>
                <q-item-label caption lines="2">April 22, 2020</q-item-label>
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
        <q-item class="q-px-lg q-pt-none" v-for="n in 1" :key="n">
            <q-item-section>
            <q-item-label>#KSLK988{{n}}</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label caption>₱ 65.00 (MF) </q-item-label>
            <q-item-label caption>₱ 30.00 (SOS) </q-item-label>
            </q-item-section>
        </q-item>
        <q-separator spaced inset />
        <q-item class="q-px-lg">
            <q-item-section>
            <q-item-label class="text-weight-bold">TOTAL AMOUNT</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">₱ 95.00 </q-item-label>
            </q-item-section>
        </q-item>
        <div class="q-pa-md q-mb-md">
            <q-btn color="grey-10" icon="file_download" label="download reciept" class="full-width" @click="onClick" />
        </div>

    </q-page>
</template>