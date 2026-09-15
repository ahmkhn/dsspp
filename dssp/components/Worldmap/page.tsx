'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { User } from '@supabase/supabase-js';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/mira/theme.css';
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Compass, Globe2, LoaderCircle, Mail, MapPin, Plus, Search, Trash2, Users, X } from 'lucide-react';
import ResearchType from '@/public/ResearchTypes.json';
import { addData, removeData } from './test';
import { getAllMarkerUserData, getUserDataExists } from './getMapData';
import styles from './worldmap.module.css';

type Member = NonNullable<Awaited<ReturnType<typeof getAllMarkerUserData>>>[number];
type Coordinate = [number, number];
const MEMBER_PAGE_SIZE = 20;
const MEMBER_SOURCE = 'community-members';
const MEMBER_LAYER = 'community-member-pins';

function memberFeaturesAt(instance: mapboxgl.Map, point: mapboxgl.Point) {
  if (!instance.getLayer(MEMBER_LAYER)) return [];
  // Preserve a generous touch target without creating a DOM element for every pin.
  return instance.queryRenderedFeatures([[point.x - 14, point.y - 14], [point.x + 14, point.y + 14]], { layers: [MEMBER_LAYER] });
}

function MemberAvatar({ member }: { member: Member }) {
  const src = safeWebUrl(member.avatar_url);
  const [failedSrc, setFailedSrc] = useState<string>();
  return (
    <span className={styles.memberAvatar} aria-hidden="true">
      <span>{initials(member.full_name)}</span>
      {src && src !== failedSrc && <img src={src} alt="" width={40} height={40} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailedSrc(src)} />}
    </span>
  );
}

function safeWebUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function initials(name: string) {
  return (name || '?').split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function hasCoordinates(member: Member) {
  return Number.isFinite(member.user_location_x) && Number.isFinite(member.user_location_y)
    && Math.abs(member.user_location_x) <= 90 && Math.abs(member.user_location_y) <= 180;
}

export default function Worldmap({ authorized }: { authorized: User | null }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const memberList = useRef<HTMLDivElement>(null);
  const loadMoreTrigger = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(MEMBER_PAGE_SIZE);
  const map = useRef<mapboxgl.Map | null>(null);
  const draftMarker = useRef<mapboxgl.Marker | null>(null);
  const profileHeading = useRef<HTMLHeadingElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [hasMarker, setHasMarker] = useState(false);
  const [query, setQuery] = useState('');
  const [field, setField] = useState('');
  const [selected, setSelected] = useState<Member | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinate | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [research, setResearch] = useState('');
  const [otherResearch, setOtherResearch] = useState('');
  const [linkedinLink, setLinkedInLink] = useState('');
  const [summary, setSummary] = useState('');

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setDataError('');
    try {
      const [data, exists] = await Promise.all([
        getAllMarkerUserData(),
        authorized ? getUserDataExists() : Promise.resolve(false),
      ]);
      if (data === null) throw new Error('Unable to load profiles.');
      setMembers(data);
      setHasMarker(exists);
    } catch {
      setDataError('We couldn’t load the community. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [authorized]);

  useEffect(() => { void loadMembers(); }, [loadMembers]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!sidebarOpen || !isMobile || !sidebar.current) return;
    const panel = sidebar.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, select, [tabindex="0"]'))
      .filter((element) => element.getClientRects().length > 0);
    focusable()[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    };
    panel.addEventListener('keydown', handleKey);
    return () => { panel.removeEventListener('keydown', handleKey); previousFocus?.focus(); };
  }, [sidebarOpen, isMobile]);

  useEffect(() => {
    if (selected) profileHeading.current?.focus({ preventScroll: true });
  }, [selected]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!mapContainer.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_KEY;
    if (!token) {
      setMapError('The map isn’t configured yet. You can still explore the community below.');
      return;
    }

    let instance: mapboxgl.Map;
    try {
      instance = new mapboxgl.Map({
        container: mapContainer.current,
        accessToken: token,
        style: process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/ahmkhn/cm0t536km002101nt0xc1fwvq',
        projection: 'globe',
        zoom: 1.7,
        center: [35, 25],
        attributionControl: false,
      });
    } catch {
      setMapError('The map couldn’t start in this browser. You can still browse the community.');
      return;
    }

    map.current = instance;
    instance.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');
    instance.addControl(new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: false },
      trackUserLocation: false,
      showUserHeading: false,
    }), 'top-right');
    instance.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');
    instance.on('style.load', () => instance.setFog({}));
    instance.on('load', () => { setMapReady(true); setMapError(''); });
    instance.on('error', () => {
      if (!instance.isStyleLoaded()) setMapError('Map tiles are unavailable. Check your connection or map configuration.');
    });
    const observer = new ResizeObserver(() => instance.resize());
    observer.observe(mapContainer.current);

    return () => {
      observer.disconnect();
      instance.remove();
      map.current = null;
    };
  }, []);

  const fields = useMemo(() => Array.from(new Set(members.map((member) => member.user_research_tag).filter(Boolean))).sort(), [members]);
  const filteredMembers = useMemo(() => {
    const search = query.trim().toLowerCase();
    return members.filter((member) => (!field || member.user_research_tag === field)
      && (!search || [member.full_name, member.user_research_tag, member.user_occupation, member.summary].some((value) => value?.toLowerCase().includes(search))));
  }, [members, query, field]);

  // Only mount photos for the current directory pages; all matching map pins remain available.
  const visibleMembers = filteredMembers.slice(0, visibleCount);
  const hasMoreMembers = visibleCount < filteredMembers.length;
  useEffect(() => {
    setVisibleCount(MEMBER_PAGE_SIZE);
    if (memberList.current) memberList.current.scrollTop = 0;
  }, [query, field]);

  useEffect(() => {
    const root = memberList.current;
    const target = loadMoreTrigger.current;
    if (!root || !target || !hasMoreMembers || loading || dataError || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        setVisibleCount((count) => count + MEMBER_PAGE_SIZE);
      }
    }, { root, rootMargin: '0px 0px 100px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [visibleCount, filteredMembers.length, hasMoreMembers, selected, sidebarOpen, loading, dataError]);

  const selectMember = useCallback((member: Member) => {
    setSelected(member);
    setSidebarOpen(true);
    if (hasCoordinates(member)) map.current?.flyTo({ center: [member.user_location_y, member.user_location_x], zoom: 5, essential: false });
  }, []);

  useEffect(() => {
    if (!mapReady || !map.current) return;
    const instance = map.current;
    const data: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: 'FeatureCollection',
      features: filteredMembers.flatMap((member, index) => hasCoordinates(member) ? [{
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [member.user_location_y, member.user_location_x] },
        properties: { memberIndex: index },
      }] : []),
    };
    const source = instance.getSource(MEMBER_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    if (source) source.setData(data);
    else {
      instance.addSource(MEMBER_SOURCE, { type: 'geojson', data });
      instance.addLayer({
        id: MEMBER_LAYER, type: 'circle', source: MEMBER_SOURCE,
        paint: {
          'circle-radius': 7,
          'circle-color': '#48784b',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff',
        },
      });
    }
    const click = (event: mapboxgl.MapMouseEvent) => {
      const feature = memberFeaturesAt(instance, event.point)[0];
      const member = filteredMembers[Number(feature?.properties?.memberIndex)];
      if (feature && member) selectMember(member);
    };
    instance.on('click', click);
    return () => { instance.off('click', click); };
  }, [filteredMembers, mapReady, selectMember]);

  const chooseLocation = useCallback((latitude: number, longitude: number) => {
    setCoordinates([latitude, ((longitude + 180) % 360 + 360) % 360 - 180]);
    setIsPlacing(false);
    setFormError('');
    setFormVisible(true);
  }, []);

  useEffect(() => {
    const instance = map.current;
    if (!instance || !isPlacing || !authorized || hasMarker) return;
    const click = (event: mapboxgl.MapMouseEvent) => {
      if (event.originalEvent.target instanceof Element && event.originalEvent.target.closest('.mapboxgl-marker')) return;
      if (memberFeaturesAt(instance, event.point).length) return;
      chooseLocation(event.lngLat.lat, event.lngLat.lng);
    };
    instance.getCanvas().style.cursor = 'crosshair';
    instance.on('click', click);
    return () => {
      instance.off('click', click);
      instance.getCanvas().style.cursor = '';
    };
  }, [isPlacing, authorized, hasMarker, chooseLocation]);

  useEffect(() => {
    if (coordinates && map.current) {
      draftMarker.current = new mapboxgl.Marker({ color: '#c76a35' })
        .setLngLat([coordinates[1], coordinates[0]])
        .addTo(map.current);
    }
    return () => { draftMarker.current?.remove(); draftMarker.current = null; };
  }, [coordinates]);

  const beginPlacement = async () => {
    if (!authorized || !mapReady || pending) return;
    setPending(true);
    setNotice('');
    try {
      const exists = await getUserDataExists();
      setHasMarker(exists);
      if (exists) { setNotice('You already have a pin. Remove it first to choose a new location.'); return; }
      setSelected(null);
      setSidebarOpen(false);
      setIsPlacing(true);
    } catch {
      setNotice('We couldn’t check your profile. Please try again.');
    } finally {
      setPending(false);
    }
  };

  const closeForm = () => {
    if (pending) return;
    setFormVisible(false);
    setCoordinates(null);
    setFormError('');
  };

  const submitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authorized || !coordinates || pending) return;
    setPending(true);
    setFormError('');
    try {
      if (await getUserDataExists()) {
        setHasMarker(true);
        setFormError('You already have a pin. Close this form and remove it before adding a new one.');
        return;
      }
      const description = research === 'Other' ? otherResearch.trim() : "'Other' research type. Currently disabled.";
      const researchTag = research === 'Other' ? description : research;
      // The database stores latitude in x and longitude in y; keep that existing contract.
      await addData(fullName.trim(), coordinates[0], coordinates[1], title.trim(), description, researchTag, linkedinLink.trim(), summary.trim());
      const [exists, data] = await Promise.all([getUserDataExists(), getAllMarkerUserData()]);
      // The existing action logs insert failures, so confirm the row exists before showing success.
      if (!exists) throw new Error('Profile was not saved.');
      setHasMarker(true);
      if (data) setMembers(data);
      else setDataError('Your profile was saved, but the community list needs a refresh.');
      setFormVisible(false);
      setCoordinates(null);
      setNotice('Your pin is live. Welcome to the community.');
      setFullName(''); setTitle(''); setResearch(''); setOtherResearch(''); setLinkedInLink(''); setSummary('');
    } catch {
      setFormError('We couldn’t save your profile. Your details are still here; please try again.');
    } finally {
      setPending(false);
    }
  };

  const deleteProfile = async () => {
    if (!authorized || !hasMarker || pending) return;
    setPending(true);
    setFormError('');
    try {
      await removeData();
      setHasMarker(false);
      setSelected(null);
      setDeleteVisible(false);
      setNotice('Your pin has been removed. You can add a new one whenever you’re ready.');
      const data = await getAllMarkerUserData();
      if (data) setMembers(data);
      else setDataError('Your pin was removed, but the community list needs a refresh.');
    } catch {
      setFormError('We couldn’t remove your pin. Please try again.');
    } finally {
      setPending(false);
    }
  };

  const contributionControl = authorized ? (
    hasMarker ? <button className={styles.secondaryButton} onClick={() => { setFormError(''); setDeleteVisible(true); }} disabled={pending}><Trash2 size={16} /> Remove my pin</button>
      : <button className={styles.primaryButton} onClick={() => void beginPlacement()} disabled={loading || pending || !mapReady || isPlacing}>{pending ? <LoaderCircle size={17} className={styles.spin} /> : <Plus size={17} />} Add your pin</button>
  ) : <a className={styles.primaryButton} href="/login"><Plus size={17} /> Join the map <ArrowUpRight size={16} /></a>;

  return (
    <div className={styles.workspace}>
      {sidebarOpen && <button className={styles.sidebarBackdrop} aria-label="Close community panel" onClick={() => setSidebarOpen(false)} />}
      <aside ref={sidebar} id="community-panel" className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`} aria-label="Community explorer" role={isMobile && sidebarOpen ? 'dialog' : undefined} aria-modal={isMobile && sidebarOpen ? true : undefined}>
        <div className={styles.sidebarHeading}>
          <span className={styles.eyebrow}><span className={styles.liveDot} /> THE DSSP COMMUNITY</span>
          <button className={`${styles.iconButton} ${styles.mobileClose}`} aria-label="Close community panel" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        {selected ? (
          <div className={styles.profile}>
            <button className={styles.backButton} onClick={() => setSelected(null)}><ArrowLeft size={16} /> Back to community</button>
            <div className={styles.profileAvatar}>{safeWebUrl(selected.avatar_url) ? <img src={safeWebUrl(selected.avatar_url)} alt="" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : null}<span>{initials(selected.full_name)}</span></div>
            <h1 ref={profileHeading} tabIndex={-1} className={styles.profileName}>{selected.full_name}</h1>
            <p className={styles.occupation}>{selected.user_occupation}</p>
            <span className={styles.researchTag}>{selected.user_research_tag || 'Community member'}</span>
            <div className={styles.profileSection}><h2>About</h2><p>{selected.summary || 'This member hasn’t added a summary yet.'}</p></div>
            {selected.user_research_description && selected.user_research_description !== "'Other' research type. Currently disabled." && selected.user_research_description !== selected.user_research_tag && <div className={styles.profileSection}><h2>Research</h2><p>{selected.user_research_description}</p></div>}
            <div className={styles.profileSection}><h2>On the map</h2><p className={styles.location}><MapPin size={16} /> {hasCoordinates(selected) ? `${selected.user_location_x.toFixed(3)}°, ${selected.user_location_y.toFixed(3)}°` : 'Location unavailable'}</p></div>
            <div className={styles.contactLinks}>
              {selected.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selected.email) && <a className={styles.secondaryButton} href={`mailto:${selected.email}`}><Mail size={16} /> Email {selected.full_name?.split(' ')[0]}</a>}
              {safeWebUrl(selected.linked_in_link) && <a className={styles.primaryButton} href={safeWebUrl(selected.linked_in_link)} target="_blank" rel="noopener noreferrer">LinkedIn profile <ArrowUpRight size={16} /></a>}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.intro}><h1>A world of<br />shared perspectives.</h1><p>Find the people rethinking social science, one connection at a time.</p></div>
            <div className={styles.filters}>
              <label className={styles.search}><Search size={18} /><input aria-label="Search people, research, or occupation" placeholder="Search people or research" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={16} /></button>}</label>
              <label className={styles.fieldLabel}><span>Research area</span><select value={field} onChange={(event) => setField(event.target.value)}><option value="">All research areas</option>{fields.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
            </div>
            <div className={styles.resultHeading}><span aria-live="polite">{loading ? 'Loading community…' : `${filteredMembers.length} ${filteredMembers.length === 1 ? 'person' : 'people'}`}</span><span>AROUND THE WORLD</span></div>
            <div ref={memberList} className={styles.memberList} aria-label="Member list" aria-busy={loading}>
              {loading ? <div className={styles.emptyState}><LoaderCircle size={24} className={styles.spin} /><p>Finding your community…</p></div> : dataError ? <div className={styles.emptyState}><p>{dataError}</p><button className={styles.secondaryButton} onClick={() => void loadMembers()}>Try again</button></div> : filteredMembers.length === 0 ? <div className={styles.emptyState}><Users size={27} /><h2>{members.length ? 'No matches yet' : 'The map starts with you'}</h2><p>{members.length ? 'Try a different name or research area.' : 'Add your pin and help this community grow.'}</p>{(query || field) && <button className={styles.secondaryButton} onClick={() => { setQuery(''); setField(''); }}>Clear filters</button>}</div> : visibleMembers.map((member, index) => (
                <button key={`${member.email}-${index}`} className={styles.memberCard} onClick={() => selectMember(member)}>
                  <MemberAvatar member={member} /><span className={styles.memberText}><strong>{member.full_name || 'Community member'}</strong><span>{member.user_research_tag || member.user_occupation || 'DSSP community'}</span></span><ChevronRight size={17} />
                </button>
              ))}
              {!loading && !dataError && filteredMembers.length > 0 && <div ref={loadMoreTrigger} className={styles.listPagination}>
                <p aria-live="polite">Showing {visibleMembers.length} of {filteredMembers.length} people</p>
                {hasMoreMembers && <button className={styles.secondaryButton} onClick={() => setVisibleCount((count) => count + MEMBER_PAGE_SIZE)}>Load more members</button>}
              </div>}
            </div>
          </>
        )}
        <div className={styles.sidebarFooter}><p>{authorized ? hasMarker ? 'You’re part of this community.' : 'Your perspective belongs here.' : 'Explore freely. Sign in to share your story.'}</p>{contributionControl}</div>
      </aside>

      <section className={styles.mapRegion} aria-label="Interactive community map">
        <div ref={mapContainer} className={styles.mapCanvas} />
        <div className={styles.mapLabel}><Globe2 size={16} /><span>Many places. Shared purpose.</span></div>
        {!mapReady && !mapError && <div className={styles.mapLoading} role="status"><LoaderCircle size={25} className={styles.spin} /><span>Opening the world…</span></div>}
        {mapError && <div className={styles.mapUnavailable} role="status"><Globe2 size={34} /><h2>A connection away.</h2><p>{mapError}</p><button className={styles.secondaryButton} onClick={() => { setSelected(null); setSidebarOpen(true); }}>Browse the community</button></div>}
        {notice && <div className={styles.notice} role="status"><Check size={18} /><span>{notice}</span><button aria-label="Dismiss message" onClick={() => setNotice('')}><X size={17} /></button></div>}
        {isPlacing ? (
          <>
            <div className={styles.crosshair} aria-hidden="true"><Plus size={30} strokeWidth={1.4} /></div>
            <div className={styles.placementPanel}><span className={styles.placementIcon}><MapPin size={21} /></span><div><strong>Find your place</strong><p>Tap a location, or move the map and use its center.</p></div><div className={styles.placementActions}><button className={styles.secondaryButton} onClick={() => { setIsPlacing(false); setCoordinates(null); }}>Cancel</button><button className={styles.primaryButton} onClick={() => { const center = map.current?.getCenter(); if (center) chooseLocation(center.lat, center.lng); }}>Use map center</button></div></div>
          </>
        ) : <button className={styles.resetView} onClick={() => map.current?.flyTo({ center: [35, 25], zoom: 1.7, bearing: 0, pitch: 0, essential: false })} disabled={!mapReady}><Compass size={17} /> World view</button>}
        <div className={styles.mapCredit}>A growing community by DSSP</div>
      </section>

      {!isPlacing && <div className={styles.mobileToolbar}><button className={styles.secondaryButton} aria-controls="community-panel" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen((open) => !open)}><Users size={18} /> People <span className={styles.count}>{members.length}</span></button>{contributionControl}</div>}

      <Dialog header="Put your perspective on the map" visible={formVisible} onHide={closeForm} modal draggable={false} resizable={false} blockScroll closable={!pending} closeOnEscape={!pending} className={styles.dialog} maskClassName={styles.dialogMask}>
        <form onSubmit={submitProfile} className={styles.form}>
          <p className={styles.formIntro}>Introduce yourself to a global community of researchers, students, and curious minds.</p>
          {coordinates && <div className={styles.locationPreview}><MapPin size={19} /><div><strong>Your selected location</strong><span>{coordinates[0].toFixed(4)}°, {coordinates[1].toFixed(4)}°</span></div><button type="button" disabled={pending} onClick={() => { closeForm(); setIsPlacing(true); }}>Change</button></div>}
          <div className={styles.formGrid}>
            <label>Full name <span>*</span><input name="name" autoComplete="name" required value={fullName} disabled={pending} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" /></label>
            <label>Occupation / title <span>*</span><input name="occupation" autoComplete="organization-title" required value={title} disabled={pending} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Sociology student" /></label>
            <label>Research area <span>*</span><select name="research" required value={research} disabled={pending} onChange={(event) => setResearch(event.target.value)}><option value="" disabled>Select your area</option>{ResearchType.map((type) => <option key={type.code} value={type.code}>{type.name}</option>)}</select></label>
            <label>LinkedIn <small>Optional</small><input name="linkedin" type="url" inputMode="url" value={linkedinLink} disabled={pending} onChange={(event) => setLinkedInLink(event.target.value)} placeholder="https://linkedin.com/in/…" /></label>
          </div>
          {research === 'Other' && <label>Your research area <span>*</span><input name="other-research" required value={otherResearch} disabled={pending} onChange={(event) => setOtherResearch(event.target.value)} placeholder="Tell us your field" /></label>}
          <label>A little about you <span>*</span><textarea name="summary" required rows={4} value={summary} disabled={pending} onChange={(event) => setSummary(event.target.value)} placeholder="What are you studying, questioning, or working on?" /></label>
          <p className={styles.formNote}>Your profile, selected location, and account email will be visible to the community.</p>
          {formError && <p className={styles.formError} role="alert">{formError}</p>}
          <div className={styles.formActions}><button type="button" className={styles.secondaryButton} disabled={pending} onClick={closeForm}>Cancel</button><button type="submit" className={styles.primaryButton} disabled={pending}>{pending ? <LoaderCircle size={17} className={styles.spin} /> : <MapPin size={17} />}{pending ? 'Saving your profile…' : 'Add me to the map'}</button></div>
        </form>
      </Dialog>
      <Dialog header="Remove your pin?" visible={deleteVisible} onHide={() => { if (!pending) setDeleteVisible(false); }} modal draggable={false} resizable={false} blockScroll closable={!pending} closeOnEscape={!pending} className={`${styles.dialog} ${styles.confirmDialog}`} maskClassName={styles.dialogMask}>
        <p className={styles.formIntro}>Your profile will be removed from the community map. You can add a new pin later.</p>
        {formError && <p className={styles.formError} role="alert">{formError}</p>}
        <div className={styles.formActions}><button className={styles.secondaryButton} disabled={pending} onClick={() => setDeleteVisible(false)} autoFocus>Keep my pin</button><button className={styles.dangerButton} disabled={pending} onClick={() => void deleteProfile()}>{pending ? <LoaderCircle size={16} className={styles.spin} /> : <Trash2 size={16} />}{pending ? 'Removing…' : 'Remove pin'}</button></div>
      </Dialog>
    </div>
  );
}
