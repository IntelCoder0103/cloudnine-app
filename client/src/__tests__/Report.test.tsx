import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Report from "../Report";
import { fetchReport } from "../api/report";
import { useQuery } from "react-query";

jest.mock("../api/report");
jest.mock("react-query");

const mockData = {
  total: 124,
  countsPerType: {
    PDF: 46,
    JPG: 4,
    DOCX: 53,
    TXT: 15,
  },
  files: [
    {
      path: "D:\\",
      size: 207336,
      name: "12.pdf",
      type: "PDF",
      created: "2023-09-08T00:55:02.820Z",
      modified: "2023-09-08T00:55:05.671Z",
    },
    {
      path: "D:\\",
      size: 3557302,
      name: "20201231_155408.jpg",
      type: "JPG",
      created: "2023-07-14T09:15:08.729Z",
      modified: "2023-08-29T06:47:58.000Z",
    },
    {
      path: "D:\\",
      size: 18440,
      name: "123.docx",
      type: "DOCX",
      created: "2023-05-04T18:35:16.461Z",
      modified: "2023-09-08T07:36:07.246Z",
    },
  ]
};

describe("Report component", () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockReturnValue({
      isError: false,
      isFetching: false,
      data: mockData,
    });
  });

  it("should contain the path input field and get report button", async () => {
    render(
      <MemoryRouter>
        <Report />
      </MemoryRouter>
    );

    expect(screen.getByText(/Get Report/)).toBeTruthy();
    expect(screen.getByTestId("folder-path-input")).toBeTruthy();

  });
  it("should display an error when error occurred", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isError: true,
      isFetching: false,
      data: {},
    });

    render(
      <MemoryRouter>
        <Report />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Invalid Path/)).toBeTruthy();
    });
  });

  it("should display a loading message when fetching", async () => {
    (useQuery as jest.Mock).mockReturnValue({
      isError: false,
      isFetching: true,
      data: {},
    });

    render(
      <MemoryRouter>
        <Report />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Loading.../)).toBeTruthy();
    });
  });

  it("should display the total count and meta data", async () => {

    render(
      <MemoryRouter>
        <Report />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/124/).length).toBe(2);
      expect(screen.getByText(/12.pdf/)).toBeTruthy();
      expect(screen.getByText(/20201231_155408.jpg/)).toBeTruthy();
      expect(screen.getByText(/123.docx/)).toBeTruthy();
    });
  });

  
});
