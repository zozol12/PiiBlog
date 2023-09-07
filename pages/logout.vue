<template>
  
</template>

<script setup>
const user = useSupabaseUser()
const router = useRouter()
const client = useSupabaseClient()
const { error } = await client.auth.signOut()
router.push("/login")
</script>

<style>

</style>