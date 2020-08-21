<template>
    <q-page>
        <q-item class="q-pa-md bg-grey-2">
            <q-item-section>
                <q-item-label class="text-h6 text-uppercase">#{{ T['.key'].slice(0,10) }}</q-item-label>
                <q-item-label caption lines="2">{{$moment(T.dateReleased).format('LLL')}}</q-item-label>
                <q-item-label overline class="text-teal">WITHDRAW</q-item-label>
            </q-item-section>
            <q-item-section side top>
                <q-btn color="grey-10" flat icon="arrow_left" @click="$router.go(-1)" label="Back" dense/>
            </q-item-section> 
        </q-item>   
        <q-item class="q-px-lg q-mt-md" v-if="T.RemainingBalance != undefined">
            
            <q-item-section>
            <q-item-label class="text-weight-bold">Remaining Balance</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{ T.RemainingBalance | currency }}</q-item-label>
            </q-item-section>
        </q-item>
        <q-item class="q-px-lg">
            
            <q-item-section>
            <q-item-label class="text-weight-bold">AMOUNT WITHDRAWED</q-item-label>
            </q-item-section>

            <q-item-section side>
            <q-item-label class="text-h6 text-teal text-weight-bold">{{ T.Amount | currency }}</q-item-label>
            </q-item-section>
        </q-item>     
    </q-page>
</template>
<script>
import { mapGetters } from 'vuex'
import { date, QDialog } from 'quasar'
import { firebaseDb, firebaseAuth, firefirestore } from 'boot/firebase'

export default {
    computed: {
        // ...mapGetters('SubModule', {
        //     transaction: 'getTransaction'
        // })
    },
    created(){
        console.log(this.$route.params.id,'trans ID')
        this.test()
    },
    firestore () {
        return {
            T: firebaseDb.collection('WithdrawalApplications').doc(this.$route.params.id),
        }
    },
    methods: {
        test () {
            console.log(this.T)
        }
    }
}
</script>