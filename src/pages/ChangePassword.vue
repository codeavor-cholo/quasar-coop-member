<template>
    <q-page class="flex bg-teal text-white">

        <div class="q-pa-xl text-center absolute-center full-width">

            <h6 class="q-mb-md">Create your new password</h6>
            <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'" autofocus="" hint="New Password" standout=""  color="white" input-class="text-white">
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
            <q-input v-model="confirmPassword" filled type="password" hint="Confirm New Password"  standout=""  color="white" input-class="text-white" class="q-my-md"/>
            <q-btn color="grey-10"  class="" label="UPDATE PASSWORD" @click="updatePassword" />

        </div>
    </q-page>
</template>
<script>
import { firebaseAuth,firebaseApp,firebaseDb } from 'boot/firebase'
export default {
    data(){
        return{
            confirmPassword: '',
            password: '',
            isPwd: true
        }
    },
    firestore () {
        return {
            // Collection  
            Users: firebaseDb.collection('Users'),
        }
    },
    methods:{
        updatePassword(){
            var user = firebaseAuth.currentUser;
            let self = this

            console.log(user,'user')
            let email = user.email.split('@')
            let id = email[0].toUpperCase()

            let getKey = this.Users.filter(a=>{
                return a.MemberID == id
            })[0]

            if(self.password == self.confirmPassword){
                user.updatePassword(self.password).then(function() {
                // Update successful.
                    console.log('update success')

                    firebaseDb.collection("Users").doc(getKey['.key']).update({
                        updatePass: true
                    })
                    .then(()=>{
                        var userNew = firebaseAuth.currentUser;
                        var credential = self.$firebase.auth.EmailAuthProvider.credential(user.email, self.password);

                        userNew.reauthenticateWithCredential(credential).then(function() {
                        // User re-authenticated.
                            self.$router.push('/account')
                        }).catch(function(error) {
                        // An error happened.
                            console.log(error,'error')
                        });
                        
                    })
                }).catch(function(error) {
                // An error happened.
                    console.log(error,'error')
                    self.$q.dialog({
                        title: `${error.message}`,
                        type: 'negative',
                        color: 'negative',
                        textColor: 'white',
                        icon: 'warning',
                        ok: 'Ok',
                        
                    }).onOk(()=>{
                        self.clearPasswords()
                    })
                    
                });
            } else {
                self.$q.dialog({
                    title: `Password Does Not Match! Please re-type password.`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning',
                    ok: 'Ok',
                    
                }).onOk(()=>{
                    self.clearPasswords()
                })
            }

        },
        clearPasswords(){
            this.password = ''
            this.confirmPassword = ''
        }
    }
}
</script>