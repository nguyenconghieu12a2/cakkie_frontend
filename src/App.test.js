// AdminProfile.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import AdminProfile from "./components/admin-profile/edit-profile";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useParams: () => ({ adminId: "1" }),
}));

describe("AdminProfile Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AdminProfile />
      </MemoryRouter>
    );

  test("should render admin profile with default data", async () => {
    renderComponent();

    expect(await screen.findByText("Edit Profile")).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toHaveValue("Nguyen Cong");
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("Hieu");
    expect(screen.getByLabelText(/Username/i)).toHaveValue("nchieu");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("nchieu12345@gmail.com");
    expect(screen.getByAltText("Avatar")).toHaveAttribute("src", "/images/low_HD.jpg");
  });

  test("should handle image upload and display preview", async () => {
    renderComponent();

    const fileInput = screen.getByTestId("avatarInput");
    const validImage = new File(["dummy content"], "image.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [validImage] } });

    await waitFor(() => {
      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });
  });

  test("should show alert for unsupported file format", async () => {
    window.alert = jest.fn();
    renderComponent();

    const fileInput = screen.getByTestId("avatarInput");
    const invalidFile = new File(["dummy content"], "image.gif", { type: "image/gif" });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Only .jpg and .png files are allowed");
    });
  });

  test("should update profile fields", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "jdoe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "jdoe@example.com" } });

    expect(screen.getByLabelText(/First Name/i)).toHaveValue("John");
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("Doe");
    expect(screen.getByLabelText(/Username/i)).toHaveValue("jdoe");
    expect(screen.getByLabelText(/Email/i)).toHaveValue("jdoe@example.com");
  });

  test("should navigate back to profile on back button click", () => {
    renderComponent();

    const backButton = screen.getByTestId("back-button");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/admin-profile");
  });

  test("should handle form submission", async () => {
    renderComponent();

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Profile saved")).toBeInTheDocument();
    });
  });
});
