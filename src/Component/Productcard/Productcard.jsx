import Button from "../Button/Button";

const Productcard = ({ product }) => {
  const { image, name, price, category } = product;
  return (
    <div
      className="product-card group w-full h-full max-h-[400px] max-w-[300px]  gap-4 border-2  border-gray-00 tablet:hover:border-blue-500 tablet:hover:bg-gray-200
 rounded-md p-2 shadow-md relative "
    >
      {/* <Link to={"/product/" + id} className="w-full"> */}
      <img
        src={image[0]}
        className="aspect-square object-cover w-full z-10 rounded-md object-top "
        alt={name}
      />
      {/* </Link> */}

      <div className="product-info w-full text-left p-2 relative">
        {/* <Link to={"/product/" + id} className="w-full"> */}
        <div className="product-name w-full text-ellipsis overflow-hidden whitespace-nowrap font-roboto text-2xl hover:text-gray-400 mobile:text-base laptop:text-lg font-bold">
          {name}
        </div>
        {/* </Link> */}
        <div className="product-price  font-bold text-lg mobile:text-sm my-1 ">
          ₹{(price * 83.71)?.toFixed(2)}
        </div>
        <div className="w-1/2 text-ellipsis overflow-hidden whitespace-nowrap font-roboto text-base mobile:text-xs tablet:text-sm">
          {category}
        </div>
        <div className="add-to-cart-btn absolute bottom-2 right-0  mobile:bottom-1 laptop::bottom-2 ">
          <Button
            btntext={"add to cart"}
            className={
              " py-1 px-2 rounded z-10 font-roboto bg-blue-900 text-white outline-none hover:bg-blue-500 mobile:text-[10px] w-max tablet:text-[13px] laptop:text-sm large-device:text-base"
            }
            disabled={false}
            onClick={(e) => {
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
