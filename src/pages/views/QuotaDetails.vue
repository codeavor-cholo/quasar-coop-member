<template>
    <q-page>
        <q-item class="bg-grey-2 q-pt-md q-px-md">
          <q-item-section>
            <q-item-label overline v-show="role == 'operator'">Driver 1</q-item-label>
            <q-item-label caption lines="2">Monthly Quota Balance</q-item-label>
            <q-item-label class="text-h6 text-teal">₱ 650.00 / 10 Days Left</q-item-label>
          </q-item-section>
            <q-item-section side top>
                <q-btn color="grey-10" flat icon="arrow_left" @click="$router.push('/')" label="Back" dense/>
            </q-item-section> 
        </q-item> 
        <q-item class="bg-grey-2">
            <q-item-section>
                <q-linear-progress stripe rounded size="20px" :value="progress" color="warning"/>
            </q-item-section>
        </q-item>
        <q-item class="bg-grey-2 q-pb-md">
            <q-item-section>
                <q-item-label caption lines="2">Unpaid Balance</q-item-label>
                <q-item-label class="text-h6 text-orange-8">₱ 390.00 / 6 Unpaid Days</q-item-label> 
            </q-item-section>    
            <q-item-section side>
                <q-icon name="warning" color="orange-8"/>
            </q-item-section>    
        </q-item>
        
        <q-date
            v-model="date"
            :events="eventsFn"
            minimal=""
            flat
            class="full-width"
            :options="optionsFn"
            :today-btn="false"
            disable=""
            event-color="orange-8"
        />

        <div class="q-pa-md row justify-around text-grey-6">
           <span><q-chip color="orange-8" size="xs" /> Unpaid Days</span> 
           <span><span class="text-grey-3 q-pa-xs"> 12 </span> Paid Days </span> 
           <span><span class="text-grey-8 q-pa-xs"> 12 </span> None </span> 
        </div>
        <q-item-label header>Latest 10 Transactions</q-item-label>
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
<script>
export default {
    data(){
        return {
            progress: .2,
            role: 'operator',
            date: '2019/02/01',
            events: [ '2019/02/01', '2019/02/05', '2019/02/06', '2019/02/09', '2019/02/23' ]
        }
    },
    methods: {
        eventsFn (date) {
            const parts = date.split('/')
            return parts[2] % 2 === 0
        },
        optionsFn (date) {
        return date >= '2019/02/03' && date <= '2019/02/15'
        },
    }
}
</script>