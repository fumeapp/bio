export interface UserInfo {
  email: string
  name: string
  avatar: string
  payload?: UserPayload
}

export interface GoogleUserInfo {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
}
export interface GithubUserInfo {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  hireable: boolean
  bio: string
  twitter_username: string
  notification_email: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface MicrosoftUserInfo {
  id: string
  displayName: string
  givenName: string
  surname: string
  userPrincipalName: string
  mail: string
  mobilePhone: string
  officeLocation: string
  preferredLanguage: string
  businessPhones: string[]
  jobTitle: string
}

export interface TokenLocation {
  city: string
  region: string
  country: string
  timezone: string
  countryName: string
}
