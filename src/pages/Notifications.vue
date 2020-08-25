<template>
  <q-page class="q-py-sm">
    <q-list>
      <q-item-label header >
            Billing Statements
            <!-- <q-btn outline="" color="teal-5" label="see more" size="xs" class="float-right"/> -->
      </q-item-label>
      <q-item v-for="n in returnLatestBillings" :key="n['.key']" clickable="" v-ripple :to="n.Advances !== undefined ? `/bill/loans/${n['.key']}` : `/bill/quota/${n['.key']}`">
        <q-item-section top avatar>
            <q-avatar color="white" text-color="teal" icon="library_books"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>#{{n['.key'].slice(0,10).toUpperCase()}}</q-item-label>
          <q-item-label caption lines="2" v-if="n.Advances !== undefined">{{n.BillingBalance | currency}} (Cash Advance: #{{n.CashReleaseTrackingID.toUpperCase()}}) </q-item-label>
          <q-item-label caption lines="2" v-else>{{n.QuotaBalance | currency}} (Quota) </q-item-label>
          <q-item-label caption lines="2" v-show="n.paymentStatus !== undefined" :class="n.paymentStatus=='Full Payment' ? 'text-teal' : 'text-warning'">{{n.paymentStatus}}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption v-if="n.BillingDate !== undefined">{{n.BillingDate}}</q-item-label>
          <q-item-label caption v-else>{{n.BillingMonth}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item-label header>
          Latest Transactions
          <!-- <q-btn outline="" color="teal-5" label="see more" size="xs" class="float-right"/> -->
      </q-item-label>
      <q-item v-for="n in returnTransactions" :key="n['.key']">
        <q-item-section top avatar>
            <q-avatar color="white" text-color="teal" icon="payment"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>#{{n.TransactionID}}</q-item-label>
          <q-item-label caption lines="2">Paid {{n.Total | currency}}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>{{$moment(n.timestamp.toDate()).fromNow()}}</q-item-label>
        </q-item-section>
      </q-item>
      <!-- <q-separator spaced />
      <q-item-label header>
          Latest Activity
          <q-btn outline="" color="teal-5" label="see more" size="xs" class="float-right"/>
      </q-item-label>
      <q-item v-for="n in 4" :key="n">
        <q-item-section top avatar>
            <q-avatar color="teal" text-color="white">D</q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label overline="">DRIVER {{n}}</q-item-label>
          <q-item-label caption lines="2">Paid ₱ 65.00 (MF)</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>5 min ago</q-item-label>
        </q-item-section>
      </q-item> -->
    </q-list>      
  </q-page>
</template>
<script>
import { mapGetters } from 'vuex'
import { firebaseDb, firebaseAuth, firefirestore } from 'boot/firebase'
export default {
  data(){
    return {
       accountLog: {}
    }
  },
  created(){
      let self = this
      firebaseAuth.onAuthStateChanged(function(user) {
          
          if (user) {
          self.accountLog = {...user}
          }
      })
  },
  firestore () {
      return {
            MemberData: firebaseDb.collection('MemberData'),
            Transactions: firebaseDb.collection('Transactions'),
            BillingTrackers: firebaseDb.collection('BillingTrackers'),
      }
  },
  computed:{
    returnMemberData(){
        try {
            let user = this.accountLog
            let split = user.email.split('@')
            let id = split[0].toUpperCase()

            return this.MemberData.filter(a=>{
                return id == a['.key']
            })[0]                
        } catch (error) {
            return {}
        }
    },    
    returnLatestBillings(){
      try {
        let key = this.returnMemberData['.key']
        console.log(key,'key returnLatestBillings')
        let bills = this.BillingTrackers.filter(a=>{
          return a.MemberData['.key'] == key
        })
        console.log(bills, 'returnLatestBillings')
        return this.$lodash.orderBy(bills,q=>{
          return q.timestamp.toDate()
        },'desc')
      } catch (error) {
        console.log(error,'returnLatestBillings');
        return []
      }
    },
    returnTransactions(){
        try {
            let key = this.returnMemberData['.key']
            let filter = this.Transactions.filter(a=>{
                return a.MemberID == key
            })
            let order = this.$lodash.orderBy(filter,a=>{
                return a.timestamp.toDate()
            },'desc')
            return order
        } catch (error) {
          console.log(error,'returnTransactions')
            return []
        }
    },  
  }
}
</script>