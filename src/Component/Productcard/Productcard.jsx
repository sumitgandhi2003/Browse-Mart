import Button from "../Button/Button";

const Productcard = ({ product }) => {
  const { image, name, price, category } = product;
  return (
    <div
      className="product-card group w-full h-full max-h-[450px] max-w-[350px]  gap-4 border-2  border-gray-00 tablet:hover:border-blue-500 tablet:hover:bg-gray-200
 rounded-md p-2 shadow-md relative "
    >
      {/* <Link to={"/product/" + id} className="w-full"> */}
      <img
        src={image}
        className="aspect-square w-full object-fill z-10 rounded-md mix-blend- "
        alt={name}
      />
      {/* </Link> */}

      <div className="product-info w-full text-left p-2 relative">
        {/* <Link to={"/product/" + id} className="w-full"> */}
        <div className="product-name w-full text-ellipsis overflow-hidden whitespace-nowrap text-2xl hover:text-gray-400">
          {name}
        </div>
        {/* </Link> */}
        <div className="product-price  font-bold text-lg ">
          ₹{(price * 83.71)?.toFixed(2)}
        </div>
        <div className="w-1/2 text-ellipsis overflow-hidden whitespace-nowrap">
          {category}
        </div>
        <div className="add-to-cart-btn absolute bottom-2 right-0 mobile: text-base small-device:text ">
          <Button
            btntext={"add to cart"}
            className={
              "px-2 py-1 rounded-lg z-10 bg-blue-900 text-white outline-none hover:bg-blue-500 "
            }
            disabled={false}
            click={(e) => {
              e.preventDefault();
              e.stopPropagation();
              alert("Add to cart clicked");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Productcard;
