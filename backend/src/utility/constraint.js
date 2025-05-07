export const generateOrderId = (timeStamp) => {
  const prefix = "ORD";
  // const date = originalDate?.split("/")?.reverse()?.join("");
  const [date, time] = timeStamp
    ?.split(",")
    ?.map((part) => part?.split(/[/:" "]/))
    ?.map((part) =>
      part
        ?.filter(
          (subPart) => subPart !== "" && subPart !== "AM" && subPart !== "PM"
        )
        ?.map((subPart) => subPart?.padStart(2, "0"))
        ?.reverse()
        ?.join("")
    );
  // const date = timeStamp
  //   ?.toLocaleString()
  //   .split(",")[0]
  //   ?.split("/")
  //   ?.map((part) => part?.padStart(2, "0"))
  //   ?.reverse()
  //   ?.join("");
  // // const time = originalTime?.split(" ")[0]?.replaceAll(":", "");
  // const time = timeStamp
  //   ?.toLocaleString()
  //   .split(",")[1]
  //   ?.trim()
  //   ?.split(" ")[0]
  //   ?.trim()
  //   ?.split(":")
  //   ?.map((part) => part.padStart(2, "0"))
  //   ?.join("");
  // const orderId = prefix + date + time + Math.floor(Math.random() * 10000);
  const orderId = `${prefix}-${date}-${time}-${Math.floor(
    10000000 + Math.random() * 90000000
  )}`;
  return orderId;
};
