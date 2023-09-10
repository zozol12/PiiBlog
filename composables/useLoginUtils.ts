export const useLoginUtils = () => {
  const router = useRouter()
  const client = useSupabaseClient()
  async function signIn (email:string, password:string, autoRoute:boolean = true) {
    const { error } = await client.auth.signInWithPassword({
      email, password
    })
    if (error) { throw error }
    if (autoRoute) {
      router.push('/profile')
    }
    return true
  };

  // Sign Up logic
  async function signUp (email:string, password:string, autoRoute:boolean = true) {
    const { data, error } = await client.auth.signUp({
      email, password
    })
    if (error) { throw error }
    if (autoRoute) {
      router.push('/profile')
    }
    return data
  }
  async function signOut (autoRoute:boolean = true) {
    const { error } = await client.auth.signOut()
    if (error) { throw error }
    if (autoRoute) { router.push('/login') }
  }
  return {
    signIn,
    signUp,
    signOut
  }
}
