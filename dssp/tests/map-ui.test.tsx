// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

const mocks = vi.hoisted(() => ({
  getMembers: vi.fn(), exists: vi.fn(), add: vi.fn(), remove: vi.fn(),
  flyTo: vi.fn(), removedMarkers: vi.fn(),
}));
vi.mock("@/components/Worldmap/getMapData", () => ({
  getAllMarkerUserData: mocks.getMembers, getUserDataExists: mocks.exists,
}));
vi.mock("@/components/Worldmap/test", () => ({ addData: mocks.add, removeData: mocks.remove }));
vi.mock("primereact/dialog", () => ({
  Dialog: ({ visible, header, children, onHide }: { visible: boolean; header: string; children: ReactNode; onHide: () => void }) =>
    visible ? <section role="dialog" aria-label={header}><button onClick={onHide}>Close dialog</button>{children}</section> : null,
}));
vi.mock("mapbox-gl", () => {
  class Map {
    canvas = document.createElement("canvas");
    addControl() {}
    on(event: string, listener: () => void) { if (event === "load") listener(); }
    off() {}
    setFog() {}
    resize() {}
    remove() {}
    isStyleLoaded() { return true; }
    getCanvas() { return this.canvas; }
    getCenter() { return { lat: 31.52, lng: 74.36 }; }
    flyTo = mocks.flyTo;
  }
  class Marker {
    setLngLat() { return this; }
    addTo() { return this; }
    remove = mocks.removedMarkers;
  }
  return { default: { Map, Marker, NavigationControl: class {}, GeolocateControl: class {}, AttributionControl: class {} } };
});

import Worldmap from "@/components/Worldmap/page";

const researcher = {
  full_name: "Amina Researcher", user_research_tag: "Sociology", avatar_url: "",
  user_research_description: "", user_occupation: "Researcher", user_location_x: 31.52,
  user_location_y: 74.36, linked_in_link: "https://example.com/researcher",
  summary: "Studying community-led development.", email: "amina@example.com",
};
const secondResearcher = { ...researcher, full_name: "Bilal Historian", user_research_tag: "History", email: "bilal@example.com" };
const account = { id: "fixture-user", email: "fixture@example.com" } as User;

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_MAPBOX_KEY", "test-only-token");
  mocks.getMembers.mockResolvedValue([researcher, secondResearcher]);
  mocks.exists.mockResolvedValue(false);
  mocks.add.mockResolvedValue(undefined);
  mocks.remove.mockResolvedValue(undefined);
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

async function ready(authorized: User | null = null) {
  render(<Worldmap authorized={authorized} />);
  await screen.findByRole("button", { name: /Amina Researcher Sociology/ });
}
async function openForm() {
  await ready(account);
  await waitFor(() => expect(screen.getAllByRole("button", { name: "Add your pin" })[0].hasAttribute("disabled")).toBe(false));
  fireEvent.click(screen.getAllByRole("button", { name: "Add your pin" })[0]);
  fireEvent.click(await screen.findByRole("button", { name: "Use map center" }));
  await screen.findByRole("dialog", { name: "Put your perspective on the map" });
}
function fillForm() {
  fireEvent.change(screen.getByLabelText(/Full name/), { target: { value: "New Researcher" } });
  fireEvent.change(screen.getByLabelText(/Occupation \/ title/), { target: { value: "Student" } });
  fireEvent.change(screen.getByLabelText(/^Research area \*/ ), { target: { value: "Sociology" } });
  fireEvent.change(screen.getByLabelText(/A little about you/), { target: { value: "My research summary." } });
}

describe("community map interactions", () => {
  it("lets guests search and filter people while contribution links lead to login", async () => {
    await ready();
    expect(screen.getAllByRole("link", { name: /Join the map/ })[0].getAttribute("href")).toBe("/login");
    expect(screen.queryByRole("button", { name: "Add your pin" })).toBeNull();
    fireEvent.change(screen.getByRole("textbox", { name: "Search people, research, or occupation" }), { target: { value: "Amina" } });
    expect(screen.queryByRole("button", { name: /Bilal Historian History/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    fireEvent.change(screen.getByLabelText("Research area"), { target: { value: "History" } });
    expect(screen.queryByRole("button", { name: /Amina Researcher Sociology/ })).toBeNull();
    expect(screen.getByRole("button", { name: /Bilal Historian History/ })).toBeTruthy();
    expect(mocks.add).not.toHaveBeenCalled();
    expect(mocks.remove).not.toHaveBeenCalled();
  });

  it("renders profile text safely, rejects unsafe links, and preserves map coordinate order", async () => {
    mocks.getMembers.mockResolvedValue([{ ...researcher, summary: '<img src=x onerror="alert(1)">', linked_in_link: 'javascript:alert(1)' }]);
    await ready();
    fireEvent.click(screen.getByRole("button", { name: /Amina Researcher Sociology/ }));
    expect(screen.getByText('<img src=x onerror="alert(1)">')).toBeTruthy();
    expect(document.querySelector('img[onerror]')).toBeNull();
    expect(screen.queryByRole("link", { name: /LinkedIn profile/ })).toBeNull();
    expect(mocks.flyTo).toHaveBeenCalledWith(expect.objectContaining({ center: [74.36, 31.52] }));
  });

  it("retains the directory when the Mapbox key is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_MAPBOX_KEY", "");
    await ready();
    expect(screen.getByText(/The map isn’t configured yet/)).toBeTruthy();
  });

  it("saves a selected map center using the existing latitude/longitude contract", async () => {
    await openForm();
    fillForm();
    mocks.exists.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    fireEvent.submit(screen.getByRole("button", { name: "Add me to the map" }).closest("form")!);
    await screen.findByText("Your pin is live. Welcome to the community.");
    expect(mocks.add).toHaveBeenCalledWith("New Researcher", expect.closeTo(31.52, 6), expect.closeTo(74.36, 6), "Student", "'Other' research type. Currently disabled.", "Sociology", "", "My research summary.");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps the form and entered details when the existing action does not save a row", async () => {
    await openForm();
    fillForm();
    fireEvent.submit(screen.getByRole("button", { name: "Add me to the map" }).closest("form")!);
    await screen.findByRole("alert");
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect((screen.getByLabelText(/Full name/) as HTMLInputElement).value).toBe("New Researcher");
    expect(screen.queryByText("Your pin is live. Welcome to the community.")).toBeNull();
  });

  it("prevents adding a second pin and requires explicit confirmation before removal", async () => {
    mocks.exists.mockResolvedValue(true);
    await ready(account);
    await screen.findAllByRole("button", { name: "Remove my pin" });
    expect(screen.queryByRole("button", { name: "Add your pin" })).toBeNull();
    fireEvent.click(screen.getAllByRole("button", { name: "Remove my pin" })[0]);
    expect(mocks.remove).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Keep my pin" }));
    expect(mocks.remove).not.toHaveBeenCalled();
    fireEvent.click(screen.getAllByRole("button", { name: "Remove my pin" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Remove pin" }));
    await screen.findByText("Your pin has been removed. You can add a new one whenever you’re ready.");
    expect(mocks.remove).toHaveBeenCalledOnce();
  });
});
