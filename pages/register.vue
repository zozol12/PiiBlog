

<script setup>
    const state = ref({
        email: undefined,
        password: undefined,
    })

    const errorMsg = ref(null)
    const successMsg = ref(null)

    const client = useSupabaseClient()

    const form = ref()
    // Sign Up logic
    async function signUp () {
        try{
            // Do something with state.value
            const {data, error} = await client.auth.signUp({
                email: state.value.email, password: state.value.password
            })
            if (error) throw error
            successMsg.value = "Check your email to confirm"
        } catch (error) {
            errorMsg.value = error.message
        }
    }
</script>

<template>
    <UCard>
        <template #header >Register</template>
        <UForm
            ref="form"
            :state="state"
            @submit.prevent="signUp"
        >
            <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
            </UFormGroup>
            <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
            </UFormGroup>
            <UButton type="submit">
            Submit
            </UButton>
            <ULink to="/login"> Already have an account?</ULink>
            <div v-if="errorMsg">{{errorMsg.value}}</div>
            <UAlert color="red" variant="solid" v-if="errorMsg"> 
                <template #title> Error </template>
                <template #description>{{errorMsg}}</template>
            </UAlert>
            <UAlert color="green" variant="solid" v-else-if="successMsg">
                <template #title> Success </template>
                <template #description>{{successMsg}}</template>
            </UAlert>
        </UForm>
  </UCard>  
</template>

<style>

</style>