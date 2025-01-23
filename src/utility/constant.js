import { FaWhatsapp, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import swal from "sweetalert";
export const API_URL = "https://fakestoreapi.com/";
const LOCATION_SERVER_URL = process.env.REACT_APP_LOCATION_FETCHING_SERVER_URL;
const LOCATION_API = process.env.REACT_APP_LOCATION_FETCHING_API_KEY;
export const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const months = [
  {
    id: 1,
    name: "January",
    value: "01",
    number: 1,
    alphabetics: "Jan",
  },
  {
    id: 2,
    name: "February",
    value: "02",
    number: 2,
    alphabetics: "Feb",
  },
  {
    id: 3,
    name: "March",
    value: "03",
    number: 3,
    alphabetics: "Mar",
  },
  {
    id: 4,
    name: "April",
    value: "04",
    number: 4,
    alphabetics: "Apr",
  },
  {
    id: 5,
    name: "May",
    value: "05",
    number: 5,
    alphabetics: "May",
  },
  {
    id: 6,
    name: "June",
    value: "06",
    number: 6,
    alphabetics: "Jun",
  },
  {
    id: 7,
    name: "July",
    value: "07",
    number: 7,
    alphabetics: "Jul",
  },
  {
    id: 8,
    name: "August",
    value: "08",
    number: 8,
    alphabetics: "Aug",
  },
  {
    id: 9,
    name: "September",
    value: "09",
    number: 9,
    alphabetics: "Sep",
  },
  {
    id: 10,
    name: "October",
    value: "10",
    number: 10,
    alphabetics: "Oct",
  },
  {
    id: 11,
    name: "November",
    value: "11",
    number: 11,
    alphabetics: "Nov",
  },
  {
    id: 12,
    name: "December",
    value: "12",
    number: 12,
    alphabetics: "Dec",
  },
];

export const handleAddToCart = (
  userDetail,
  productId,
  authToken,
  setProductAdding
) => {
  if (userDetail === "" || userDetail === undefined || userDetail === null) {
    alert("Please login First!");
    return;
  }
  setProductAdding((prev) => !prev);
  axios({
    method: "POST",
    url: `${SERVER_URL}/api/user/add-to-cart`,
    data: {
      userId: userDetail.id,
      productId: productId,
      quantity: 1,
    },
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      console.log(response);
      setProductAdding((prev) => !prev);
      swal(
        "Product Added!",
        "Your product is Added to Cart you can proceed next",
        "success"
      );
    })
    .catch((error) => {
      console.log(error);
    });
};
export const socialMedia = [
  {
    name: "Whatsapp",
    link: "https://wa.me/?text=",
    icon: (
      <FaWhatsapp className="text-3xl p-1 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white" />
    ),
  },
  // {
  //   name: "Facebook",
  //   link: "https://www.facebook.com/sharer/sharer.php?u=",
  //   icon: <FaFacebook />,
  // },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/messaging/compose?message=",
    icon: (
      <FaLinkedin className="text-3xl p-1 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white" />
    ),
  },
  {
    name: "Email",
    link: "mailto:?body=",
    icon: (
      <MdEmail className="text-3xl p-1 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white" />
    ),
  },
];

export const productCategory = [
  {
    id: 1,
    name: "category",
    value: "electronics",
    child: ["Smartphones", "laptops", "cameras", "headphones", "gadgets"],
  },
  {
    id: 2,
    name: "category",
    value: "clothing",
    child: ["shirts", "pants", "t-shirts", "jeans", "dresses"],
  },
  {
    id: 3,
    name: "category",
    value: "home & kitchen",
    child: [
      "Cookware",
      "appliances",
      "furniture",
      "kitchenware",
      "household items",
    ],
  },
  {
    id: 4,
    name: "cateory",
    value: "books",
    child: ["fiction", "non-fiction", "children's books", "mystery", "romance"],
  },
  {
    id: 5,
    name: "category",
    value: "grocery",
    child: [
      "vegetables",
      "fruits",
      "meat",
      "dairy",
      "bakery",
      "snacks",
      "beverages",
    ],
  },
  {
    id: 6,
    name: "category",
    value: "toys",
    child: [
      "action figures",
      "electronic toys",
      "building toys",
      "sports toys",
      "diy toys",
    ],
  },
  {
    id: 7,
    name: "category",
    value: "sports",
    child: ["football", "basketball", "tennis", "hockey", "golf"],
  },
  {
    id: 8,
    name: "category",
    value: "health & beauty",
    child: [
      "makeup",
      "skincare",
      "hair care",
      "beauty supplies",
      "personal care",
      "fragrances",
      "Health Care",
    ],
  },
  {
    id: 9,
    name: "category",
    value: "fashion",
    child: ["shoes", "accessories", "jewelry"],
  },
  {
    id: "10",
    name: "category",
    value: "others",
  },
];

export const productBrands = [
  { id: 1, name: "Apple", value: "apple" },
  { id: 2, name: "Nike", value: "nike" },
  { id: 3, name: "Samsung", value: "samsung" },
  { id: 4, name: "Adidas", value: "adidas" },
  { id: 5, name: "Sony", value: "sony" },
  { id: 6, name: "Microsoft", value: "microsoft" },
  { id: 7, name: "Gucci", value: "gucci" },
  { id: 8, name: "LG", value: "lg" },
  { id: 9, name: "Rolex", value: "rolex" },
  { id: 10, name: "Puma", value: "puma" },
  { id: 11, name: "Reebok", value: "reebok" },
  { id: 12, name: "Vans", value: "vans" },
  { id: 13, name: "H&M", value: "hm" },
  { id: 14, name: "Zara", value: "zara" },
  { id: 15, name: "Versace", value: "versace" },
  { id: 16, name: "Chanel", value: "chanel" },
  { id: 17, name: "Gucci", value: "gucci" },
  { id: 18, name: "Dior", value: "dior" },
  { id: 19, name: "Prada", value: "prada" },
  { id: 20, name: "Burberry", value: "burberry" },
  { id: 21, name: "Boat", value: "boat" },
  { id: 22, name: "Others", value: "others" },
];

export const formatAmount = (amount) => {
  const amountString = amount?.toString();
  return amountString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return amountString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Generating Dynamic future Years
export const generateFutureYearsForExpiryDate = () => {
  const currentYear = new Date().getFullYear();
  const futureYears = [];
  for (let i = currentYear; i <= currentYear + 20; i++) {
    futureYears.push(i.toString());
  }
  return futureYears;
};

export const getAllCountry = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `${LOCATION_SERVER_URL}/countries`,
      headers: {
        "X-CSCAPI-KEY": LOCATION_API,
      },
    });

    if (response.status === 200) {
      const countryNames = response.data?.map((data) => ({
        id: data?.id,
        name: data?.name,
        emoji: data?.emoji,
        phoneCode: data?.phonecode,
        iso2: data?.iso2,
        iso3: data?.iso3,
      }));

      return countryNames; // Directly return the processed data
    }
  } catch (error) {
    console.error("Error fetching countries:", error);
    return []; // Return an empty array or handle error appropriately
  }
};
