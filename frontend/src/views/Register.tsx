import { RegisterAuthenticatorPasswordless } from '../components/register/RegisterAuthenticatorPasswordless'
import { RegisterAuthenticatorUsernameless } from '../components/register/RegisterAuthenticatorUsernameless'
import { RegisterPassword } from '../components/register/RegisterPassword'
import { Section } from '../components/Section'

export const Register = () => {
  return (
    <div>
      <Section>
        <RegisterPassword />
      </Section>
      <Section>
        <RegisterAuthenticatorPasswordless />
      </Section>
      <Section>
        <RegisterAuthenticatorUsernameless />
      </Section>
    </div>
  )
}
