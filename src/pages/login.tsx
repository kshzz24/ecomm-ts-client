import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
const Login = () => {
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const { user } = await signInWithPopup(auth, provider); // Use signInWithPopup with auth and provider
      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender: gender,
        role: "user",
        _id: user.uid,
        dob: date,
      });

      if ("data" in res) {
        toast.success(res.data.message);
      } else {
        const err = res.error as FetchBaseQueryError;
        // success: true & message
        const message = (err.data as MessageResponse).message;
        toast.error(message);
      }

      console.log(user);
    } catch (error) {
      toast.error("Sign In Fail");
      console.log(error);
    }
  };

  const handleChangeGender = (e: ChangeEvent<HTMLSelectElement>): void => {
    setGender(e.target.value);
  };

  const handleChangeDate = (e: ChangeEvent<HTMLInputElement>): void => {
    setDate(e.target.value);
  };
  return (
    <div className="login">
      <main>
        <h1 className="heading">LOGIN</h1>
        <div>
          <label> Gender </label>
          <select value={gender} onChange={handleChangeGender}>
            <option value="">Select Gender</option>
            <option value="male"> Male</option>
            <option value="female"> Female</option>
          </select>
        </div>
        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={handleChangeDate} />
        </div>
        <div>
          <p>Already Sign In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
