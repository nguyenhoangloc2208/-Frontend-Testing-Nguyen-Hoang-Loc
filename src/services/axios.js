import axios from "axios";

const getData = async (url) => {
  try {
    const response = await axios.get(url);

    if (!response.data) {
      throw new Error("No data available");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default getData;
