<template>
  <q-page class="q-py-sm">
    <q-list>
      <q-item-label header >
            Billing Statements
            <q-btn outline="" color="teal-5" label="see more" size="xs" class="float-right"/>
      </q-item-label>
      <q-item v-for="n in 4" :key="n" clickable="" v-ripple>
        <q-item-section top avatar>
            <q-avatar color="white" text-color="teal" icon="library_books"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>BILL000{{n}}</q-item-label>
          <q-item-label caption lines="2">₱ 500.00 (Loan) </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>April 10 - May 10</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator spaced />
      <q-item-label header>
          Latest Transactions
          <q-btn outline="" color="teal-5" label="see more" size="xs" class="float-right"/>
      </q-item-label>
      <q-item v-for="n in 4" :key="n">
        <q-item-section top avatar>
            <q-avatar color="white" text-color="teal" icon="payment"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>#KSLK988{{n}}</q-item-label>
          <q-item-label caption lines="2">Paid ₱ 65.00 (MF)</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>5 min ago</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>      
  </q-page>
</template>