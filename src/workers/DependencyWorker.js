import LaunchesWorker from './LaunchesWorker'
import React from 'react'
import { SpaceXApi } from '../services'
import { ListLaunchesView } from '../scenes'

export default class DependencyWorker {

  constructor() {
    this.spacexApi = new SpaceXApi()
  }

  makeLaunchesWorker() {
    return new LaunchesWorker(this.spacexApi)
  }

  makeLaunchesScene(props) {
    return (<ListLaunchesView {...props} factory={this} />)
  }
}