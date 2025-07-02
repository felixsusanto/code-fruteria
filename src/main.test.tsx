import { act } from "@testing-library/react";
import RootMock from "./Root.tsx";

const Root = RootMock as jest.Mock;

jest.mock("./Root", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => <div>MockRoot</div>),
}));

test("Root component renders correctly", () => {
  const div = document.createElement('div');
  div.id = 'root'; // Ensure the div has an ID
  document.body.appendChild(div); // Append to the document body
  act(() => require('./main.tsx')); // Import the main file to trigger rendering

  expect(Root).toHaveBeenCalled();

});