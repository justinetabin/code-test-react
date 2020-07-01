import { Launch } from '../models';

export default class LaunchesWorker {

  constructor(spacexApi) {
    this.spacexApi = spacexApi
  }

  async fetchLaunches(offset, limit) {
    const { data } = await this.spacexApi.fetchLaunches(offset, limit)
    return data.map(datum => new Launch(datum))
  }

  async fetchLaunchesByRocketName(rocketName, offset, limit) {
    const { data } = await this.spacexApi.fetchLaunchesByRocketName(rocketName, offset, limit)
    return data.map(datum => new Launch(datum))
  }
}