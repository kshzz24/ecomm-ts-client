import { FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { userReducerInitialState } from "../../../types/reducer-types";
import { useSelector } from "react-redux";
import { useNewProductMutation } from "../../../redux/api/productApi";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import { useFileHandler } from "6pp";
const NewProduct = () => {
  const { user } = useSelector(
    (state: { userReducer: userReducerInitialState }) => state.userReducer
  );

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  // const [photoPrev, setPhotoPrev] = useState<string>("");
  // const [photo, setPhoto] = useState<File>();
  const navigate = useNavigate();
  const [newProduct] = useNewProductMutation();

  const photos = useFileHandler("multiple", 10, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (!name || !price || !category || stock < 0) {
        return;
      }

      if (!photos.file || photos.file.length === 0) {
        return;
      }

      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("category", category);
      formData.set("price", price.toString());
      // formData.set("photo", photo);
      formData.set("stock", stock.toString());

      photos.file.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await newProduct({
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        _id: user?._id!,
        formData,
      });

      responseToast(res, navigate, "/admin/product");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photos</label>
              <input
                required
                accept="image/*"
                type="file"
                multiple
                onChange={photos.changeHandler}
              />
            </div>

            {photos.error && <p>{photos.error}</p>}

            {photos.preview && (
              <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
                {photos.preview.map((img, i) => (
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
            <button disabled={isLoading} type="submit">
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
