import axios from "axios";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/";
import AddBanner from "./AddBanner";

jest.mock("axios");

describe("AddBanner Component with Full Coverage and Boundary Testing", () => {
  const mockOnClose = jest.fn();
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields and buttons", () => {
    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/link/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add new/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("displays error if title or image is missing", async () => {
    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/missing information at these fields/i)
      ).toBeInTheDocument();
    });
  });

  it("restricts image file types to .jpg and .png", () => {
    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);

    const fileInput = screen.getByLabelText(/upload image/i);
    const invalidFile = new File(["(⌐□_□)"], "test.gif", { type: "image/gif" });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(screen.getByText(/only .jpg and .png files are allowed/i)).toBeInTheDocument();
  });

  it("shows preview for valid image files", () => {
    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);

    const fileInput = screen.getByLabelText(/upload image/i);
    const validFile = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(screen.getByAltText("Preview")).toBeInTheDocument();
  });

  it("displays error for invalid link formats", async () => {
    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);

    fireEvent.change(screen.getByLabelText(/link/i), {
      target: { value: "invalid-link" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/invalid link! please provide a link/i)
      ).toBeInTheDocument()
    );
  });

  it("validates exact link formats of '/', 'localhost:3000/banners', or '#'", async () => {
    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);

    fireEvent.change(screen.getByLabelText(/link/i), {
      target: { value: "/" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/invalid link! please provide a link/i)
      ).toBeInTheDocument()
    );

    fireEvent.change(screen.getByLabelText(/link/i), {
      target: { value: "#" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() => expect(mockOnAdd).not.toHaveBeenCalled());
  });

  it("handles minimum input boundary values for title and link fields", async () => {
    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByLabelText(/link/i), {
      target: { value: "#" },
    });
    const validFile = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/upload image/i), {
      target: { files: [validFile] },
    });

    fireEvent.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
    });
  });

  it("handles maximum character boundary values for title and link fields", async () => {
    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);

    const longTitle = "A".repeat(255);
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: longTitle },
    });
    fireEvent.change(screen.getByLabelText(/link/i), {
      target: { value: "http://localhost:3000/banners" },
    });
    const validFile = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/upload image/i), {
      target: { files: [validFile] },
    });

    fireEvent.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalled();
    });
  });

  it("submits form successfully with valid data", async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 1, title: "Test Banner" } });

    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Valid Title" } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: "#" } });
    const validFile = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/upload image/i), { target: { files: [validFile] } });

    fireEvent.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith({ id: 1, title: "Test Banner" });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("displays server error message if upload fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Upload failed"));

    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test Banner" } });
    fireEvent.change(screen.getByLabelText(/link/i), { target: { value: "#" } });
    const validFile = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/upload image/i), { target: { files: [validFile] } });

    fireEvent.click(screen.getByRole("button", { name: /add new/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/failed to upload banner. please try again/i)
      ).toBeInTheDocument()
    );
  });

  it("calls onClose when the Cancel button is clicked", () => {
    render(<AddBanner onClose={mockOnClose} onAdd={mockOnAdd} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
