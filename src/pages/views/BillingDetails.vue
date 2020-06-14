<template>
    <q-page>
        <q-item class="q-pa-md bg-grey-2">
            <q-item-section>
                <q-item-label class="text-h6">#{{Bill['.key'].slice(0,10).toUpperCase()}}</q-item-label>
                <q-item-label caption lines="2">{{Bill.BillingDate}}</q-item-label>
            </q-item-section>
            <q-item-section side top>
                <q-btn color="grey-10" flat icon="arrow_left" @click="$router.push('/account')" label="Back" dense/>
            </q-item-section> 
        </q-item>
        <q-separator />
        <q-item-label header class="q-px-lg q-mt-sm">
            Billing Breakdown
        </q-item-label>
        <div v-if="type == 'loans'">
        <q-item class="q-px-lg q-pt-none" >
            <q-item-section>
            <q-item-label>Advances</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label caption>₱ {{Bill.Advances}}.00 </q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="q-px-lg q-pt-none" >
            <q-item-section>
            <q-item-label>Interest Amount</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label caption>+ {{Bill.InterestRate}} (₱ {{Bill.InterestAmount}}.00) </q-item-label>
            </q-item-section>
        </q-item>

        </div>
        <div v-else>
            <q-item class="q-px-lg q-pt-none" v-for="n in 8" :key="n">
                <q-item-section>
                <q-item-label>#KSLK988{{n}}</q-item-label>
                </q-item-section>

                <q-item-section side>
                <q-item-label caption>₱ 65.00 (MF) </q-item-label>
                <q-item-label caption>₱ 30.00 (SOS) </q-item-label>
                </q-item-section>
            </q-item>
        </div>
        <q-separator spaced inset />
        <q-item class="q-px-lg q-pt-none">
            <q-item-section>
                <q-item-label caption lines="2"><q-icon name="warning" /> + 2% Interest Rate, when unpaid before the due date.</q-item-label>
            </q-item-section>
        </q-item>
        <q-separator inset />
        <q-item class="q-px-lg">
            <q-item-section>
            <q-item-label class="text-weight-bold">TOTAL AMOUNT</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">₱ {{Bill.BillingBalance}}.00 </q-item-label>
            </q-item-section>
        </q-item>
        <div class="q-pa-md q-mb-md">
            <q-btn color="grey-10" icon="payment" :label="`pay ₱ ${Bill.BillingBalance}.00`" class="full-width"  />
        </div>
        {{returnBill}}
    </q-page>
</template>
<script>
import { firebaseDb, firebaseAuth, firefirestore } from 'boot/firebase'
export default {
    data(){
        return {
            id: '',
            type: 'loans'
        }
    },
    created(){
        this.type = this.$route.params.type
    },
    firestore () {
        return {
            Bill: firebaseDb.collection('BillingTrackers').doc(this.$route.params.id),
        }
    },
    computed: {
        returnBill(){
            console.log(this.Bill,'')
            return ''
        }
    }
}
</script>