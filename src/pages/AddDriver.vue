<template>
    <q-page class="text-grey-10">
    <div class="text-h6 q-px-md q-pt-md">Add New Driver</div>

    <q-stepper
      v-model="step"
      vertical
      color="grey-10"
      animated
      flat
      class="q-pa-none"
      active-color="blue-10"
      done-color="teal"
      header-nav=""
    >
      <q-step
        :name="1"
        title="Personal Details"
        icon="person"
        :done="step > 1"
      >
        <div class="q-gutter-md q-pt-md">
            <q-input v-model="text" type="text" label="First Name" outlined="" color="grey-10"/>
            <q-input v-model="text" type="text" label="Last Name" outlined="" color="grey-10"/>
            <q-select v-model="model" :options="options" label="Civil Status" outlined="" color="grey-10"/>
            <q-input v-model="text" type="date" hint="Birth Date" outlined="" color="grey-10"/>
            <q-input v-model="text" type="text" label="Birth Place" outlined="" color="grey-10"/>
        </div>
        <q-stepper-navigation>
          <q-btn @click="step = 2" color="grey-10" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Contact Details"
        icon="phone"
        :done="step > 2"
      >
        <div class="q-gutter-md q-pt-md">
            <q-input v-model="text" type="textarea" label="Address" outlined="" color="grey-10"/>
            <q-input v-model="text" type="number" label="Contact Number" outlined="" color="grey-10"/>
            <q-input v-model="text" type="email" label="Email Address" outlined="" color="grey-10"/>
        </div>
        <q-stepper-navigation>
          <q-btn @click="step = 3" color="grey-10" label="Continue" />
          <q-btn flat @click="step = 1" color="grey-10" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Other Details"
        icon="list"
        :done="step > 3"
      >
        <div class="text-caption">Employment</div>
        <div class="q-gutter-md q-pt-md">
            <q-input v-model="text" type="number" label="Salary" outlined="" color="grey-10"/>
            <q-input v-model="text" type="text" label="Other Soures of Income" outlined="" color="grey-10"/>
        </div>
        <div class="text-caption q-pt-md">Family Background</div>
        <div class="q-gutter-md q-pt-md">
            
            <q-input v-model="text" type="text" label="Nearest Relative" outlined="" color="grey-10"/>
            <q-input v-model="text" type="text" label="Relationship" outlined="" color="grey-10"/>
            <q-input v-model="text" type="number" label="Number of Dependents" outlined="" color="grey-10"/>
        </div>
        <q-stepper-navigation>
          <q-btn @click="step = 4" color="grey-10" label="Continue" />
          <q-btn flat @click="step = 2" color="grey-10" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>        
      </q-step>

      <q-step
        :name="4"
        title="Official ID's / Documents"
        icon="assignment_ind"
      >
        <div class="text-caption">Upload Driver's License</div>
        <div class="q-gutter-md q-pt-md">
            <q-input v-model="text" type="file" outlined="" color="grey-10" hint="License Picture"/>
            <q-input v-model="text" type="text" label="License No." outlined="" color="grey-10"/>
            <q-input v-model="text" type="date" hint="Expiration Date" outlined="" color="grey-10"/>
        </div>

        <q-stepper-navigation>
          <q-btn color="grey-10" label="Finish Application" />
          <q-btn flat @click="step = 3" color="grey-10" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            step: 4,
            firstName: '',
            lastName: '',
            civilStatus: '',
            
            text: '',
            options: ['Single','Married','Separated'],
            model: ''
        }
    }
}
</script>