<template>
    <q-page class="q-mb-xl q-pb-md">
        <q-list>
            <q-item-label header>Driver List</q-item-label>
            <q-item class="q-pa-md" clickable="" v-ripple v-for="n in 10" :key="n">
                <q-item-section avatar>
                <q-avatar color="teal" class="text-white">
                    {{n}}
                </q-avatar>
                </q-item-section>
                <q-item-section>
                <div class="text-weight-bold">DRIVER {{n}}</div>
                <div class="text-caption text-uppercase">driver</div>
                </q-item-section>
                <q-item-section side>
                <q-btn color="grey-10" icon="person" flat dense round @click="$router.push('/profile')"/>
                </q-item-section>
            </q-item>
        </q-list>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="person_add" color="grey-10" @click="$router.push('/adddriver')">
                <q-tooltip>
                    Add Driver
                </q-tooltip>
            </q-btn>
        </q-page-sticky>
    </q-page>
</template>