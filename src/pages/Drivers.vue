<template>
    <q-page class="q-mb-xl q-pb-md">
        <q-list>
            <q-item-label header>Driver List</q-item-label>
            <q-item class="q-pa-md" clickable="" v-ripple v-for="n in returnDrivers" :key="n['.key']">
                <q-item-section avatar>
                <q-avatar color="teal" class="text-white">
                    {{n.FirstName.charAt(0)}}
                </q-avatar>
                </q-item-section>
                <q-item-section>
                <div class="text-weight-bold">{{n.FirstName}} {{n.LastName}}</div>
                <div class="text-caption text-uppercase">{{n['.key']}}</div>
                <div class="text-caption text-uppercase" v-if="n.defaultUnit !== undefined ">{{n.defaultUnit.PlateNumber}}</div>
                </q-item-section>
                <q-item-section side>
                <q-btn color="grey-10" icon="edit" flat dense round @click="changeUnit(n['.key'],n.defaultUnit === undefined ? null : n.defaultUnit.PlateNumber)"> 
                <q-tooltip>
                    Edit Default Unit
                </q-tooltip>
                </q-btn>
                </q-item-section>
            </q-item>
        </q-list>
        <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="person_add" color="grey-10" @click="$router.push('/adddriver')">
                <q-tooltip>
                    Add Driver
                </q-tooltip>
            </q-btn>
        </q-page-sticky> -->
    </q-page>
</template>
<script>
import { firebaseDb,firebaseAuth, firefirestore } from 'boot/firebase'
export default {
    data(){
        return{
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
            JeepneyData: firebaseDb.collection('JeepneyData')
        }
    },
    computed:{
      returnMemberData(){
          try {
              let user = firebaseAuth.currentUser
              console.log(user,'user')
              console.log(user.email)
              let split = user.email.split('@')
              let id = split[0].toUpperCase()
              return id.toUpperCase()             
          } catch (error) {
              console.log(error,'error returnMemberData')
              return {}
          }
      },
      returnDrivers(){
        let key = this.returnMemberData
        let filter  = this.MemberData.filter(a=>{
          return a.Operator !== undefined && a.Operator.MemberID == key
        })
        console.log(filter,'filter')
        return filter
      },

    },
    methods:{
        returnOperatorJeep(doNot){
            let key = this.returnMemberData
            let filter  = this.JeepneyData.filter(a=>{
            return a.MemberID == key && a.Status == 'approved' && a.PlateNumber !== doNot
            })    
            let map = filter.map(a=>{
                return {
                    label: a.PlateNumber,
                    value: a
                }
            })   
            if(doNot !== null){
                map.push({label: 'REMOVE DEFAULT', value: null})
            }
            return map
        },
        changeUnit(driverKey,current = null){
            try {
                this.$q.dialog({
                    title: 'Edit Default Unit',
                    message: 'Choose an option:',
                    options: {
                    type: 'radio',
                    model: 'opt1',
                    // inline: true
                    items: this.returnOperatorJeep(current)
                    },
                    cancel: true,
                    persistent: true
                }).onOk(data => {
                    if(data === null){
                        firebaseDb.collection('MemberData').doc(driverKey).update({
                            defaultUnit: firefirestore.FieldValue.delete()
                        }).then(()=>{
                            console.log('update success default unit')
                        })                       
                    } else {
                        console.log('>>>> OK, received', data)
                        firebaseDb.collection('MemberData').doc(driverKey).update({
                            defaultUnit: data
                        }).then(()=>{
                            console.log('update success default unit')
                        })
                    }

                       
                }).onCancel(() => {
                    // console.log('>>>> Cancel')
                })            
            } catch (error) {
                console.log(error,'error')
            }
        }

        
    }
}
</script>