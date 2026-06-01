import { Redirect } from 'expo-router';

// Registration is now integrated into the Sign In / Sign Up screen
export default function RegisterRedirect() {
  return <Redirect href="/auth" />;
}
