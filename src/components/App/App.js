import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getPictures } from '../../services/fetchService';

import Searchbar from '../Searchbar';
import ImageGallery from '../ImageGallery';
import Loader from '../Loader';
import Button from '../Button';
import Scroll from '../../helpers/Scroll';
import Modal from '../Modal';
import NoFoundImage from '../ImageError/ImageError';

import './App.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState({});

  useEffect(() => {
    if (!searchQuery) return;

    const searchImages = async () => {
      setLoading(true);
      try {
        const images = await getPictures(searchQuery, page);
        setImages(prevImage => [...prevImage, ...images]);
        if (page !== 1) {
          Scroll();
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    searchImages();
  }, [searchQuery, page]);

  const handleSearchSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setPage(1);
    setImages([]);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onClickLargeImage = largeImage => {
    setLargeImage(largeImage);
    toggleModal();
  };

  const handleLoadMoreClick = () => {
    setLoading(true);
    setPage(prevPage => prevPage + 1);
    setLoading(false);
  };

  return (
    <div>
      <Searchbar onSubmit={handleSearchSubmit} />

      {loading && <Loader />}
      {images.length !== 0 ? (
        <ImageGallery images={images} onOpenModal={onClickLargeImage} />
      ) : (
        searchQuery !== '' && <NoFoundImage />
      )}
      {loading && !showModal && <Loader />}

      {showModal && (
        <Modal onClose={toggleModal}>
          <img
            src={largeImage.largeImageURL}
            alt={largeImage.tag}
            id={largeImage.id}
          />
          <button type="button" onClick={toggleModal}>
            Close
          </button>
        </Modal>
      )}
      {!loading && images[0] && <Button onClick={handleLoadMoreClick} />}
      <ToastContainer
        autoClose={3000}
        position="top-center"
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

// state = {
//   page: 1,
//   images: [],
//   searchQuery: '',
//   loading: false,
//   showModal: false,
// };
// componentDidUpdate(prevProps, prevState) {
//   const { searchQuery } = this.state;
//   if (searchQuery !== prevState.searchQuery) {
//     this.searchImage()
//       .catch(err => console.log(err))
//       .finally(() => this.setState({ loading: false }));
//   }
// }
// searchImage = () => {
//   const { searchQuery, page } = this.state;
//   this.setState({ loading: true });

//   return getPictures(searchQuery, page).then(images => {
//     this.setState(prevState => ({
//       images: [...prevState.images, ...images],
//       page: prevState.page + 1,
//     }));
//   });
// };

// handleSearchSubmit = searchQuery => {
//   this.setState({ searchQuery, page: 1, images: [] });
// };

// toggleModal = () => {
//   this.setState(({ showModal }) => ({
//     showModal: !showModal,
//   }));
// };

// onClickLargeImage = largeImage => {
//   this.setState({ largeImage });
//   this.toggleModal();
// };

// handleLoadMoreClick = () => {
//   this.setState({ loading: true });
//   this.searchImage()
//     .then(() => {
//       Scroll();
//     })
//     .catch(err => console.log(err))
//     .finally(() => this.setState({ loading: false }));
// };
