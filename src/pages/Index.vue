<template>
  <q-page>
    <div v-show="returnMemberData">
    <q-banner class="bg-info text-white" v-show="returnUnClaimedBenifits !== 0">
      <q-icon name="info"/>
      You are now eligible to ask for  {{ returnUnClaimedBenifits | currency }} cash assitance for your driver license renewal. Click <b>CLAIM</b> to transfer the cash assitance to your savings account.
      <template v-slot:action>
        <q-btn flat color="white" label="Claim" @click="claimBenefits"/>
      </template>
    </q-banner>
    </div>
    <div v-if="returnLastestBillingQuota !== null && returnMemberData.Designation == 'Operator' && billBanner == true">
    <q-banner class="bg-orange text-white">
      You have recieved <b>{{returnLastestBillingQuota.length}}</b> Billing Statement<span v-show="returnLastestBillingQuota.length > 0">s</span>.
      <br><br>
      <div v-for="quota in returnLastestBillingQuota" :key="quota['.key']"  >
        <span v-show="hideIfPaid(quota)"><span class="text-weight-bold">{{quota.QuotaBalance | currency}}</span>  balance for <span class="text-weight-bold">{{quota.BillingMonth}}</span> for unit <b>{{quota.PlateNumber}}</b></span>
      </div> 
      <br>
      Click view button to see billing breakdown details.
        <template v-slot:action>
          <q-btn flat color="white" label="dismiss" @click="billBanner = !billBanner" />
          <q-btn flat color="white" :label="returnLastestBillingQuota.length > 1 ? 'View Billing Statements' : 'View Billing Statement'" @click="$router.push('/notifications')"/>
        </template>   
    </q-banner>
    </div>
    <q-banner class="bg-orange text-white" v-if="returnLastestBillingCashAdvance !== null && billBanner2 == true">
      You have recieved <b>{{returnLastestBillingCashAdvance.Bills.length}}</b> Billing Statement<span v-show="returnLastestBillingCashAdvance.Bills.length > 1">s</span> for <span class="text-weight-bold">{{returnLastestBillingCashAdvance.BillingDate}}</span>.
      <br><br>
      <div v-for="loan in returnLastestBillingCashAdvance.Bills" :key="loan['.key']">
        <span v-show="hideIfFullNa(loan)"><span class="text-weight-bold">{{loan.BillingBalance | currency}}</span> cash advance balance ( ID: #{{loan.CashReleaseTrackingID.toUpperCase()}} )</span>
      </div> 
      <br>
      Click view button to see billing breakdown details.
      <template v-slot:action>
        <q-btn flat color="white" label="dismiss" @click="billBanner2 = !billBanner2" />
          <q-btn flat color="white" :label="returnLastestBillingCashAdvance.Bills.length > 0 ? 'View Billing Statements' : 'View Billing Statement'" @click="$router.push('/notifications')"/>
      </template>
    </q-banner>
    <q-list >
      <q-item class="bg-grey-2 q-pa-md">
        <q-item-section avatar>
          <q-avatar color="teal" class="text-white">
            M
          </q-avatar>
        </q-item-section>
        <q-item-section v-if="returnMemberData">
          <div class="text-weight-bold">{{returnMemberData.FirstName}} {{returnMemberData.LastName}}</div>
          <div class="text-caption text-uppercase">{{returnMemberData.Designation}}</div>
        </q-item-section>
        <q-item-section side>
          <q-btn color="grey-10" icon="person" flat dense round @click="$router.push(`/profile/${returnMemberData['.key']}`)"/>
        </q-item-section>
      </q-item>
      <!-- <q-item class="bg-grey-2" clickable="" v-ripple to="/bill">
        <q-item-section>
          <q-item-label caption lines="2">Due Amount (for Month)
          </q-item-label>
          <q-item-label class="text-h6 text-orange">₱ 760.00</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-avatar text-color="grey-10" icon="library_books"/>
        </q-item-section>
      </q-item> -->
      <div v-if="returnMemberData.Designation == 'Operator'">
        <q-item class="bg-grey-2" clickable="" v-ripple v-for="n in returnQuotaBalanceOperator" :key="n.unit" :to="`/quota/${n.uniKey}`">
          <q-item-section>
            <q-item-label overline>{{n.unit}}</q-item-label>
            <q-item-label caption lines="2">Monthly Quota Balance ( {{n.remainingDays}} Days Left )</q-item-label>
            <q-item-label class="text-h6 text-teal">{{n.quotaTotalPaid | currency}} / {{n.quotaTotalPayment | currency}}</q-item-label>
                <q-linear-progress stripe rounded size="20px" :value="n.progress" color="warning" class="q-mt-sm" />
          </q-item-section>
        </q-item>
      </div>
      <!-- <div v-else>
        <q-item class="bg-grey-2" clickable="" v-ripple to="/quota">
          <q-item-section>
            <q-item-label caption lines="2">Monthly Quota Balance</q-item-label>
            <q-item-label class="text-h6 text-teal">₱ {{returnQuotaBalance.quotaBalance}}.00 / {{returnQuotaBalance.remainingDays}} Days Left</q-item-label>
                <q-linear-progress stripe rounded size="20px" :value="returnQuotaBalance.progress" color="warning" class="q-mt-sm" />
          </q-item-section>
        </q-item>
      </div> -->
      <q-item class="bg-grey-2 q-pb-md" clickable="" v-ripple :to="`/cashadvance/${index}`" v-for="(m,index) in returnCashAdvanceBalance" :key="index">
        <q-item-section>
          <q-item-label caption lines="2">Cash Advance Balance ( ID: #{{m.loanID.toUpperCase()}} )</q-item-label>
          <q-item-label class="text-h6 text-teal">{{m.paid | currency}} / {{m.totalBalance | currency}}</q-item-label>
              <q-linear-progress stripe rounded size="20px" :value="m.progress" color="warning" class="q-mt-sm" />
        </q-item-section>
      </q-item>
      <q-item-label header>Latest Transactions</q-item-label>
      <div v-for="n in returnLatestTransactions.slice(0, 10)" :key="n['.key']">
      <q-item clickable="" v-ripple class="cursor-pointer" :to="`/reciept/${n['.key']}`">
        <q-item-section>
          <q-item-label>#{{n.TransactionID}}</q-item-label>
          <q-item-label caption lines="2">
            {{n.AmountPaid | currency}}
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-item-label caption>{{$moment(n.timestamp.toDate()).format('MMM DD,YYYY')}}</q-item-label>
        </q-item-section>
      </q-item>
      </div>
      <br>
    </q-list>
  </q-page>
</template>

<script>
import { firebaseDb, firebaseAuth, firefirestore } from 'boot/firebase'
import { date } from 'quasar'
export default {
  name: 'PageIndex',
  data(){
    return {
      progress: .6,
      role: 'operator',
      billBanner: true,
      billBanner2: true,
      accountLog: {},
    }
  },
  firestore () {
    return {
      MemberData: firebaseDb.collection('MemberData'),
      Transactions: firebaseDb.collection('Transactions'),
      BillingTrackers: firebaseDb.collection('BillingTrackers'),
      JeepneyData: firebaseDb.collection('JeepneyData'),
      ManagementFeeDriver: firebaseDb.collection('FixedPayments').doc('ManagementFeeDriver'),
      ManagementFeeOperator: firebaseDb.collection('FixedPayments').doc('ManagementFeeOperator'),
      InterestRates: firebaseDb.collection('FixedPayments').doc('InterestRates'),
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
  computed:{
    returnLatestTransactions(){
      try {
        let account = this.returnMemberData
        console.log(account,'account')
        let transactions = this.Transactions.filter(a=>{
          return a.MemberID == account['.key']
        })

        return this.$lodash.orderBy(transactions,q=>{
          return q.timestamp.toDate()
        },'desc')
      } catch (error) {
        console.log(error,'returnLatestTransactions')
        return []
      }
    },
    returnLastestBillingQuota(){
      try {
        let key = this.returnMemberData['.key']
        if(this.BillingTrackers == undefined || this.BillingTrackers == null) return null
        let bills = this.BillingTrackers.filter(a=>{
          return a.MemberData['.key'] == key && a.QuotaBalance !== undefined
        })
        console.log(bills,'returnLastestBillingQuota')
        bills.forEach(a=>{
          a.visible = true
        })

        if(bills.filter(a=> { return this.hideIfPaid(a)}).length == 0) return null

        return bills.filter(a=> { return this.hideIfPaid(a) == true})
      } catch (error) {
        console.log(error,'returnLastestBillingQuota')
        return null
      }
    },
    returnLastestBillingCashAdvance(){
      try {
        if(this.BillingTrackers == undefined || this.BillingTrackers == null) return null

        let bills = this.BillingTrackers.filter(a=>{
          return a.MemberData['.key'] == this.returnMemberData['.key'] && a.Advances !== undefined && this.hideIfFullNa(a)
        })

        if(bills == undefined || bills == null) return null

        let group = this.$lodash.groupBy(bills,'BillingDate')
        console.log(group,'group')

        let map = this.$lodash.map(group,function(value,key){
          return {
            BillingDate: key,
            Bills: value
          }
        })

        console.log(map,'map')

        let latest = this.$lodash.orderBy(map,q=>{
          return new Date(q.BillingDate)
        },'desc')[0]

        console.log(latest,'returnLastestBillingCashAdvance')
        // if(latest.Bills.filter(a=> { return this.hideIfFullNa(a)}).length == 0) return null

        if(latest.Bills.length == 0) {
          return null
        } else if(latest == undefined) {
          return null
        } else {
          return latest
        }

      } catch (error) {
        console.log(error,'returnLastestBillingCashAdvance')
        return null
      }
    },
    returnCashAdvanceBalance(){
      try {
        let ca = {paid:0,totalBalance:0,progress: 0}

        let activeLoans = this.returnMemberData.activeLoans
        if(activeLoans == undefined) return []
        console.log(activeLoans,'activeLoans')
        let view = []
        activeLoans.forEach(a=>{
          let total = a.TotalBalance == undefined ? a.toPayAmount : a.TotalBalance
          let push = {paid:a.paidAmount,totalBalance: total ,progress: a.paidAmount/total,loanID:a.CashReleaseTrackingID}
          view.push(push)
        })
        console.log(view,'view')
        return view
      } catch (error) {
        console.log(error,'returnCashAdvanceBalance')
        return []
      }
    },
    returnQuotaBalanceOperator(){
      try{
        let key = this.returnMemberData['.key']
        console.log('key',key)
        let jeeps = this.JeepneyData.filter(a=>{
          return a.MemberID == key && a.Status == 'approved'
        })
        console.log(jeeps,'jeeps')
        let quota = []
        jeeps.forEach(q=>{
          let object = this.returnQuotaBalanceUnit(q['.key'])
          object.unit = q.PlateNumber
          object.uniKey = q['.key']
          quota.push(object)
        })

        console.log(quota,'quota')
        if(jeeps.length == 0) return null

        let todayFormat = date.formatDate(new Date(),'MMM YYYY')
        console.log(todayFormat)
        let quotaFilter = quota.filter(a=>{
          return this.$lodash.findIndex(this.BillingTrackers,x=>{ return a.unit == x.PlateNumber && x.BillingMonth == todayFormat }) == -1
        })

        console.log(quotaFilter,'quotaFilter')

        return quotaFilter
      } catch (error) {
        console.log(error,'error')
        return []       
      }
    },
    returnQuotaBalance(){
      try {
        let quota = {remainingDays: 0, quotaBalance: 0, progress: 0}
        let today = new Date()
        let start = date.startOfDate(today, 'month')
        let end = date.endOfDate(today, 'month')

        console.log(end,start)

        let transactions = this.returnLatestTransactions.filter(a=>{
          let base = a.timestamp.toDate()
          if (date.isBetweenDates(base, start, end, { inclusiveFrom: true, inclusiveTo: true })) {
            return a.ManagementFee !== 0
          }
        })

        let managementFee = this.returnMemberData.Designation == 'Driver' ? this.ManagementFeeDriver.amount : this.ManagementFeeOperator.amount

        if(transactions.length <= 18){
          quota.remainingDays = 18 - transactions.length
          quota.quotaBalance = (18 - transactions.length) * managementFee
          quota.progress = transactions.length/18
        }

        console.log(transactions,'returnQuotaBalance')
        //get number of days paid
        //get amount of management fee
        return quota
      } catch (error) {
        console.log(error,'returnQuotaBalance')
        return {remainingDays: 0, quotaBalance: 0, progress: 0}
      }
    },
    returnMemberData(){
      try {
        let user = firebaseAuth.currentUser == null ? this.accountLog : firebaseAuth.currentUser 
        let split = user.email.split('@')
        let id = split[0].toUpperCase()

        if(user){

        } else {
          return {
            FirstName: '',
            LastName: '',
            Designation: ''
          }
        }


        return this.MemberData.filter(a=>{
          return id == a['.key']
        })[0]
      } catch (error) {
        console.log(error,'err')
        return {
          FirstName: '',
          LastName: '',
          Designation: ''
        }
      }
    },
    returnUnClaimedBenifits(){
      let member = this.returnMemberData
      let capital = member.ShareCapital ?? 0
      let claimed = member.BenefitsClaimed ?? 0
      let claimedTimes = claimed == 0 ? 0 : (claimed / 600)
      let unclaimedTimes = capital == 0 ? 0 : Math.floor(capital / 2000) - claimedTimes
      return unclaimedTimes * 600
    }    
  },
  methods:{
    claimBenefits(){
      let MemberID = this.returnMemberData['.key']
      console.log(MemberID,'yeah')
      this.$q.dialog({
        title: 'Claim Cash Assitance',
        message: `Would you like to claim cash assitance of P${this.returnUnClaimedBenifits}? This action cannot be undone.`,
        ok: 'yes, i want to claim it.',
        cancel: 'no',
        persistent: true,
        color: 'teal'
      }).onOk(() => {
          firebaseDb.collection('MemberData').doc(MemberID).update({
               SavingsDeposit: firefirestore.FieldValue.increment(this.returnUnClaimedBenifits),
               BenefitsClaimed: firefirestore.FieldValue.increment(this.returnUnClaimedBenifits),
          }).then(()=>{
            this.$q.notify({
              icon: 'info',
              color: 'positive',
              message: 'Cash Assitance Transfer Success'
            })            
          }).catch(err =>{
            console.error(err)
          })          
      })      
    },
    hideBanner(quota){
      quota.visible = false
    },
    returnValueN(n){
      let string = '.' + n
      return parseFloat(string)
    },
    returnValueToPay(n){
      return 65 * n
    },
    hideIfFullNa(cashadvance){
      return this.$lodash.findIndex(this.BillingTrackers,x=>{ return cashadvance.CashReleaseTrackingID == x.CashReleaseTrackingID && x.paymentStatus == 'Full Payment' }) == -1
    },
    hideIfPaid(bill){
      return this.$lodash.findIndex(this.BillingTrackers,x=>{ return bill.PlateNumber == x.PlateNumber && x.BillingMonth == bill.BillingMonth && x.paymentStatus == 'Full Payment' }) == -1
    },
    returnQuotaBalanceUnit(unit){
      try {
        let quota = {remainingDays: 0, quotaBalance: 0, progress: 0}
        let today = new Date()
        let start = date.startOfDate(today, 'month')
        let end = date.endOfDate(today, 'month')

        console.log(end,start)

        let transactions = this.returnLatestTransactions.filter(a=>{
          let base = a.timestamp.toDate()
          if (date.isBetweenDates(base, start, end, { inclusiveFrom: true, inclusiveTo: true })) {
            // console.log(a,'jeep with quota')
            if(a.jeepneyDetails){
              return a.ManagementFee !== 0 && a.jeepneyDetails['.key'] == unit
            }
          }
        })

        let managementFee = this.returnMemberData.Designation == 'Driver' ? this.ManagementFeeDriver.amount : this.ManagementFeeOperator.amount

        // recompute
        let sumQuota = this.$lodash.sumBy(transactions,a=>{
          return parseFloat(a.ManagementFee)
        })

        // console.log(sumQuota,'sumQuota')

        if(transactions.length <= 18){
          quota.remainingDays = 18 - transactions.length
          quota.quotaBalance = (18 - transactions.length) * managementFee
          quota.progress = transactions.length/18
          quota.quotaTotalPayment = sumQuota + (quota.remainingDays * managementFee)
          quota.quotaTotalPaid = sumQuota
        }

        // console.log(transactions,'returnQuotaBalance - transactions')
        //get number of days paid
        //get amount of management fee
        return quota
      } catch (error) {
        console.log(error,'returnQuotaBalance')
        return {remainingDays: 0, quotaBalance: 0, progress: 0}
      }
    },
  }
}
</script>
