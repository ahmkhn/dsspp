import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  revalidatePath: vi.fn(),
  getUser: vi.fn(),
  from: vi.fn(),
  insert: vi.fn(),
  deleteRows: vi.fn(),
  eq: vi.fn(),
}));

vi.mock("@/utils/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { addData, removeData } from "@/components/Worldmap/test";

beforeEach(() => {
  mocks.createClient.mockResolvedValue({
    auth: { getUser: mocks.getUser },
    from: mocks.from,
  });
  mocks.getUser.mockResolvedValue({
    data: {
      user: {
        id: "authenticated-user-id",
        email: "researcher@example.com",
        user_metadata: { avatar_url: "https://images.example.com/avatar.png" },
      },
    },
    error: null,
  });
  mocks.from.mockReturnValue({ insert: mocks.insert, delete: mocks.deleteRows });
  mocks.insert.mockResolvedValue({ error: null });
  mocks.deleteRows.mockReturnValue({ eq: mocks.eq });
  mocks.eq.mockResolvedValue({ error: null });
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("existing researcher map mutations", () => {
  it("saves the existing profile fields and coordinate order with identity from the authenticated session", async () => {
    await addData(
      "Researcher Name",
      40.7128,
      -74.006,
      "Researcher",
      "Participatory research",
      "Sociology",
      "https://www.linkedin.com/in/researcher",
      "Working with local communities.",
    );

    expect(mocks.from).toHaveBeenCalledWith("users");
    expect(mocks.insert).toHaveBeenCalledWith({
      id: "authenticated-user-id",
      email: "researcher@example.com",
      avatar_url: "https://images.example.com/avatar.png",
      full_name: "Researcher Name",
      user_location_x: 40.7128,
      user_location_y: -74.006,
      user_occupation: "Researcher",
      user_research_description: "Participatory research",
      user_research_tag: "Sociology",
      linked_in_link: "https://www.linkedin.com/in/researcher",
      summary: "Working with local communities.",
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/map");
  });

  it("deletes only the current user's profile and refreshes the map", async () => {
    await removeData();
    expect(mocks.getUser).toHaveBeenCalledOnce();
    expect(mocks.from).toHaveBeenCalledWith("users");
    expect(mocks.deleteRows).toHaveBeenCalledOnce();
    expect(mocks.eq).toHaveBeenCalledWith("id", "authenticated-user-id");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/map");
  });

  it("does not issue a delete when there is no signed-in user", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(removeData()).rejects.toThrow("User is not logged in");
    expect(mocks.from).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("does not issue a delete when session verification fails", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "unverified-user-id" } },
      error: { message: "Invalid session" },
    });
    await expect(removeData()).rejects.toThrow("User is not logged in");
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("propagates delete errors without claiming the map was refreshed", async () => {
    mocks.eq.mockResolvedValue({ error: { message: "Permission denied" } });
    await expect(removeData()).rejects.toThrow("Error deleting data");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
