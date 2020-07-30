import React, { useState } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const uuid = () =>
  Math.random()
    .toString(36)
    .substring(7);
const toBlob = src =>
  new Promise(res => {
    const img = document.createElement("img");
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    img.onload = ({ target }) => {
      c.width = target.naturalWidth;
      c.height = target.naturalHeight;
      ctx.drawImage(target, 0, 0);
      c.toBlob(b => res(b), "image/jpeg", 0.75);
    };
    img.crossOrigin = "";
    img.src = src;
  });
const save = (blob, name = "image.png") => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.target = "_blank";
  a.download = name;
  a.click();
};

Modal.setAppElement("#root");
const ListItem = ({ photo }) => {
  async function handleClick() {
    const url =
      photo.links.download_location +
      "?client_id=N1ZIgf1m1v9gZJhledpAOTXqS8HqL2DuiEyXZI9Uhsk";

    const response = await fetch(url);
    const json = await response.json();
    const imgUrl = json.url;

    const blob = await toBlob(imgUrl);
    save(blob, `${uuid()}.jpg`);
  }
  console.log(photo.links.download_location);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <div key={photo.id} className="grid__item card">
        <div className="card__body">
          <img
            src={photo.urls.small}
            alt=""
            onClick={() => setModalIsOpen(true)}
          />
        </div>
        <div className="card__footer media">
          <img
            src={photo.user.profile_image.small}
            alt=""
            className="media__obj"
          />
          <div className="media__body">
            <a href={photo.user.portfolio_url} target="_blank">
              {photo.user.name}
            </a>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <img src={photo.urls.small} alt="" />
        <div>
          <button onClick={() => setModalIsOpen(false)} className="button1">
            Close
          </button>

          <button onClick={handleClick} className="button1">
            Download
          </button>
        </div>
      </Modal>
    </>
  );
};
export default ListItem;
