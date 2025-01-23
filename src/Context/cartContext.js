const { createContext, useState, useContext } = require("react");

const cartContext = createContext();
const useCart = () => useContext(cartContext);
const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  //   const getCartItem = () => {
  //     axios({
  //       method: "POST",
  //       url: `${SERVER_URL}/api/user/get-cart-items`,
  //       headers: { Authorization: `Bearer ${authToken}` },
  //       data: { userId: userDetail?.id },
  //     })
  //       .then((response) => {
  //         setCartCount(response?.data?.cartCount);
  //         // setCartItem(response.data);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         setError(() => {
  //           return {
  //             message: "Failed to fetch cart items",
  //             status: error?.response?.status,
  //           };
  //         });
  //       });
  //   };
  //   useEffect(() => {
  //     getCartItem();
  //   }, []);
  return (
    <cartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </cartContext.Provider>
  );
};

export { CartProvider, cartContext, useCart };
