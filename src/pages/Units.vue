<template>
    <q-page class="q-pa-md">
        <div class="text-h6">Units / Jeepney</div>
        <q-list class="q-mt-md">
            <q-item clickable v-ripple v-for="jeep in returnJeepOperator" :key="jeep['.key']">
                <q-item-section avatar>
                    <q-icon color="teal" name="commute" />
                </q-item-section>
                <q-item-section>{{jeep.PlateNumber}}</q-item-section>
                <q-item-section class="text-right">
                    <q-chip color="teal" text-color="white" icon="check" label="Approved" v-if="jeep.Status == 'approved'"/>
                    <q-chip color="warning" text-color="white" icon="warning" label="Pending" v-else-if="jeep.Status =='pending'"/>
                    <q-chip color="red" text-color="white" icon="close" label="Rejected" v-else />
                </q-item-section>
            </q-item>
            <q-item clickable="" class="bg-grey-1 q-mt-md" v-ripple @click="addUnitDialog = true">
                <q-item-section avatar>
                    <q-icon color="teal" name="add" />
                </q-item-section>
                <q-item-section class="text-teal text-weight-bold">Add New Unit</q-item-section>
            </q-item>
        </q-list>

        <q-dialog v-model="addUnitDialog" persistent>
        <q-card class="">
            <q-card-section class="row items-center">
            <div class="text-h6">Add Unit/Jeep
                <q-btn color="grey" icon="close" v-close-popup flat class="absolute-right" />
            </div>
            </q-card-section>
            <q-card-section>
            <div class="row text-grey-8">
                <div class="col">
                    <div class="col q-pr-md">
                    <q-input v-model="JeepneyDetails.PlateNumber" input-class="text-uppercase" type="text" outlined="" label="Enter Plate Number" color="teal"/>
                    <q-input
                        class="q-my-md"
                        color="teal-4"
                        type="file"
                        outlined=""
                        dense
                        hint="Upload Jeepney ORCR"
                        accept="image/*"
                        @change="onFilePicked2"
                        @onfocus="resetimginput2"
                        v-if="uploadReady"
                        ref="imginput2"
                        >
                        <template v-slot:prepend>
                        <q-icon name="attach_file"/>
                        </template>
                    </q-input>

                    <img :src="imageUrl2" width='300' height='150' v-if="imageUrl2 !== null">
                    </div>
                    <div class="col-3 q-gutter-md">
                        <q-btn color="primary" icon="add" label="ADD to list" @click="addJeep2List" />
                        <q-btn color="grey-8" label="reset form" flat @click="resetJeepForm" />
                    </div>



                <br>
                <q-separator spaced inset/>
                <br>
                <span class="q-my-md text-overline q-mt-md">
                    YOU HAVE <span class="text-teal">{{JeepneyList.length}}</span> JEEPNEY / UNITS ADDED: 
                </span>
                <q-list separator="">
                    <q-item v-for="(jeep,i) in JeepneyList" :key="i">
                    <q-item-section top thumbnail class="q-ml-none">
                        <img :src="jeep.ORCRurl">
                    </q-item-section>

                    <q-item-section>
                        <q-item-label caption>Plate No.#</q-item-label>
                        <q-item-label class="text-weight-bold">{{jeep.PlateNumber}}</q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                        <q-btn color="grey" icon="delete" flat dense @click="onDelete(jeep,i)" />
                    </q-item-section>
                    </q-item> 
                </q-list>

                </div>
            </div>
            </q-card-section>
            <q-card-actions align="right">
            <q-btn flat label="Cancel" color="grey-8" v-close-popup @click="removeNewUnitDetails"/>
            <q-btn flat label="SEND FOR APPROVAL" icon-right="send" color="teal" @click="saveNewUnits" :disable="JeepneyList == 0"/>
            </q-card-actions>
        </q-card>
        </q-dialog>
    </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { firebaseDb, firebaseAuth, firefirestore,firebaseSto } from 'boot/firebase'
