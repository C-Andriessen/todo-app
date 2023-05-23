import axios from "axios";
import Card from "./Card";
import { useState, useEffect } from "react";

export default function RenderCards(props) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER}/api/todo`).then((res) => {
      setCards(res.data.data);
    });
  }, [props.cards]);

  return (
    <>
      {cards.map((card, i) => {
        if (card.status === props.status) {
          return <Card setTodos={props.setTodos} card={card} key={i} />;
        } else return "";
      })}
    </>
  );
}
