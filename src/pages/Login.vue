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
                <q-input v-model="email" :autofocus="true" @focus="$event.target.select()" ref="emailAdd" type="text" label="Account ID" mask="#######" fill-mask="#######" prefix="NGTSC" standout="" color="white" class=" q-my-md" input-class="text-white"/>

                <q-input v-model="password" type="password" label="Password" standout="" color="white" class="q-mb-md"/>

                <q-btn color="grey-10" label="LOGIN" @click="loginEmail" />
            </div>
            </q-slide-transition>
        </div>

    </q-page>
</template>
<script>
import { firebaseAuth,firebaseApp,firebaseDb } from 'boot/firebase'
export default {
    data(){
        return {
            email:'2020069',
            password: '123456',
            login: false,
        }
    },
    firestore () {
        return {
            // Collection  
            Users: firebaseDb.collection('Users'),
            MemberData: firebaseDb.collection('MemberData')
        }
    },
    created(){
        setTimeout(()=>{
            this.login = true
        },5000)
        let self = this
        firebaseAuth.onAuthStateChanged(function(user) {   
            if (user) {
                self.$router.push('/account')
            }
        })
    },
    methods:{
        loginEmail(){
            let emailAdd = `ngtsc${this.email}@coop.com`
            let self = this
            let firstLogin = false

              let checkMembership = this.$lodash.findIndex(this.MemberData,a=>{
                  return a['.key'] == `NGTSC${this.email}` && a.isNewMember == false
              })
                console.log(checkMembership,'index')

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
                            this.email = ''
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


        },
    }
}
</script>