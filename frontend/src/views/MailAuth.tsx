import { useParams } from 'react-router-dom'

export const MailAuth = () => {
  const { authString } = useParams()
  return <h1>{authString}</h1>
}
