<template>
  <q-page>
    <q-banner class="bg-orange text-white" v-show="billBanner">
      You have <span class="text-weight-bold">₱ 760.00</span>  due on <span class="text-weight-bold">May 21,2020</span>. Click view button to see billing breakdown details.
      <template v-slot:action>
        <q-btn flat color="white" label="dismiss" @click="billBanner = !billBanner" />
        <q-btn flat color="white" label="View Billing Statement" @click="$router.push('/bill')"/>
      </template>
    </q-banner>
    <q-list >
      <q-item class="bg-grey-2 q-pa-md">
        <q-item-section avatar>
          <q-avatar color="teal" class="text-white">
            M
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <div class="text-weight-bold">MEMBER NAME</div>
          <div class="text-caption text-uppercase">driver / operator</div>
        </q-item-section>
        <q-item-section side>
          <q-btn color="grey-10" icon="person" flat dense round @click="$router.push('/profile')"/>
        </q-item-section>
      </q-item>
      <q-item class="bg-grey-2" clickable="" v-ripple to="/bill">
        <q-item-section>
          <q-item-label caption lines="2">Due Amount (for Month)
          </q-item-label>
          <q-item-label class="text-h6 text-orange">₱ 760.00</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-avatar text-color="grey-10" icon="library_books"/>
        </q-item-section>
      </q-item>
      <div v-if="role == 'operator'">
        <q-item class="bg-grey-2" clickable="" v-ripple v-for="n in 3" :key="n" to="/quota">
          <q-item-section>
            <q-item-label overline>Driver {{n}}</q-item-label>
            <q-item-label caption lines="2">Monthly Quota Balance</q-item-label>
            <q-item-label class="text-h6 text-teal">₱ {{returnValueToPay(n)}}.00 / {{18 - n}} Days Left</q-item-label>
                <q-linear-progress stripe rounded size="20px" :value="returnValueN(n)" color="warning" class="q-mt-sm" />
          </q-item-section>
        </q-item>
      </div>
      <div v-else>
        <q-item class="bg-grey-2" clickable="" v-ripple to="/quota">
          <q-item-section>
            <q-item-label caption lines="2">Monthly Quota Balance</q-item-label>
            <q-item-label class="text-h6 text-teal">₱ 650.00 / 10 Days Left</q-item-label>
                <q-linear-progress stripe rounded size="20px" :value="progress" color="warning" class="q-mt-sm" />
          </q-item-section>
        </q-item>
      </div>
      <q-item class="bg-grey-2 q-pb-md" clickable="" v-ripple to="/cashadvance">
        <q-item-section>
          <q-item-label caption lines="2">Cash Advance Balance</q-item-label>
          <q-item-label class="text-h6 text-teal">₱ 650.00 / ₱ 1000.00</q-item-label>
              <q-linear-progress stripe rounded size="20px" :value="progress" color="warning" class="q-mt-sm" />
        </q-item-section>
      </q-item>
      <q-item-label header>Latest 10 Transactions</q-item-label>
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
    </q-list>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data(){
    return {
      progress: .6,
      role: 'operator',
      billBanner: true,
    }
  },
  methods:{
    returnValueN(n){
      let string = '.' + n
      return parseFloat(string)
    },
    returnValueToPay(n){
      return 65 * n
    }
  }
}
</script>
