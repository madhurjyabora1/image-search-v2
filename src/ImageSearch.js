import React, { Component } from "react";
import Pagination from "./Pagination";
import List from "./List";
import "./App.css";
import axios from "axios";

const LOAD_STATE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  LOADING: "LOADING"
};

const appId = "N1ZIgf1m1v9gZJhledpAOTXqS8HqL2DuiEyXZI9Uhsk";

export default class ImageSearch extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.fetchPhotos = this.fetchPhotos.bind(this);
    this.state = {
      photos: [],
      totalPhotos: 0,
      perPage: 5,
      currentPage: 1,
      loadState: LOAD_STATE.LOADING,
      search: ""
    };
  }
  handleChange(e) {
    this.setState({ search: e.target.value });
  }

  componentDidMount() {
    this.fetchPhotos(this.state.currentPage);
  }

  fetchPhotos(page = 1) {
    var self = this;
    const { search, perPage } = this.state;
    const url1 = `https://api.unsplash.com/photos?page=${page}&client_id=${appId}`;
    const url2 =
      `https://api.unsplash.com/search/photos?page=${page}&query=` +
      search +
      "&client_id=" +
      appId;
    const url = search ? url2 : url1;

    if (search) {
      const options = {
        params: {
          page: page,
          per_page: perPage,
          order_by: "popularity"
        }
      };

      this.setState({ loadState: LOAD_STATE.LOADING });
      axios
        .get(url, options)
        .then(response => {
            let photos;
            try {
              photos = response.data.results;
              if (Object.getOwnPropertyNames(photos).length === 0) {
                photos = [];}
            } catch {
              photos = [];
            }
          this.setState({
            photos ,
            totalPhotos: parseInt(response.headers["x-total"]),
            currentPage: page,
            loadState: LOAD_STATE.SUCCESS
          });
        })
        .catch(() => {
          this.setState({ loadState: LOAD_STATE.ERROR });
        });
    } else {
      const options = {
        params: {
          client_id: appId,
          page: page,
          per_page: perPage,
          order_by: "popularity"
        }
      };

      this.setState({ loadState: LOAD_STATE.LOADING });
      axios
        .get(url, options)
        .then(response => {
            let photos;
            try {
              photos = response.data;
              if (Object.getOwnPropertyNames(photos).length === 0) {
                photos = [];}
            } catch {
              photos = [];
            }
          self.setState({
            photos,
            totalPhotos: parseInt(response.headers["x-total"]),
            currentPage: page,
            loadState: LOAD_STATE.SUCCESS
          });
        })
        .catch(() => {
          this.setState({ loadState: LOAD_STATE.ERROR });
        });
    }
  }

  render() {
    return (
      <div className="app">
        <input
          onChange={this.handleChange}
          type="text"
          name="search"
          placeholder="Enter query"
        />
        <button
          type="submit"
          onClick={() => this.fetchPhotos(1)}
          className="button"
        >
          Submit
        </button>
        <Pagination
          current={this.state.currentPage}
          total={this.state.totalPhotos}
          perPage={this.state.perPage}
          onPageChanged={this.fetchPhotos.bind(this)}
        />
        {this.state.loadState === LOAD_STATE.LOADING ? (
          <div className="loader" />
        ) : (
          <List data={this.state.photos} />
        )}
        <Pagination
          current={this.state.currentPage}
          total={this.state.totalPhotos}
          perPage={this.state.perPage}
          onPageChanged={this.fetchPhotos.bind(this)}
        />
      </div>
    );
  }
}
