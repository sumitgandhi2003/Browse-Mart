import React, { useEffect, useState } from "react";
import Button from "../../LIBS/Button";
import Input from "../../LIBS/Input";
import axios from "axios";
import { swalWithCustomConfiguration } from "../../utility/constant";
import defaultProileImage from "../../assets/images/maleprofileicon.jpg";
import { useAuth } from "../../Context/authContext";
import { useUser } from "../../Context/userContext";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const Profile = () => {
  const [profileDetails, setProfileDetails] = useState();
  // let profileDetails = userDetail;
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { authToken } = useAuth();
  const { userDetail, setUserDetail } = useUser();

  // String.prototype.toCapitalize = function () {
  //   if (this.length === 0) return "";
  //   return this.charAt(0).toUpperCase() + this.slice(1);
  // };
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === "phoneNumber") {
      if (value?.length <= 11) {
        setProfileDetails((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setProfileDetails((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUpdating((prev) => !prev);

    updateProfile();
  };
  const updateProfile = async () => {
    axios({
      method: "post",
      url: `${SERVER_URL}/api/user/update-profile`,
      headers: { Authorization: `Bearer ${authToken}` },
      data: profileDetails,
    })
      .then((response) => {
        setUserDetail(response?.data?.updatedUser);
        setIsUpdating((prev) => !prev);
        setIsEditing((prev) => !prev);
      })
      .catch((error) => {
        const { data, status } = error?.response;
        swalWithCustomConfiguration?.fire(
          `Oops! Error ${status}`,
          data?.message,
          "error"
        );
        setIsUpdating((prev) => !prev);
        console.log(error);
      });
  };
  useEffect(() => {
    if (userDetail) {
      setProfileDetails(userDetail);
    }
  }, [userDetail]);
  return (
    <div className="w-11/12 h-full relative flex items-center bg-blue-100 text-blue-500">
      <form className="w-full h-full relative flex flex-col overflow-y-scroll items-center justify-between p-2 gap-6">
        {/* <div className=" w-full h-full"> */}
        <div
          className={
            "w-full h-max top-10 flex flex-col items-center gap-4 relative "
          }
        >
          <div className="h-40 w-40 rounded-full overflow-hidden ">
            <img
              src={profileDetails?.profilePic || defaultProileImage}
              alt="User Avatar"
              className=""
            />
          </div>
          <div className=" profile-detail w-10/12 font-roboto text-lg flex flex-col gap-3  break-words">
            <div className="flex gap-2 w-full p-1 items-center">
              <label htmlFor="name " className="w-1/3 text-gray-300">
                Name:
              </label>
              {isEditing ? (
                <Input
                  id={"name"}
                  name={"name"}
                  value={profileDetails?.name}
                  placeholder={"Enter Name"}
                  className={
                    "px-2 py-1 bg-gray-100  border-gray-300 border-2 w-2/3 text-left font-semibold rounded"
                  }
                  onChange={handleChange}
                />
              ) : (
                <p className="name w-2/3 text-left font-semibold" id="name">
                  {profileDetails?.name?.toCapitalize() || "N/A"}
                </p>
              )}
            </div>
            <div className="flex gap-2 w-full p-1 items-center">
              <label htmlFor="email" className="w-1/3 text-gray-300">
                Email:
              </label>
              {isEditing ? (
                <Input
                  id={"email"}
                  name={"email"}
                  value={profileDetails?.email}
                  className={
                    "px-2 py-1 bg-gray-100  border-gray-300 border-2 w-2/3 text-left font-semibold rounded"
                  }
                  placeholder={"Enter Email"}
                  onChange={handleChange}
                />
              ) : (
                <p
                  id="email"
                  className="w-2/3 text-left font-semibold break-words overflow-hidden "
                >
                  {profileDetails?.email || "N/A"}
                </p>
              )}
            </div>
            <div className="flex gap-2 w-full p-1 items-center">
              <label htmlFor="phoneNumber" className="w-1/3 text-gray-300">
                Phone No:
              </label>
              {isEditing ? (
                <Input
                  id={"phoneNumber"}
                  name={"phoneNumber"}
                  value={profileDetails?.phoneNumber}
                  className={
                    "px-2 py-1 bg-gray-100 border-gray-300 border-2 w-2/3 text-left font-semibold rounded"
                  }
                  placeholder={"Enter Phone Number"}
                  onChange={handleChange}
                />
              ) : (
                <p id="phoneNumber" className=" w-2/3 text-left font-semibold">
                  {profileDetails?.phoneNumber || "N/A"}
                </p>
              )}
            </div>

            <div className="flex gap-2 w-full p-1 items-center">
              <label htmlFor="address" className="w-1/3 text-gray-300">
                Address:
              </label>
              {isEditing ? (
                <Input
                  id={"address"}
                  name={"address"}
                  value={profileDetails?.address}
                  className={
                    "px-2 py-1 bg-gray-100 border-gray-300 border-2 w-2/3 text-left font-semibold rounded break-words overflow-hidden"
                  }
                  placeholder={"Enter Address"}
                  onChange={handleChange}
                />
              ) : (
                <p
                  id="address"
                  className=" w-2/3 text-left font-semibold break-words overflow-hidden "
                >
                  {profileDetails?.address || "N/A"}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className=" absolute bottom-3  right-2 flex gap-3">
          <Button
            btntext={isEditing ? "Cancel" : "Edit"}
            className={
              "bg-blue-300 px-3 py-1 text-lg text-blue-100 font-roboto hover:bg-blue-500 hover:text-white outline-none border-none rounded"
            }
            onClick={(e) => {
              e.preventDefault();
              setIsEditing((prev) => !prev);
              if (isEditing) {
                setProfileDetails(userDetail);
              }
            }}
          />
          {isEditing ? (
            <Button
              btntext={"Save"}
              onClick={handleSubmit}
              loading={isUpdating}
              className="bg-blue-500 px-3 py-1 text-lg text-blue-100 font-roboto hover:bg-blue-500 hover:text-white outline-none border-none rounded"
            />
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
