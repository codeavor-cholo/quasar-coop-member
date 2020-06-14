<template>
    <q-page class="">
        <div class="full-width text-center q-py-xl bg-white">
                <div class="qr-code">
                    <qrcode :value="qrvalue" tag="img" style="width:150px"></qrcode>
                </div>
            <q-btn color="grey-10" icon="file_download" round class="absolute-top-right q-ma-md">
                <q-tooltip>
                    Print ID
                </q-tooltip>
            </q-btn>     
        </div>
        <div class="fit bg-grey-2">
            <q-list class="full-width q-py-md bg-grey-2 q-mt-md">
                <q-item class="q-pa-md">
                    <q-item-section avatar>
                    <q-avatar color="teal" class="text-white">
                        {{Member.FirstName.slice(0,1).toUpperCase()}}
                    </q-avatar>
                    </q-item-section>
                    <q-item-section>
                    <div class="text-weight-bold">{{Member.FirstName}} {{Member.LastName}}</div>
                    <div class="text-caption text-uppercase">{{Member.Designation}}</div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                    <q-item-label caption>Member ID</q-item-label>
                    <q-item-label>{{Member['.key']}}</q-item-label>
                    </q-item-section>
                    <!-- <q-item-section side top>
                    <q-item-label><q-btn dense color="teal" label="edit" flat size="sm" /></q-item-label>
                    </q-item-section> -->
                </q-item>
                <q-item>
                    <q-item-section>
                    <q-item-label caption>Phone</q-item-label>
                    <q-item-label>{{Member.Phone}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                    <q-item-label caption>Address</q-item-label>
                    <q-item-label>{{Member.Address}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                    <q-item-label caption>Birthdate</q-item-label>
                    <q-item-label>{{$moment(Member.BirthDate).format('MMM DD,YYYY')}}</q-item-label>
                    </q-item-section>
                </q-item>                
                <q-item>
                    <q-item-section>
                    <q-item-label caption>Civil Status</q-item-label>
                    <q-item-label>{{Member.CivilStatus}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                    <q-item-label caption>Employer Company</q-item-label>
                    <q-item-label>{{Member.EmployerCompany}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                    <q-item-label caption>License No.</q-item-label>
                    <q-item-label>{{Member.LicenseNo}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                    <q-item-label caption>License Expiry Date</q-item-label>
                    <q-item-label>{{$moment(Member.LicenseExp).format('MMM DD,YYYY')}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-img
                            :src="Member.imageUrlLic"
                            :ratio="16/9"
                            spinner-color="primary"
                            spinner-size="82px"
                        />
                    </q-item-section>
                </q-item>
            </q-list>
        </div>


    </q-page>
</template>
<script>
import { firebaseDb, firebaseAuth, firefirestore } from 'boot/firebase'
import { date } from 'quasar'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import Vue from 'vue'

Vue.component(VueQrcode.name, VueQrcode);

export default {
    components: {
        VueQrcode
    },
    date(){
        return {
            accountLog: {},
            qrvalue: ''
        }
    },
    created(){
        let self = this
        self.qrvalue = this.$route.params.id

    },

    firestore () {
        return {
            Member: firebaseDb.collection('MemberData').doc(this.$route.params.id),
        }
    },
    computed:{
        
    }
}
</script>