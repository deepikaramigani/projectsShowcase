import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const status = {
  initial: 'Initial',
  loading: 'Loading',
  success: 'Success',
  failure: 'Failure',
}

class Projects extends Component {
  state = {
    category: categoriesList[0].id,
    CurrentStatus: status.initial,
    projectsData: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if the category has changed
    const {category} = this.state
    if (prevState.category !== category) {
      this.getProjects()
    }
  }

  getProjects = async () => {
    this.setState({CurrentStatus: status.loading})
    const {category} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    console.log(category)
    const response = await fetch(url)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const UpdatedData = fetchedData.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        CurrentStatus: status.success,
        projectsData: UpdatedData,
      })
    } else {
      this.setState({CurrentStatus: status.failure})
    }
  }

  renderProjects = () => {
    const {projectsData} = this.state

    return (
      <ul className="projects-data">
        {projectsData.map(each => (
          <li className="list" key={each.id}>
            <div className="card">
              <img
                className="project-card-img"
                src={each.imageUrl}
                alt={each.name}
              />
              <p className="project-name">{each.name}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderDropdown = () => {
    const {category} = this.state
    const onchangeCategory = event => {
      this.setState({
        category: event.target.value,
      })
    }
    return (
      <select className="dropdown" value={category} onChange={onchangeCategory}>
        {categoriesList.map(each => (
          <option key={each.id} value={each.id}>
            {each.displayText}
          </option>
        ))}
      </select>
    )
  }

  renderFailureView = () => {
    const onRetry = () => {
      this.getProjects()
    }

    return (
      <div className="view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
          className="failure-img"
        />
        <h1>OOPs! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button className="retry-button" type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="view" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderView = () => {
    const {CurrentStatus} = this.state
    switch (CurrentStatus) {
      case status.success:
        return this.renderProjects()
      case status.loading:
        return this.renderLoadingView()
      case status.failure:
        return this.renderFailureView()
      default:
        return this.renderLoadingView()
    }
  }

  render() {
    return (
      <div className="main-container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <div className="display-projects">
          {this.renderDropdown()}
          {this.renderView()}
        </div>
      </div>
    )
  }
}

export default Projects
