/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../../../types/reducer-types";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { Skeleton } from "../../../components/loader";
import { responseToast } from "../../../utils/features";
import { useFileHandler } from "6pp";

const Productmanagement = () => {
  const { user } = useSelector(
    (state: { userReducer: userReducerInitialState }) => state.userReducer
  );
  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const { price, photos, name, stock, category, description } =
    data?.product || {
      photos: [],
      name: "",
      stock: 0,
      category: "",
      price: 0,
      _id: "",
      description: "",
    };
  const [descriptionUpdate, setDescriptionUpdate] = useState<string>("");
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  // const [photoUpdate, setPhotoUpdate] = useState<string>("");
  // const [photoFile, setPhotoFile] = useState<File>();

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [btnLoading, setBtnLoading] = useState(false);

  const photosFile = useFileHandler("multiple", 10, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);
    // filled data into a form
    try {
      const formData = new FormData();
      if (nameUpdate) formData.set("name", nameUpdate);
      if (description) formData.set("description", descriptionUpdate);
      if (stockUpdate !== undefined)
        formData.set("stock", stockUpdate.toString());
      if (priceUpdate) formData.set("price", priceUpdate.toString());
      if (categoryUpdate) formData.set("category", categoryUpdate);

      if (photosFile.file && photosFile.file.length > 0) {
        photosFile.file.map((photo) => {
          formData.append("photos", photo);
        });
      }

      const res = await updateProduct({
        formData,
        productId: data?.product._id!,
        userId: user?._id!,
      });
      // send form data to backend for update
      responseToast(res, navigate, "/admin/product");
    } catch (err) {
      console.log(err);
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async () => {
    const res = await deleteProduct({
      productId: data?.product._id!,
      userId: user?._id!,
    });
    // send form data to backend for update
    responseToast(res, navigate, "/admin/product");
  };
  if (isError) {
    <Navigate to={"/404"} />;
  }
  // Placeholder values
  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setDescriptionUpdate(data.product.description);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img src={photos[0]?.url} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    required
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photos</label>
                  <input
                    accept="image/*"
                    type="file"
                    multiple
                    onChange={photosFile.changeHandler}
                  />
                </div>

                {photosFile.error && <p>{photosFile.error}</p>}
                {photosFile.preview && (
                  <div
                    style={{ display: "flex", gap: "1rem", overflowX: "auto" }}
                  >
                    {photosFile.preview.map((img, i) => (
                      <img
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                        }}
                        key={i}
                        src={img}
                        alt="New Image"
                      />
                    ))}
                  </div>
                )}

                <button disabled={btnLoading} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
