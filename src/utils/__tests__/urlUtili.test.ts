import urlUtils from "../../utils/urlUtilities";

const { getFragmentParameter } = urlUtils;

describe("getFragmentParameter function utility", () => {
  it("Should return the param value correctly", () => {
    expect(
      getFragmentParameter(
        "https://localhost:1234#sessionToken=4o3H1f1r5X5b0g8R4w3f9K9o8z9T8n1v3Y9x3b4W3j4l6R9o2h3D4s4v5O9v7y7Q8f8c5W5a0k4Z7d4d4X3g8g3P2o2z9A1a8t8O9m3v2K5q0s9Y2p3l7N2u0f8X7l3l",
        "sessionToken"
      )
    ).toEqual(
      "4o3H1f1r5X5b0g8R4w3f9K9o8z9T8n1v3Y9x3b4W3j4l6R9o2h3D4s4v5O9v7y7Q8f8c5W5a0k4Z7d4d4X3g8g3P2o2z9A1a8t8O9m3v2K5q0s9Y2p3l7N2u0f8X7l3l"
    );
  });

  it("Should return an empty string when the url is not valid or the paramater cant't be found", () => {
    expect(
      getFragmentParameter(
        "https://localhost:1234#sessionToken=4o3H1f1r5X5b0g8R4w3f9K9o8z9T8n1v3Y9x3b4W3j4l6R9o2h3D4s4v5O9v7y7Q8f8c5W5a0k4Z7d4d4X3g8g3P2o2z9A1a8t8O9m3v2K5q0s9Y2p3l7N2u0f8X7l3l",
        "invalidParamName"
      )
    ).toEqual("");

    expect(
      getFragmentParameter("https://localhost:1234", "sessionToken")
    ).toEqual("");

    expect(getFragmentParameter("invalidUrl", "sessionToken")).toEqual("");
  });
});
