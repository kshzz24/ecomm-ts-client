import { ChangeEvent, useEffect, useState, FormEvent } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState, userReducerInitialState } from "../types/reducer-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

type UserDetailType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

const userDetails: UserDetailType = {
  address: "",
  city: "",
  state: "",
  country: "",
  pinCode: 0,
};

const Shipping = () => {
  const { cartItems, total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  const { user } = useSelector((state:{userReducer:userReducerInitialState})=> state.userReducer)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const [shippingInfo, setShippingInfo] = useState(userDetails);

  
  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(saveShippingInfo(shippingInfo!));
    try {
      console.log(shippingInfo);
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
          description: "This is temp description",
          shipping:{
            address: {
               city: shippingInfo.city,
               state: shippingInfo.state,
               country: "IN",
               line1: shippingInfo.address,
               postal_code: shippingInfo.pinCode,
               line2: shippingInfo.address

            },
            name: user?.name
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    navigate("/pay",{
      state:data.clientSecret
    })
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
      
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) return navigate("/cart");
  }, [cartItems]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>SHIPPING ADDRESS</h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />

        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="india">INDIA</option>
          <option value="usa">USA</option>
          <option value="uk">UK</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button type="submit">PAY NOW </button>
      </form>
    </div>
  );
};

export default Shipping;
