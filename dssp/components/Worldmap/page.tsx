'use client';
import "leaflet/dist/leaflet.css";
import { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Dialog} from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import ResearchType from "@/public/ResearchTypes.json";
import {useEffect, useRef, useCallback} from 'react';
import {InputTextarea} from 'primereact/inputtextarea';
import {Button} from 'primereact/button';
import 'primereact/resources/themes/mira/theme.css';
import { addData } from "./test";
import { getAllMarkerUserData } from "./getMapData";
import { getUserDataExists } from "./getMapData";
import { removeData } from "./test";
import { getUserId } from "./getMapData";
import pin from "@/public/pin.gif";


import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { User } from "@supabase/supabase-js";

type worldMapProps = {
    authorized: User | null;
}


type Coordinate = [number,number];
export default function Worldmap( {authorized} : worldMapProps) {
  const toast = useRef<Toast>(null);
  const [userIDExists,setUserIDExists] = useState<boolean>(false);
  const accept = async () => {

    if (authorized) {
        setUserIDExists( await getUserId() );
        if(userIDExists===false){
          toast.current?.show({ severity: 'error', summary: 'Error', detail: "You don't have a marker!", life: 3000 });
        }else{
          try {
            await removeData();
            toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'Your marker has been deleted :)', life: 3000 });
          } catch (error) {
              toast.current?.show({ severity: 'error', summary: 'Error', detail: "there was an error", life: 3000 });
          }
        }
    } else {
        toast.current?.show({ severity: 'warn', summary: 'Error', detail: 'You are not signed in.', life: 3000 });
    }
}


    const reject = () => {
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have selected no', life: 3000 });
    }

    const confirm2 = () => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };



    const [visible, setVisible] = useState(false);
    const [longLat, setLongLat] = useState<Coordinate>([0,0]);
    //user input
    const [fullName, setFullName] = useState<string>("");
    const [title,setTitle] = useState<string>("");
    const [research,setResearch] = useState<string>("");
    const [linkedinLink,setLinkedInLink] = useState<string>("");
    const [researchDisabled,setResearchDisabled] = useState<boolean>(true);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [showDialog, setShowDialog] = useState(true);
    const [researchInputDescription,setResearchInputDescription] = useState<string>("'Other' research type. Currently disabled.")
    const [summary,setSummary] = useState<string>("");
    const [userExists,setUserExists] = useState<boolean>(false);
    const [introVisible,setIntroVisible] = useState(true);
    interface User {
      full_name: string;
      user_research_tag: string;
      avatar_url: string;
      user_research_description: string;
      user_occupation: string;
      user_location_x: number;
      user_location_y: number;
      linked_in_link: string;
      summary: string;
      email: string;
    }
    
    const [users, setUsers] = useState<User[] | null>(null);
    
    useEffect(() => {
      async function fetchData() {
        const data = await getAllMarkerUserData();
        setUsers(data);
      }
      fetchData();
    }, []);

    useEffect(() => {
      if (users === null) return;
      users.map((user, index) => {
          if (!map.current) return;
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = `url(${pin.src})`;
          el.style.backgroundSize = 'cover';
          el.style.width = '45px';
          el.style.height = '45px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          const popupContent = `
          <div class="p-4 bg-white text-black border border-gray-300 rounded-lg shadow-lg" style="max-width: 300px; width: 100%;">
            <div class="flex items-center mb-3">
              <img src="${user.avatar_url}" alt="${user.full_name}" class="w-16 h-16 rounded-full mr-3 object-cover border-2 border-gray-300 flex-shrink-0">
              <h1 class="text-xl font-bold break-words">${user.full_name}</h1>
            </div>
            <p class="text-sm mt-2"><span class="font-semibold">Research / Major:</span> ${user.user_research_tag}</p>
            <p class="text-sm mt-2"><span class="font-semibold">Summary:</span> ${user.summary}</p>
            <p class="text-sm mt-2"><span class="font-semibold">Occupation:</span> ${user.user_occupation}</p>
            <p class="text-sm mt-2"><span class="font-semibold">Location:</span> (${user.user_location_x}, ${user.user_location_y})</p>
            <p class="text-sm mt-2"><span class="font-semibold">Email:</span> <a href="mailto:${user.email}" class="text-blue-500 hover:underline">${user.email}</a></p>
            <a class="text-blue-500 hover:underline text-sm mt-2 block" href="${user.linked_in_link}" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
          </div>`;
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(popupContent);

          new mapboxgl.Marker(el)
              .setLngLat([user.user_location_y, user.user_location_x])
              .setPopup(
                  new mapboxgl.Popup({ offset: 25 })
                      .setHTML(popupContent)
              )
              .addTo(map.current);
      });
    }, [users]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      const researchUpdated = (researchDisabled ? research : researchInputDescription);
      await addData(fullName,longLat[0],longLat[1],title,researchInputDescription,researchUpdated,linkedinLink,summary);
      /*export async function addData(full_name:string,user_location_x:number,user_location_y:number,user_occupation:string,user_research_description:string,user_research_tag:string){
      */
    }
    useEffect(() => {
      const hasSeenDialog = localStorage.getItem('hasSeenDialog');
      if (!hasSeenDialog) {
        setShowDialog(true);
        localStorage.setItem('hasSeenDialog', 'true');
      }
    }, []);
    
    useEffect(() =>{
      if(research){
        if(research==="Other"){
          setResearchDisabled(false);
          setResearchInputDescription("");
        }else{
          setResearchDisabled(true);
          setResearchInputDescription("'Other' research type. Currently disabled.");
        }
      }
    },[research])
    

    const addMarker = useCallback(async (e: mapboxgl.MapMouseEvent & { originalEvent: MouseEvent }) => {
      if(!map.current) return; // make sure the map is loaded ? 
      if (!authorized) return;
    
      // Check if the click was on a marker
      if (e.defaultPrevented || e.originalEvent.target instanceof HTMLElement && e.originalEvent.target.className.includes('mapboxgl-marker')) {
        return; // Exit the function if the click was on a marker
      }
    
      try {
        const exists = await getUserDataExists();
        setUserExists(exists);
        if (exists) {
          return; // Exit if the user already exists
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
      }

      setVisible(true);
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = "url('https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png')";
      el.style.backgroundSize = 'cover';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      setLongLat([e.lngLat.lat, e.lngLat.lng]);
      new mapboxgl.Marker(el)
        .setLngLat(e.lngLat)
        .addTo(map.current);
    }, [map, authorized, setUserExists]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      projection: 'globe',
      zoom: 3,
      center: [70, 30]
    });
    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.on('style.load', () => {
      map.current?.setFog({});
    });
    map.current.on('click', addMarker);
  });

  return (
    <>
    <Toast ref={toast}/>
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      <ConfirmDialog/>
      <button
        onClick={confirm2}
        className="border-black border-2 rounded-md text-center bg-red-500"
        style={{
          font: 'bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif',
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
        Delete your marker?
      </button>
    </div>
    <Dialog className="dialog-popup w-[40rem] max-w-[50rem] border border-black" header="Input your details" visible={visible} position="top" onHide={() => {if (!visible) return; setVisible(false); }}>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>)=>{
        handleSubmit(e);
      }}>
                    <p className="text-black text-center">Please <strong>make sure </strong>the marker on the map is accurate to the location you would like to set! :) (this window can be moved!)</p>
                    <div className="flex justify-center gap-8">
                        <div className="flex flex-col justify-content-center card gap-6 mt-8">
                            <InputText required className="h-10 border border-black rounded-md p-2 w-[12rem]" id="name" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Enter Full Name" />
                            <InputText required className="h-10 border border-black rounded-md p-2 w-[12rem]" id="name" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Enter Job Title" />
                        </div>
                        <div className="flex flex-col justify-content-center card gap-6 mt-8">
                            <Dropdown
                                required
                                className="border border-black rounded-md h-10 w-[12rem]"
                                value={research}
                                options={ResearchType.map((type) => ({ label: type.name, value: type.code }))}
                                onChange={(e) => setResearch(e.target.value)}
                                placeholder="Select a research"
                            />
                            <InputText className="h-10 border border-black rounded-md p-2 w-[12rem]" id="name" value={linkedinLink} onChange={(e)=>setLinkedInLink(e.target.value)} placeholder="Enter LinkedIn Link" />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-6 mt-4">
                            <InputTextarea
                                disabled={researchDisabled}
                                rows={2}
                                className="w-[13rem] border-2 border-black rounded-md text-center mt-2 flex p-4 "
                                placeholder={researchInputDescription}
                                onChange={(e)=>setResearchInputDescription(e.target.value)}
                            />
                            <InputTextarea
                                rows={3}
                                className="w-[13rem] border-2 border-black rounded-md text-center mt-2 flex p-3 "
                                placeholder="Who are you and what's your research about? (please keep it concise!)"
                                required
                                onChange={(e)=>setSummary(e.target.value)}
                            />
                    </div>
                    <div className="flex flex-grow align-middle items-center justify-center mt-2">
                      <Button type="submit" className="border border-black rounded-md p-2 text-white bg-black">Submit</Button>
                    </div>
                   
      </form>       
     </Dialog>
    </>
  );
};
