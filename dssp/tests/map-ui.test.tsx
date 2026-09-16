// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

const mocks = vi.hoisted(() => ({
  getMembers: vi.fn(), exists: vi.fn(), add: vi.fn(), remove: vi.fn(),
  flyTo: vi.fn(), removedMarkers: vi.fn(),
  setData: vi.fn(), addSource: vi.fn(), addLayer: vi.fn(), queryFeatures: vi.fn(),
  clicks: new Set<(event: any) => void>(),
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
    source: unknown;
    layer: unknown;
    addSource(id: string, source: unknown) { this.source = { setData: mocks.setData }; mocks.addSource(id, source); }
    getSource() { return this.source; }
    addLayer(layer: unknown) { this.layer = layer; mocks.addLayer(layer); }
    getLayer() { return this.layer; }
    queryRenderedFeatures = mocks.queryFeatures;
    on(event: string, listener: () => void) {
      if (event === "load") listener();
      if (event === "click") mocks.clicks.add(listener);
    }
    off(event: string, listener: () => void) { if (event === "click") mocks.clicks.delete(listener); }
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
  mocks.clicks.clear();
  mocks.queryFeatures.mockReturnValue([]);
  mocks.getMembers.mockResolvedValue([researcher, secondResearcher]);
  mocks.exists.mockResolvedValue(false);
  mocks.add.mockResolvedValue(undefined);
  mocks.remove.mockResolvedValue(undefined);
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

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

  it("keeps all pins in one map source and preserves identity after filtering", async () => {
    await ready();
    expect(mocks.addSource).toHaveBeenCalledTimes(1);
    const data = mocks.setData.mock.lastCall?.[0] ?? mocks.addSource.mock.lastCall?.[1].data;
    expect(data.features).toHaveLength(2);
    expect(data.features[0].geometry.coordinates).toEqual([74.36, 31.52]);
    fireEvent.change(screen.getByLabelText("Research area"), { target: { value: "History" } });
    expect(mocks.setData.mock.lastCall?.[0].features).toHaveLength(1);
    expect(mocks.setData.mock.lastCall?.[0].features[0].properties.memberIndex).toBe(1);
    // A worker can briefly return the previous source while a filter update is pending.
    mocks.queryFeatures.mockReturnValue([{ properties: { memberIndex: 0 } }]);
    act(() => mocks.clicks.forEach((click) => click({ point: { x: 100, y: 100 } })));
    expect(screen.queryByRole("heading", { name: "Amina Researcher" })).toBeNull();
    mocks.queryFeatures.mockReturnValue([{ properties: { memberIndex: 1 } }]);
    act(() => mocks.clicks.forEach((click) => click({ point: { x: 100, y: 100 } })));
    expect(screen.getByRole("heading", { name: "Bilal Historian" })).toBeTruthy();
    expect(mocks.addSource).toHaveBeenCalledTimes(1);
    expect(mocks.addLayer).toHaveBeenCalledTimes(1);
  });

  it("does not place a new pin when an existing member is clicked", async () => {
    await ready(account);
    fireEvent.click(screen.getAllByRole("button", { name: "Add your pin" })[0]);
    await screen.findByRole("button", { name: "Use map center" });
    const event = { point: { x: 100, y: 100 }, lngLat: { lat: 10, lng: 20 }, originalEvent: { target: document.createElement("canvas") } };
    mocks.queryFeatures.mockReturnValue([{ properties: { memberIndex: 0 } }]);
    act(() => mocks.clicks.forEach((click) => click(event)));
    expect(screen.queryByRole("dialog")).toBeNull();
    mocks.queryFeatures.mockReturnValue([]);
    act(() => mocks.clicks.forEach((click) => click(event)));
    expect(screen.getByRole("dialog", { name: "Put your perspective on the map" })).toBeTruthy();
    expect(mocks.add).not.toHaveBeenCalled();
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


describe("member directory pagination and photos", () => {
  it("reveals 20 rows and photos per scroll batch, and searches beyond the loaded rows", async () => {
    let onIntersection: IntersectionObserverCallback = () => {};
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) { onIntersection = callback; }
      observe() {}
      disconnect() {}
    });
    const members = Array.from({ length: 45 }, (_, index) => ({
      ...researcher, full_name: `Person ${index + 1}`, email: `person${index}@example.com`,
      avatar_url: `https://images.example.com/${index}.jpg`,
    }));
    mocks.getMembers.mockResolvedValue(members);
    render(<Worldmap authorized={null} />);
    await screen.findByText("Showing 20 of 45 people");
    const list = screen.getByLabelText("Member list");
    expect(within(list).getAllByRole("button", { name: /Person/ })).toHaveLength(20);
    expect(list.querySelectorAll("img")).toHaveLength(20);
    expect(Array.from(list.querySelectorAll("img")).every(image => image.loading === "lazy")).toBe(true);
    act(() => onIntersection([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(screen.getByText("Showing 40 of 45 people")).toBeTruthy();
    expect(list.querySelectorAll("img")).toHaveLength(40);
    act(() => onIntersection([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(screen.getByText("Showing 45 of 45 people")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Load more members" })).toBeNull();
    fireEvent.change(screen.getByRole("textbox", { name: "Search people, research, or occupation" }), { target: { value: "Person 45" } });
    expect(within(list).getAllByRole("button", { name: /Person/ })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByText("Showing 20 of 45 people")).toBeTruthy();
    expect(list.querySelectorAll("img")).toHaveLength(20);
  });

  it("offers manual loading without an observer and falls back to initials for broken or unsafe photos", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    mocks.getMembers.mockResolvedValue(Array.from({ length: 21 }, (_, index) => ({
      ...researcher, full_name: `Person ${index + 1}`, email: `person${index}@example.com`,
      avatar_url: index === 0 ? "javascript:alert(1)" : `https://images.example.com/${index}.jpg`,
    })));
    render(<Worldmap authorized={null} />);
    await screen.findByText("Showing 20 of 21 people");
    const first = screen.getByRole("button", { name: "Person 1 Sociology" });
    expect(first.querySelector("img")).toBeNull();
    const second = screen.getByRole("button", { name: "Person 2 Sociology" });
    fireEvent.error(second.querySelector("img")!);
    expect(second.querySelector("img")).toBeNull();
    expect(second.textContent).toContain("P2");
    fireEvent.click(screen.getByRole("button", { name: "Load more members" }));
    expect(screen.getByText("Showing 21 of 21 people")).toBeTruthy();
  });
});
