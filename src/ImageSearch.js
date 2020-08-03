import React, { Component } from "react";
import Pagination from "./Pagination";
import List from "./List";
import "./App.css";
import axios from "axios";

const LOAD_STATE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  LOADING: "LOADING",
};

export default class ImageSearch extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.fetchPhotos = this.fetchPhotos.bind(this);
    this.state = {
      photos: [],
      totalPhotos: 0,
      perPage: 9,
      currentPage: 1,
      loadState: LOAD_STATE.LOADING,
      search: "",
      prevSearch: "",
    };
  }
  handleChange(e) {
    this.setState({ search: e.target.value });
  }

  componentDidMount() {
    this.fetchPhotos(this.state.currentPage);
  }

  fetchPhotos(page = 1) {
    const appId = "N1ZIgf1m1v9gZJhledpAOTXqS8HqL2DuiEyXZI9Uhsk";
    var self = this;
    const { search, perPage, prevSearch } = this.state;
    const url1 = `https://api.unsplash.com/photos?page=${page}&client_id=${appId}`;
    const url2 =
      `https://api.unsplash.com/search/photos?page=${page}&query=` +
      search +
      "&client_id=" +
      appId;
    const url = search ? url2 : url1;

    const isSameSearch = prevSearch === search;
    if (search) {
      const options = {
        params: {
          page: page,
          per_page: perPage,
          order_by: "popularity",
        },
      };

      this.setState({ loadState: LOAD_STATE.LOADING });
      axios
        .get(url, options)
        .then((response) => {
          if (!isSameSearch) {
            this.setState({
              photos: [...response.data.results],
              totalPhotos: parseInt(response.headers["x-total"]),
              currentPage: page,
              loadState: LOAD_STATE.SUCCESS,
              prevSearch: search,
            });
          } else {
            this.setState({
              photos: [...this.state.photos, ...response.data.results],
              totalPhotos: parseInt(response.headers["x-total"]),
              currentPage: page,
              loadState: LOAD_STATE.SUCCESS,
            });
          }
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
          order_by: "popularity",
        },
      };

      this.setState({ loadState: LOAD_STATE.LOADING });
      axios
        .get(url, options)
        .then((response) => {
          self.setState({
            photos: [...this.state.photos, ...response.data],
            totalPhotos: parseInt(response.headers["x-total"]),
            currentPage: page,
            loadState: LOAD_STATE.SUCCESS,
          });
        })
        .catch(() => {
          this.setState({ loadState: LOAD_STATE.ERROR });
        });
    }
  }
  render() {
    return (
      <div className='app'>
        <form
          className='inputImage'
          onSubmit={(e) => {
            e.preventDefault();
            this.fetchPhotos(1);
          }}
          style={{ margin: "auto", maxWidth: "300px" }}
        >
          <input
            type='text'
            placeholder='Search..'
            onChange={this.handleChange}
            name='search'
            required
          />
          <button type='submit'>
            <i class='fa fa-search' />
          </button>
        </form>
        <List data={this.state.photos} />
        {this.state.loadState === LOAD_STATE.LOADING && (
          <div className='loader' />
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
