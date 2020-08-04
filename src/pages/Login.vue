<template>
    <q-page class="flex bg-teal text-white">

        <div class="q-pa-xl text-center absolute-center full-width">
            <q-img
                src="statics/New-GSIS-Cooperative.png"
                :ratio="1"
                width="8em"
            />
            <div v-if="login != true" class="q-pa-md">

                <span class="text-overline">Loading App Data ...</span>
                <br>
                <q-spinner-facebook
                color="white"
                size="4em"
                />
                
            </div>
            <q-slide-transition>
            <div v-show="login" :duration="300">
                <q-input v-model="email" :autofocus="true" @focus="$event.target.select()" ref="emailAdd" type="text" label="Account ID" mask="#######" fill-mask="#######" prefix="NGTSC" standout="" color="white" class=" q-my-md" input-class="text-white" clearable="" />

                <q-input v-model="password" type="password" label="Password" standout="" color="white" class="q-mb-md"/>

                <q-btn color="grey-10" label="LOGIN" @click="loginEmail" />
                <br>
                <q-btn color="grey-10" class="q-mt-md" size="sm" flat label="do you forget your password?" @click="changePassword" />
            </div>
            </q-slide-transition>
        </div>

    </q-page>
</template>
<script>
import { firebaseAuth,firebaseApp,firebaseDb,firefirestore } from 'boot/firebase'
import axios from 'axios'
export default {
    data(){
        return {
            email:'2020069',
            password: '123456',
            login: false,
            MemberData: [],
            Users: []
        }
    },
    // test if database is the sumthing
    mounted() {
            this.$binding('Users', this.$firestoreApp.collection('Users'))
            this.$binding('MemberData', this.$firestoreApp.collection('MemberData'))
    },
    // firestore () {
    //     return {
    //         // Collection  
    //         Users: firebaseDb.collection('Users'),
    //         MemberData: firebaseDb.collection('MemberData')
    //     }
    // },
    created(){
        setTimeout(()=>{
            this.login = true
        },5000)
        let self = this
        firebaseAuth.onAuthStateChanged(function(user) {   
            if (user) {
                // self.$router.push('/account')
            }
        })
    },
    methods:{
        getUID(email){
            return this.$lodash.filter(this.Users,a=>{
                  return a.Email == email
            })[0]['.key']
        },
        getNumber(email){
            return this.$lodash.filter(this.MemberData,a=>{
                  return a['.key'] == `NGTSC${email}` && a.isNewMember == false
            })[0].Phone
        },
        changePassword(){
            console.log(this.email,'email')
            // https://fierce-oasis-90806.herokuapp.com/changePassword

            if(this.email == null || this.email == '' || this.email == undefined || this.email == '#######'){
                this.$q.dialog({
                    title: `Please type your account number first`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Ok',
                }).onOk(()=>{

                })
            } else {

                this.$q.dialog({
                    title: `Do you want to reset your password?`,
                    message: `A text message will be sent to you with your new temporary password. You can change it once you login. This action cannot be undone, once confirmed.`,
                    type: 'negative',
                    color: 'teal',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Yes, Reset my Password',
                    cancel: {
                        color: 'grey-10',
                        flat: true
                    }
                }).onOk(()=>{
                    let checkInUsers = this.$lodash.findIndex(this.Users,a=>{
                        return a.Email == `NGTSC${this.email}@coop.com`
                    })

                    console.log(checkInUsers,'asd')

                    if(checkInUsers > -1){
                        this.$q.loading.show({
                            message: '<h6>Important Process Ongoing</h6>'
                        })
                        this.confirmChangePassword()
                    } else {
                        this.$q.dialog({
                            title: `This account has no access to the system. It may be resigned or inactive. Please contact admin for assistance.`,
                            type: 'negative',
                            color: 'negative',
                            textColor: 'white',
                            icon: 'warning',
                            ok: 'Ok',
                            
                        }).onOk(()=>{

                        })                            
                    }
                })  
            }


        },
        confirmChangePassword(){
            return new Promise(async (resolve) => {
                let emailAdd = `ngtsc${this.email}@coop.com`
                const checker = `NGTSC${this.email}@coop.com`
                const uid = this.getUID(checker).toString()

                const password = Math.random().toString(36).slice(-6).toUpperCase()

                console.log(this.getUID(checker),'checkr')
                console.log(this.getNumber(this.email),'Phone')

                this.$q.loading.show({
                    message: '<h6>Sending SMS</h6>'
                })
                await this.sendAccountMessage(password,this.getNumber(this.email))
                this.$q.loading.show({
                    message: '<h6>Updating Account</h6>'
                })
                await this.changePasswordInServer(password,uid)
                .then(res=>{
                    if(res.data == 'Error updating user'){
                        this.$q.dialog({
                            title: `Password Reset Failed`,
                            type: 'positive',
                            color: 'positive',
                            textColor: 'white',
                            icon: 'info',
                            ok: 'Ok',
                            
                        })                      
                    } else {
                        this.$firestoreApp.collection('Users').doc(uid).update(
                            { updatePass: firefirestore.FieldValue.delete() }
                        ).then(()=>{
                            this.$q.loading.hide()
                            this.$q.dialog({
                                title: `Password Reset Done!`,
                                type: 'positive',
                                color: 'positive',
                                textColor: 'white',
                                icon: 'info',
                                ok: 'Ok',
                                
                            }).onOk(()=>{   
                                // resolve(response)
                            })                 
                        }).catch(err=>{
                            console.log(err,'update delete failed')
                        })
                    }
                })
                //
            })
        },
        changePasswordInServer(password,uid){
            return new Promise(async (resolve) => { 

                var senddata = 'password=' + password + '&' + 'uid=' + uid
                console.log(senddata,'data')
                // const options = {
                //     method: 'POST',
                //     headers: { 'Access-Control-Allow-Origin': '*' },
                //     data: senddata,
                //     url: 'https://fierce-oasis-90806.herokuapp.com/changePassword',
                // }    

                axios.post('https://fierce-oasis-90806.herokuapp.com/changePassword', senddata)
                .then(response => {
                console.log(response,'response')
                return resolve(response)
                })
                .catch(err =>{
                console.log('changePasswordInServer',err)
                })                
                
            })
        },
        sendAccountMessage(password,mobile){
            return new Promise(async (resolve) => {   

                let message = `Your password has been reset and your new Temporary Password is ${password}. Please login to change it.`
                var senddata = 'number=' + mobile + '&' + 'message=' + message + '&' + 'apinumber=' + 4
                console.log(senddata,'data')

                axios.post('https://toned-tabulation.000webhostapp.com/index.php', senddata)
                .then(response => {
                console.log(response,'response')
                resolve(response)
                })
                .catch(err =>{
                console.log('sendAccountMessage',err)
                })
            })  
        },
        loginEmail(){
            let emailAdd = `ngtsc${this.email}@coop.com`
            let self = this
            let firstLogin = false

              let checkMembership = this.$lodash.findIndex(this.MemberData,a=>{
                  return a['.key'] == `NGTSC${this.email}` && a.isNewMember == false
              })
                console.log(checkMembership,'index')

                let checkResigned = this.$lodash.findIndex(this.MemberData,a=>{
                  return a['.key'] == `NGTSC${this.email}` && a.isNewMember == false && a.resigned == true
                })

                if(checkResigned > -1){
                     self.$q.dialog({
                        title: `This account has no access to the system. It may be resigned or inactive. Please contact admin for assistance.`,
                        type: 'negative',
                        color: 'negative',
                        textColor: 'white',
                        icon: 'warning',
                        ok: 'Ok',
                        
                    }).onOk(()=>{

                    })                   
                } else {

                    if(checkMembership > -1){

                        firebaseAuth.signInWithEmailAndPassword(emailAdd, this.password)
                        .then(result => {
                        console.log(result, 'result')

                        let user = result.user
                        console.log(user,'user')

                        //check if paid na

                        let findUser = this.Users.filter(a=>{
                            return a.MemberID == `NGTSC${this.email}`
                        })[0]

                        if(findUser.updatePass == undefined || findUser.updatePass == null){
                            firstLogin = true
                        }

                        firebaseAuth.setPersistence(this.$firebase.auth.Auth.Persistence.LOCAL)
                            .then(function() {
                                console.log('setPersistence!')
                                // Existing and future Auth states are now persisted in the current
                                // session only. Closing the window would clear any existing state even
                                // if a user forgets to sign out.
                                // ...
                                // New sign-in will be persisted with session persistence.
                                return firebaseAuth.signInWithEmailAndPassword(emailAdd, self.password);
                            })
                            .catch(function(error) {
                                // Handle Errors here.
                                
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                console.log(errorMessage)
                            });

                            if(firstLogin == true){
                                self.$router.push('/changepassword')
                            } else {
                                self.$router.push('/account')
                            } 

                        })
                        .catch(err =>{
                            console.log(err, 'error')
                            self.$q.dialog({
                                title: `${err.message}`,
                                type: 'negative',
                                color: 'negative',
                                textColor: 'white',
                                icon: 'warning',
                                ok: 'Ok',
                                
                            }).onOk(()=>{
                                // this.email = ''
                                this.password = ''
                            })
                            //this.isLoading = false
                        })


                    } else {
                    

                        self.$q.dialog({
                            title: `It seems your not a member yet, Please do visit the coop office and pay your membership fee to activate your account. Thank you.`,
                            type: 'negative',
                            color: 'negative',
                            textColor: 'white',
                            icon: 'warning',
                            ok: 'Ok',
                            
                        }).onOk(()=>{

                        })

                    }

                }




        },
    }
}
</script>