import React from 'react'
import styles from './App.module.css'
import { DependencyWorker } from '../../workers'

export default class App extends React.Component {

  constructor() {
    super()
    this.factory = new DependencyWorker()
  }

  render() {
    return (
      <div className={styles.root}>
        {this.factory.makeLaunchesScene()}
      </div>
    )
  }
}