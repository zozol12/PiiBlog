

<script setup>
    const user = useSupabaseUser();
    const router = useRouter();


    if(user.value) router.push("/profile")

    const state = ref({
        email: undefined,
        password: undefined,
    })

    const errorMsg = ref(null)
    const successMsg = ref(null)

    let isLoading = false

    const client = useSupabaseClient()

    const form = ref()
    // Sign Up logic
    async function signIn () {
        isLoading = true
        try{
            // Do something with state.value
            const {error} = await client.auth.signInWithPassword({
                email: state.value.email, password: state.value.password
            })
            if (error) throw error
            router.push("/profile")
        } catch (error) {
            errorMsg.value = error.message
        }
        isLoading = false
    }
</script>

<template>
    <UCard>
        <template #header >Login</template>
        <UForm
            ref="form"
            :state="state"
            @submit.prevent="signIn"
        >
            <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
            </UFormGroup>
            <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
            </UFormGroup>
            <UButton v-bind:loading="isLoading" type="submit">
            Submit
            </UButton>
            <ULink to="/register"> Don't have an account?</ULink>
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