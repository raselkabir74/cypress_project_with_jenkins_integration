export const APP_URL = {
  LOGIN: '/alogin',
  CAMPAIGN_PAGE: '/admin?function=campaigns&method=index',
  CAMPAIGN_SETTINGS_PAGE: '/admin?function=campaigns&method=settings',
  CAMPAIGN_APPROVE_PAGE: (id) => `/admin?function=acampaigns&method=view&id=${id}`,
  CAMPAIGN_MASS_APPROVE_PAGE: (ids) => `/admin?function=campaigns-approve&method=mass&ids=${ids}`,
  CAMPAIGN_MASS_EDIT_PAGE: (ids) => `/admin?function=campaigns-edit&method=mass&ids=${ids}`,
  CAMPAIGN_EDIT_PAGE: (id) => `/admin?function=campaigns&method=form&id=${id}`,
  CAMPAIGN_VIEW_PAGE: (id) => `/admin?function=campaigns&method=view&id=${id}`,
  NOTIFICATIONS: '/admin?function=notices&method=getNew&max_id=0',
  CREATIVE_SET_PAGE: '/admin?function=creatives-sets',
}

export const DASH_API_ENDPOINTS = {
  OAUTH: `/api/oauth/token`,
  BANNER_CAMPAIGN_CREATION: `/api/v1/campaign/banner/create`,
  CAMPAIGN_DELETION: (id) => `/api/v1/campaign/banner/delete/${id}`,
}
