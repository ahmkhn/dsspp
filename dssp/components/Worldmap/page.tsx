'use client';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster"; 
import { useState } from 'react';
import dropdownResearchTypes from "@/public/ResearchTypes.json";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Dialog} from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import ResearchType from "@/public/ResearchTypes.json";
import {useEffect, useRef, useCallback} from 'react';
import {MapRef, ViewStateChangeEvent} from 'react-map-gl';
import { Map } from "react-map-gl";
import {InputTextarea} from 'primereact/inputtextarea';
import {Button} from 'primereact/button';
import 'primereact/resources/themes/mira/theme.css';
import { Jersey_10 } from "next/font/google";
import { createClientComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { addData } from "./test";


type worldMapProps = {
    authorized: boolean | null;
}

type researchType = {
    "name":string
    "code":string
}
type Coordinate = [number,number];
export default function Worldmap( {authorized} : worldMapProps) {
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [showInputDiv, setShowInputDiv] = useState(true);
    const [visible, setVisible] = useState(false);
    const [longLat, setLongLat] = useState<Coordinate | null>(null);
    //user input
    const [fullName, setFullName] = useState<string|null>(null);
    const [title,setTitle] = useState<string|null>(null);
    const [research,setResearch] = useState<researchType|null>(null);
    const [img,uploadImg] = useState<ImageBitmap|null>(null);
    const [locationCoordinates,setLocationCoordinates] = useState<[number,number]|null>(null);
    const [linkedinLink,setLinkedInLink] = useState<string|null>(null);

    const MIN_DISTANCE = 10;

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [spinEnabled, setSpinEnabled] = useState(true);
    const spinRef = useRef(true);
    const [showDialog, setShowDialog] = useState(true);

    /*const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const requestBody = {
          userFullName: "jerryasif",
          userResearchTag: "jerry research",
          userResearchDesc: "Your research description here",
          userLocationX: 4,
          userLocationY: 3,
          userOccupation: "dshkfl",
        };
        console.log('Sending request body:', JSON.stringify(requestBody));
        const supabase = createClientComponentClient();
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Client-side session:', session);
        const response = await fetch('/api/addUserDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          credentials: 'include', // Add this line
        });
        console.log('Raw response:', response);
        const data = await response.json();
        console.log('Parsed response data:', data);
        if (!response.ok) {
          throw new Error(`Failed to add user details: ${data.message || response.statusText}`);
        }
        console.log('User details added successfully:', data);
      } catch (error) {
        console.error('Error adding user details:', error);
      }
    };*/

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await addData();
    }
    



    function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c; // Distance in km
    }

    useEffect(() => {
      const hasSeenDialog = localStorage.getItem('hasSeenDialog');
      if (!hasSeenDialog) {
        setShowDialog(true);
        localStorage.setItem('hasSeenDialog', 'true');
      }
    }, []);
    
    const spinGlobe = useCallback(() => {
      if (!map.current || !spinRef.current) return;
    
      const secondsPerRevolution = 120;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      const zoom = map.current.getZoom();
    
      if (zoom < maxSpinZoom) {
        let distancePerSecond = 30 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
    
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        
        // Use requestAnimationFrame to control the animation
        requestAnimationFrame(() => {
          if (map.current) {
            map.current.panTo(center, { duration: 1000, animate: true });
          }
        });
      }
    }, []);

  const addMarker = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (!map.current || spinRef.current) return;
    setVisible(true);
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = "url('https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png')";
    el.style.backgroundSize = 'cover';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.cursor = 'pointer';
    setLongLat([e.lngLat.lat,e.lngLat.lng]);
    new mapboxgl.Marker(el)
      .setLngLat(e.lngLat)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h1>empty</h1>`)
      )
      .addTo(map.current);
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;


    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      projection: 'globe',
      zoom: 3,
      center: [130, 30]
    });

    map.current.on('style.load', () => {
      map.current?.setFog({});
    });

    let userInteracting = false;

    map.current.on('mousedown', () => {
      userInteracting = true;
    });

    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('dragend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('pitchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('rotateend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    map.current.on('click', addMarker);

    spinGlobe();

    return () => {
      if (map.current) {
        map.current.off('click', addMarker);
        map.current.remove();
        map.current = null;
      }
    };
  }, [spinGlobe, addMarker]);

  useEffect(() => {
    spinRef.current = spinEnabled;
    if (!spinEnabled && map.current) {
      map.current.stop();
    } else if (spinEnabled) {
      spinGlobe();
    }
  }, [spinEnabled, spinGlobe]);

  const handleSpinClick = () => {
    setSpinEnabled(!spinEnabled);
  };

  return (
    <>
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      <button
        onClick={handleSpinClick}
        className="border-black border-2 rounded-md"
        style={{
          font: 'bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif',
          backgroundColor: 'white',
          color: 'black',
          position: 'absolute',
          top: '20px',
          left: '50%',
          zIndex: 1,
          width: '200px',
          marginLeft: '-100px',
          display: 'block',
          cursor: 'pointer',
          padding: '10px 20px',
          borderRadius: '3px',
        }}
      >
        {spinEnabled ? 'Pause rotation' : 'Start rotation'}
      </button>
    </div>
    <Dialog className="dialog-popup w-[40rem] max-w-[50rem] border border-black" header="Input your details" visible={visible} position="top" onHide={() => {if (!visible) return; setVisible(false); }}>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>)=>{
        handleSubmit(e);
      }}>
                    <p className="text-blac text-center">Please <strong>make sure </strong>the marker on the map is accurate to the location you would like to set! :) (this window can be moved!)</p>
                    <div className="flex justify-center gap-8">
                        <div className="flex flex-col justify-content-center card gap-6 mt-8">
                            <InputText required className="h-10 border border-black rounded-md p-2 w-[12rem]" id="name" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Enter Full Name" />
                            <InputText required className="h-10 border border-black rounded-md p-2 w-[12rem]" id="name" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Enter Job Title" />
                        </div>
                        <div className="flex flex-col justify-content-center card gap-6 mt-8">
                            <Dropdown
                                required
                                className="border border-black rounded-md h-10 w-[12rem]"
                                value={research}
                                options={ResearchType.map((type) => ({ label: type.name, value: type.code }))}
                                onChange={(e) => setResearch(e.value)}
                                placeholder="Select a research"
                            />
                            <InputText required className="h-10 border border-black rounded-md p-2 w-[12rem]" id="name" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Enter Phone Number" />
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow justify-center items-center card gap-6 mt-4">
                            <InputTextarea
                                disabled
                                rows={2}
                                className="w-[12rem] border-2 border-black rounded-md text-center mt-2 flex p-6 "
                                placeholder="'other' research type, currently disabled."
                            />
                            <Button type="submit" className="border border-black rounded-md p-2 text-white bg-black">Submit</Button>
                    </div>
      </form>       
     </Dialog>
     <Dialog 
        className="bg-white text-black rounded-md p-8 flex justify-center text-center"
        visible={showDialog} 
        onHide={() => setShowDialog(false)}
        header="Welcome!"
        style={{ width: '30vw' }}
      >
        <p>To set a marker, make sure you stop the map's rotation!</p>
        <p>Explore the map and click on other markers to see other people's story!</p>
      </Dialog>
    </>
  );
};


