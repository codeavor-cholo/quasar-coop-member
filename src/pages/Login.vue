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
                <q-input v-model="email" type="email" label="Email" standout="" color="white" class=" q-my-md"/>

                <q-input v-model="password" type="password" label="Password" standout="" color="white" class="q-mb-md"/>

                <q-btn color="grey-10" label="LOGIN" @click="$router.push('/')" />
            </div>
            </q-slide-transition>
        </div>

    </q-page>
</template>
<script>
export default {
    data(){
        return {
            email:'',
            password: '',
            login: false,
        }
    },
    created(){
        setTimeout(()=>{
            this.login = true
        },5000)
    }
}
</script>