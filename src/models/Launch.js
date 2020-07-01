
export default class Launch {

  constructor({ flight_number, mission_name, launch_year, rocket, launch_site, launch_failure_details, details, links: { mission_patch_small }, launch_date_utc, launch_success }) {
    this.flightNumber = flight_number
    this.missionName = mission_name
    this.launchYear = launch_year
    // TODO: should have it's own model so it doesn't break camel casing
    this.rocket = rocket // <--
    this.launchSite = launch_site // <--
    this.launchFailureDetails = launch_failure_details // <-- needs safe unwrapping
    this.details = details // <--
    this.missionPatchSmall = mission_patch_small
    this.launchDateUtc = launch_date_utc
    this.launchSuccess = launch_success
  }
}