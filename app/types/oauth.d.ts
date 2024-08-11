export interface OauthProvider {
  id: string
  name: string
  secret: string
  issuer: import('openid-client').IssuerMetadata
  scope: string
  callback: string
}

export interface UserInfo {
  name: string
  avatar: string
  email: string
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

/*

type MicrosoftOauthUser struct {
	Id                string `json:"id"`
	DisplayName       string `json:"displayName"`
	GivenName         string `json:"givenName"`
	Surname           string `json:"surname"`
	UserPrincipalName string `json:"userPrincipalName"`
	Mail              string `json:"mail"`
	MobilePhone       string `json:"mobilePhone"`
	OfficeLocation    string `json:"officeLocation"`
	PreferredLanguage string `json:"preferredLanguage"`
	BusinessPhones    []string
	JobTitle          string `json:"jobTitle"`
}

*/

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
  info: {
    email?: string
    name: string
    avatar: string
  }
}

export interface TokenLocation {
  city: string
  region: string
  country: string
  timezone: string
  countryName: string
}

export interface OAuthPayload {
  info: UserInfo
  payload: {
    oauth: GoogleUserInfo | GithubUserInfo
    tokenSet: import('openid-client').TokenSet
  }
}
