import { Rating } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const ReviewCard = ({ review }) => {
  const { name, comment, rating, user } = review;
  const [userImg, setUserImg] = useState("");

  useEffect(() => {
    const fetchUserImg = async () => {
      try {
        const {data} = await axios.get(
          `http://localhost:4000/api/v1/user/${user}`
        );
    
        setUserImg(data.user.photo);
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserImg();
  }, [user]);
  return (
    <div className="reviewCard">
      <img className="reviewImg" src={userImg} />
      <p>{name}</p>
      <Rating value={rating} readOnly={true} />
      <span className="reviewCardComment">{comment}</span>
    </div>
  );
};

export default ReviewCard;
