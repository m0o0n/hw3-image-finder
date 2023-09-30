import { fetchImages } from 'api/api';
import { Component } from 'react';
import Button from './Button';
import ImageGallery from './ImageGallery';
import { Loader } from './Loader';
import SearchBar from './Searchbar';

export class App extends Component {
  state = {
    gallery: [],
    filtedGalery: null,
    query: '',
    totalHits: null,
    page: 1,
    err: '',
    isLoading: false,
  };

  handleLoadMore = () => {
    this.setState(prev => ({ page: prev.page + 1, isLoading: true }));
  };

  submit = value => {
    this.setState({
      page: 1,
      gallery: [],
      query: value,
      totalHits: null,
      isLoading: true
    })
  };

  componentDidUpdate(_, prevState) {
    if (prevState.page !== this.state.page || prevState.query !== this.state.query) {
      fetchImages(this.state.page, this.state.query).then(({hits, totalHits}) => {
        setTimeout(() => {
          this.setState(({query, gallery}) => ({
            gallery: query ? [...gallery, ...hits] : [],
            isLoading: false,
            totalHits: totalHits
          }))
        }, 500)
      }).catch(err => {
        this.setState({err, isLoading: false})
      })
    }
  }

  render() {
    return (
      <div className="App">
        <SearchBar submit={this.submit} />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            <ImageGallery gallery={this.state.gallery} />
            <Button
              loadMore={this.handleLoadMore}
              isRender={this.state.gallery.length && (this.state.gallery.length < this.state.totalHits)}
              page={this.state.page}
            />
          </>
        )}
      </div>
    );
  }
}
