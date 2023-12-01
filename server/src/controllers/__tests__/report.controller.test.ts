/* eslint-disable @typescript-eslint/no-explicit-any */
import { getReport } from "../report.controller";
import fs from 'fs/promises';

jest.mock("fs/promises");

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
describe("Report Controller", () => {
  it("should return 400 error code when the path is not valid", async () => {
    const mockReq = {
      query: {
        path: "test",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    
    (fs.access as jest.Mock).mockRejectedValue(new Error("Invalid Directory"));

    await getReport(mockReq as any, mockRes as any, () => {});

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
  it("should return the total number of files, counter per types and meta data", async () => {
    const mockReq = {
      query: {
        path: "E://New Folder",
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    const mockFile = {
      name: '1.jpg',
      isDirectory: jest.fn().mockReturnValue(false),
    };
    const mockDirectory = {
      name: 'mockDir',
      isDirectory: jest.fn().mockReturnValue(true),
    };

    (fs.stat as jest.Mock).mockResolvedValue({});
    (fs.readdir as jest.Mock)
      .mockResolvedValueOnce([
        {
          ...mockFile,
          name: "mockImage.jpg",
        },
        {
          ...mockFile,
          name: "mockText.txt",
        },
        mockDirectory,
      ])
      .mockResolvedValueOnce([
        { ...mockFile, name: "mockVideo.mp4" },
        { ...mockFile, name: "mockVideo1.mp4" },
        { ...mockFile, name: "mockVideo2.mp4" },
      ]);

    await getReport(mockReq as any, mockRes as any, () => { });
    
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      total: 5,
      countsPerType: {
        MP4: 3,
        TXT: 1,
        JPG: 1
      },
      files: expect.arrayContaining([]),
    }));
  });
});
