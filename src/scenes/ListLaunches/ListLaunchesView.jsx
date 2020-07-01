import React from 'react'
import { Typography, Card, CardHeader, Avatar, CardContent, TextField } from '@material-ui/core';
import styles from './ListLaunchesView.module.css'
import moment from 'moment'

export default class ListLaunchesView extends React.Component {

  state = {
    data: null,
    error: null,
  }

  constructor({ factory }) {
    super()
    this.launchesWorker = factory.makeLaunchesWorker()
  }

  viewDidScroll() {
    if (!this.reachedBottom && ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
      this.reachedBottom = true
      if (this.searchValue) {
        this.fetchLaunchesByRocketName(this.searchValue)
      } else {
        this.fetchLaunches()
      }
      console.log('ok')
    }
  }

  componentWillMount() {
    window.addEventListener('scroll', this.viewDidScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.viewDidScroll.bind(this));
  }

  componentDidMount() {
    this.fetchLaunches()
  }

  onSearchEditingChanged(e) {
    const value = e.target.value
    this.searchValue = value
    this.debouncer(() => {
      this.setState({ data: null, error: null })
      if (value.length > 0) {
        this.fetchLaunchesByRocketName(value)
      } else {
        this.fetchLaunches()
      }
    }, 500)
  }

  async fetchLaunches() {
    try {
      const offset = this.getOffset()
      var { data } = this.state 
      const newData = await this.launchesWorker.fetchLaunches(offset, 10)
      if (data == null) data = []
      data = data.concat(newData)
      this.shouldPaginate = newData.length === 10
      this.reachedBottom = newData.length < 10
      this.setState({ data, error: null })
    } catch (error) {
      console.log(error)
      this.shouldPaginate = false
      this.setState({ data: null, error })
    }
  }

  async fetchLaunchesByRocketName(rocketName) {
    try {
      const offset = this.getOffset()
      var { data } = this.state 
      const newData = await this.launchesWorker.fetchLaunchesByRocketName(rocketName, offset, 10)
      if (data == null) data = []
      data = data.concat(newData)
      this.shouldPaginate = newData.length === 10
      this.reachedBottom = newData.length < 10
      this.setState({ data, error: null })
    } catch (error) {
      this.shouldPaginate = false
      this.setState({ data: null, error })
    }
  }

  getOffset() {
    const { data } = this.state
    const offset = data ? data.length : 0
    return offset
  }

  // TODO: Move to a util class
  debouncer(func, delay) {
    if (this.debouncerTimer) clearTimeout(this.debouncerTimer)
    this.debouncerTimer = setTimeout(func, delay)
  }

  render() {
    const { data, error } = this.state

    const loadingView = (data == null && error == null) ? (
      <Typography>Loading...</Typography>
    ) : null

    const errorView = (error && data == null) ? (
      <Typography>Opps something went wrong...</Typography>
    ) : null

    const lazyLoadingView = (this.shouldPaginate) ? (
      loadingView ? null : <Typography>Lazy Loading...</Typography>
    ) : (loadingView || errorView) ? null : (
      <Typography>Nothing to load</Typography>
    )

    const searchTextField = ((data && error == null ) || this.searchValue) ? (
      <div className={styles.searchView}>
        <TextField id="standard-basic" label="Search Falcon 9" onChange={this.onSearchEditingChanged.bind(this)} />
      </div>
    ) : null

    const tableView = (data && error == null) ? (
      data.map(launch => {
        /**
         * MARK:  adopt Model-View-ViewModel design pattern 
         *        for better model-to-view tranformations 
         */
        const launchDate = moment(launch.launchDateUtc)
        return (
          <div key={launch.flightNumber}>
            <Card className={styles.card}>
              <CardHeader
                avatar={
                  <Avatar src={launch.missionPatchSmall} />
                }
                title={launch.missionName}
                subheader={`Launched at ${launchDate.format('MMM DD, YYYY')}`}
              />
              <CardContent>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <Typography className={styles.placeholder}>rocket name</Typography>
                  </div>
                  <div className={styles.value}>
                    <Typography>{launch.rocket.rocket_name}</Typography>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <Typography className={styles.placeholder}>rocket type</Typography>
                  </div>
                  <div className={styles.value}>
                    <Typography>{launch.rocket.rocket_type}</Typography>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <Typography className={styles.placeholder}>launch site</Typography>
                  </div>
                  <div className={styles.value}>
                    <Typography>{launch.launchSite.site_name_long}</Typography>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <Typography className={styles.placeholder}>launched</Typography>
                  </div>
                  <div className={styles.value}>
                    <Typography>{launch.launchSuccess ? 'YES' : 'NO'}</Typography>
                  </div>
                </div>

                {launch.launchSuccess ? null : (
                  launch.launchFailureDetails ? (
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <Typography className={styles.placeholder}>failure cause</Typography>
                      </div>
                      <div className={styles.value}>
                        <Typography>{launch.launchFailureDetails.reason}</Typography>
                      </div>
                    </div>
                  ) : null
                )}

                {launch.details ? (
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <Typography className={styles.placeholder}>details</Typography>
                    </div>
                    <div className={styles.value}>
                      <Typography>{launch.details}</Typography>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )
      })
    ) : null

    return (
      <div className={styles.root}>
        {searchTextField}
        {loadingView}
        {errorView}
        {tableView}
        {lazyLoadingView}
      </div>
    )
  }
}