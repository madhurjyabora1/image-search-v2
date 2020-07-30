import React from "react";
import ListItem from "./ListItem";
const List = ({ data }) => {
  var items = data.map(photo => <ListItem key={photo.id} photo={photo} />);
  return <div className="grid">{items}</div>;
};

export default List;
