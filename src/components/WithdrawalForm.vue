<template>
  <div>
    <q-card>
      <q-card-section class="row items-center q-pb-none">

      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
          >
          <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Account Balance
            </q-item-label>
            <q-item-label class="text-h6 text-teal">₱ 5000.00</q-item-label>
            </q-item-section>
          </q-item> 
          <q-input
            prefix="P "
              filled
              v-model="name"
              label="Amount "
              lazy-rules
              autofocus
              :rules="[ val => val && val.length > 0 || 'Please enter amount']"
          />

          <q-item class="bg-grey-2">
            <q-item-section>
            <q-item-label caption lines="2">Remaining Balance
            </q-item-label>
            <q-item-label class="text-h6 text-teal">₱ 5000.00</q-item-label>
            </q-item-section>
          </q-item>

          <div>
              <q-btn label="Submit" type="submit" color="primary" class="full-width"/>
          </div>
          </q-form>
      </q-card-section>
  </q-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: ''
    }
  },
  methods: {
    onSubmit () {
      this.$q.dialog({
        title: 'Withdrawal Confirmation',
        message: 'Would you like to withdraw P 20,000 savings?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }
  }
}
</script>