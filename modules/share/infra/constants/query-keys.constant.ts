export const QUERY_KEYS_USER_MANAGEMENT = Object.freeze({
  UMListUsers: 'UMListUsers'
})

export const QUERY_KEYS_LOCATION_MANAGEMENT = Object.freeze({
  LMListLocations: 'LMListLocations',
  LMGetLocation: 'LMGetLocation',
  LMGetLocationCatalog: 'LMGetLocationCatalog'
})

export const QUERY_KEYS_CUSTOMER_MANAGEMENT = Object.freeze({
  LMListCustomers: 'LMListCustomers',
  CMActiveCustomers: 'CMActiveCustomers'
})

export const QUERY_KEYS_SERVICE_MANAGEMENT = Object.freeze({
  SMListServices: 'SMListServices',
  SMListCategoriesCatalog: 'SMListCategoriesCatalog',
  CMActiveServices: 'CMActiveServices'
})

export const QUERY_KEYS_MAINTABLE_MANAGEMENT = Object.freeze({
  MTListMaintable: 'MTListMaintable',
  CMCalendarStatusOptions: 'CMCalendarStatusOptions'
})

export const QUERY_KEYS_CALENDAR_MANAGEMENT = Object.freeze({
  CMListCalendar: 'CMListCalendar',
  CMListLocations: 'CMListLocations'
})

// Se creo esta query para el endpoint de getUserLocationEvents
export const QUERY_KEYS_USER_LOCATION_MANAGEMENT = Object.freeze({
  ULMGetUserLocationEvents: 'ULMGetUserLocationEvents'
})

export const QUERY_KEYS_DAYS_OFF_MANAGEMENT = Object.freeze({
  DOListDaysOff: 'DOListDaysOff',
  DOGetDaysOffByUser: 'DOGetDaysOffByUser',
  DOGetDayOffTypes: 'DOGetDayOffTypes'
})