export default {
    data(){
        return {
            accountLog: null,
            addUnitDialog: false,
            JeepneyDetails:{
                PlateNumber: '',
                ORCR: null
            },
            JeepneyList: [],
            imageUrl2: null,
            uploadReady: true,
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
  methods:{
      removeNewUnitDetails(){
        this.JeepneyDetails.PlateNumber = ''
        this.JeepneyDetails.ORCR = null
        this.JeepneyList = []
        this.imageUrl2 = null
      },
      saveNewUnits(){
        console.log(this.JeepneyList,'newUnits')
        this.$q.dialog({
          title: `Save ${this.JeepneyList.length} New Units`,
          message: 'Would you like to saved these news units ?',
          persistent: true,
          cancel: true
        }).onOk(() => {
          this.$q.loading.show({
              message: '<h6>Some important <b>process</b> is in progress.<br/><span class="text-teal">Hang on...</span></h6>'
          })
          this.jeepAddUpload()
          this.$q.loading.hide()
          this.addUnitDialog = false
          this.$q.notify({
            color: 'teal',
            textColor: 'white',
            icon: 'check',
            message: "Adding Units for Approval Success",
            })
        })        
      },
      onDelete(jeep,i){
        console.log(jeep,i)
        this.JeepneyList.splice(i,1)
      },
      jeepAddUpload(){
          this.JeepneyList.forEach(a=>{
            const filename = a.ORCR.name
            const ext = filename.slice(filename.lastIndexOf('.'))
            let childurl = a.PlateNumber+'_'+this.returnMemberData['.key'] + ext
            return firebaseSto.ref('JeepUploads/' + childurl).put(a.ORCR)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            }).
            then(downloadURL => {
                console.log(`Successfully uploaded file and got download link - ${downloadURL}`);

                let toSave = {
                  PlateNumber: a.PlateNumber,
                  ORCR: downloadURL,
                  dateAdded: firefirestore.FieldValue.serverTimestamp(),
                  MemberID: this.returnMemberData['.key']
                }
                return firebaseDb.collection("JeepneyData").add(toSave);
            })
            .catch(error => {
                // Use to signal error if something goes wrong.
                console.log(`Failed to upload file and get link - ${error.message}`);
            })
          })
      },
      addJeep2List(){
        if(this.JeepneyDetails.PlateNumber == '' || this.JeepneyDetails.ORCR == null){
          this.$q.dialog({
            title: 'Incomplete UNIT Details!',
            message: 'Please fill up all details for your unit/jeep details',
            persistent: true
          })
        } else {
          this.JeepneyDetails.PlateNumber = this.JeepneyDetails.PlateNumber.toUpperCase()
          this.JeepneyList.push(this.JeepneyDetails)
          this.resetJeepForm()
          console.log(this.JeepneyList,'jeep list')
        }      
      },
      resetimginput2(){
        // this.imageUrl2 = null
        this.$refs.imginput2.resetValidation()
      },
      resetJeepForm(){
        this.JeepneyDetails = {
          ORCR: null,
          PlateNumber: ''
        }
        this.imageUrl2 = null
        this.uploadReady = false
        this.$nextTick(() => {
          this.uploadReady = true
        })
      },
      onFilePicked2(event){
        const files = event.target.files
        console.log(files,'files input')
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0){
          return alter('Please add a valid file!')
        }
          const fileReader = new FileReader()
          fileReader.addEventListener('load', () => {
          this.imageUrl2 = fileReader.result
          this.JeepneyDetails.ORCRurl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.JeepneyDetails.ORCR = files[0]
        console.log(this.JeepneyDetails.ORCR,'ORCR')
      },
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
    returnJeepOperator(){
        try {
            let member = this.returnMemberData
            let key = member['.key']

            return this.JeepneyData.filter(a=>{
                a.Status = a.Status !== undefined ? a.Status : 'pending'
                return key == a.MemberID
            })
        } catch (error) {
            console.log(error,'error')
            return []
        }
    } 
  }
}
</script>