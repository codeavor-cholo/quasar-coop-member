<template>
    <q-page class="">
        <div class="full-width text-center q-py-xl bg-white">
            <q-img
                src="statics/sample.png"
                :ratio="1"
                width="40vw"
                spinner-color="primary"
                spinner-size="82px"
            />        
            <q-btn color="grey-10" icon="file_download" round @click="onClick" class="absolute-top-right q-ma-md">
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
                        M
                    </q-avatar>
                    </q-item-section>
                    <q-item-section>
                    <div class="text-weight-bold">MEMBER NAME</div>
                    <div class="text-caption text-uppercase">driver / operator</div>
                    </q-item-section>
                </q-item>
                <q-item v-for="n in 10" :key="n">
                    <q-item-section>
                    <q-item-label caption>Label</q-item-label>
                    <q-item-label>Single line item</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                    <q-item-label><q-btn dense color="teal" label="edit" flat size="sm" @click="onClick" /></q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>


    </q-page>
</template>
<script>
export default {
    date(){
        return {

        }
    }
}
</script>