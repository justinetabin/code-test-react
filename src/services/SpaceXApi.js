import axios from 'axios'

export default class SpaceXApi {
  
  constructor() {
    this.baseUrl = 'https://api.spacexdata.com/v3'
  }

  fetchLaunches(offset, limit, ) {
    return axios.get(this.baseUrl + `/launches?offset=${offset}&limit=${limit}`)
  }

  fetchLaunchesByRocketName(rocketName, offset, limit) {
    return axios.get(this.baseUrl + `/launches?offset=${offset}&limit=${limit}&rocket_name=${rocketName}`)
  }
}