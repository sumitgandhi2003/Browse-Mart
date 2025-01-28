import { FaWhatsapp, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
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
export const orderStatus = [
  "order placed",
  "order confirmed",
  "processing",
  "shipped",
  "out for delivery",
  "delivered",
  // "cancelled",
];
export const initialSellerDetails = {
  businessName: "",
  panNumber: "",
  gstNumber: "",
  phoneNumber: "",
  emailAddress: "",
  businessAddress: "",
  city: "",
  State: "",
  PinCode: "",
  coutry: "",
  businessType: "",
  websiteUrl: "",
  companyRegistrationNumber: "",
  tradeLicenseNumber: "",
  bankAccountNumber: "",
  bankName: "",
  ifscCode: "",
  socialMediaLinks: "",
};

export const sellerRegistrationInputFields = [
  {
    id: 1,
    name: "businessName", // camelCase
    label: "Business Name",
    type: "text",
    placeholder: "Enter business name",
    required: true,
    tab: "businessInformation",
    validationRule: (value) =>
      !value?.trim() ? "Business Name is required" : null,
  },
  {
    id: 2,
    name: "panNumber", // camelCase
    label: "PAN Number",
    type: "text",
    placeholder: "Enter PAN number",
    required: true,
    tab: "legalInformation",
    maxLength: 10,
    validationRule: (value) => {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!value?.trim()) {
        return "PAN Number is required";
      }
      if (!panRegex.test(value)) {
        return "Invalid PAN Number format";
      }
      return null;
    },
  },
  {
    id: 3,
    name: "gstNumber", // camelCase
    label: "GST Number",
    type: "text",
    placeholder: "Enter GST number",
    required: true,
    tab: "legalInformation",
    maxLength: 15,
    validationRule: (value) => {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
      if (!value?.trim()) {
        return "GST Number is required";
      }
      if (!gstRegex.test(value)) {
        return "Invalid GST Number format";
      }
      return null;
    },
  },
  {
    id: 4,
    name: "phoneNumber", // camelCase
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter phone number",
    tab: "businessInformation",
    required: true,
    validationRule: (value) =>
      !value?.trim() ? "Phone Number is required" : null,
  },
  {
    id: 5,
    name: "emailAddress", // camelCase
    label: "Email Address",
    type: "email",
    placeholder: "Enter email address",
    tab: "businessInformation",
    required: true,
    validationRule: (value) =>
      !value?.trim() ? "Email Address is required" : null,
  },
  {
    id: 6,
    name: "businessAddress", // camelCase
    label: "Business Address",
    type: "text",
    placeholder: "Enter business address",
    required: true,
    tab: "businessInformation",
    validationRule: (value) =>
      !value?.trim() ? "Business Address is required" : null,
  },
  {
    id: 7,
    name: "city", // camelCase
    label: "City",
    type: "text",
    placeholder: "Enter City name",
    tab: "businessInformation",
    required: true,
    validationRule: (value) => (!value?.trim() ? "City is required" : null),
  },
  {
    id: 8,
    name: "State", // camelCase
    label: "State",
    type: "text",
    placeholder: "Enter State Name",
    tab: "businessInformation",
    required: true,
    validationRule: (value) => (!value?.trim() ? "State is required" : null),
  },
  {
    id: 9,
    name: "PinCode", // camelCase
    label: "Pin Code",
    type: "text",
    placeholder: "Enter Pin Code",
    tab: "businessInformation",
    required: true,
    validationRule: (value) => (!value?.trim() ? "Pin Code is required" : null),
  },
  {
    id: 10,
    name: "coutry", // camelCase
    label: "Country",
    type: "text",
    placeholder: "Enter Country Name",
    tab: "businessInformation",
    required: true,
    validationRule: (value) => (!value?.trim() ? "Country is required" : null),
  },
  {
    id: 11,
    name: "businessType", // camelCase
    label: "Business Type",
    type: "text",
    placeholder: "Enter business type",
    required: true,
    tab: "businessInformation",
    validationRule: (value) =>
      !value?.trim() ? "Business Type is required" : null,
  },
  {
    id: 13,
    name: "websiteUrl", // camelCase
    label: "Website URL",
    type: "url",
    placeholder: "Enter website URL",
    tab: "businessInformation",
    validationRule: (value) =>
      value
        ? !/^https?:\/\/.+\..+/.test(value)
          ? "Enter a valid Website URL"
          : null
        : null,
  },
  {
    id: 15,
    name: "companyRegistrationNumber", // camelCase
    label: "Company Registration Number",
    type: "text",
    placeholder: "Enter company registration number",
    tab: "legalInformation",
    validationRule: (value) =>
      value && !value.trim() ? "Company Registration Number is required" : null,
  },
  {
    id: 16,
    name: "tradeLicenseNumber", // camelCase
    label: "Trade License Number",
    type: "text",
    placeholder: "Enter trade license number",
    tab: "legalInformation",
    validationRule: (value) =>
      value && !value.trim() ? "Trade License Number is required" : null,
  },
  {
    id: 17,
    name: "bankAccountNumber", // camelCase
    label: "Bank Account Number",
    type: "text",
    placeholder: "Enter bank account number",
    required: true,
    tab: "financialInformation",
    validationRule: (value) =>
      !value?.trim() ? "Bank Account Number is required" : null,
  },
  {
    id: 18,
    name: "bankName", // camelCase
    label: "Bank Name",
    type: "text",
    placeholder: "Enter bank name",
    required: true,
    tab: "financialInformation",
    validationRule: (value) =>
      !value?.trim() ? "Bank Name is required" : null,
  },
  {
    id: 19,
    name: "ifscCode", // camelCase
    label: "IFSC Code",
    type: "text",
    placeholder: "Enter IFSC code",
    required: true,
    tab: "financialInformation",
    validationRule: (value) =>
      !value?.trim() ? "IFSC Code is required" : null,
  },
  {
    id: 20,
    name: "socialMediaLinks", // camelCase
    label: "Social Media Links",
    type: "text",
    placeholder: "Enter social media links (comma-separated)",
    validationRule: (value) =>
      value && value.trim() && !/^[\w\s,]+$/.test(value)
        ? "Enter valid comma-separated links"
        : null,
  },
];

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
  return "₹" + amountString?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

<svg
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  className="w-8 h-8 p-1 font-bold text-white rounded-full cursor-pointer hover:bg-white hover:text-blue-500 flex justify-center items-center"
>
  <g>
    <path
      fill="currentColor"
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </g>
</svg>;

export const swalWithCustomConfiguration = Swal.mixin({
  customClass: {
    //   cancelButton: "",
    denyButton: "bg-gray-300 text-white",
    confirmButton: "confirm-btn",
  },
});

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
