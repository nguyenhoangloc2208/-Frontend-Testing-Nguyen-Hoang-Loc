import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import getData from "./axios";

describe("getData", () => {
  let mockAdapter;

  beforeEach(() => {
    mockAdapter = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAdapter.restore();
  });

  it("should fetch data successfully", async () => {
    const mockData = { id: 1, name: "Test Data" };
    const mockUrl = "http://example.com/data";
    mockAdapter.onGet(mockUrl).reply(200, mockData);

    const result = await getData(mockUrl);

    expect(result).toEqual(mockData);
  });

  it("should throw an error if response is not ok", async () => {
    const mockUrl = "http://example.com/no-data";
    mockAdapter.onGet(mockUrl).reply(200, null);

    await expect(getData(mockUrl)).rejects.toThrow("No data available");
  });

  it("should throw an error if fetch fails", async () => {
    const mockUrl = "http://example.com/error";
    mockAdapter.onGet(mockUrl).reply(500, { message: "Internal Server Error" });

    await expect(getData(mockUrl)).rejects.toThrow(
      "Request failed with status code 500"
    );
  });
});
