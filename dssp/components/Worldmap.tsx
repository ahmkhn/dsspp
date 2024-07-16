'use client';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster"; 
import { useState } from 'react';
import dropdownResearchTypes from "@/public/ResearchTypes.json";
type worldMapProps = {
    authorized: boolean | null;
}

type researchType = {
    "name":string
    "code":string
}

export default function Worldmap( {authorized} : worldMapProps) {
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [showInputDiv, setShowInputDiv] = useState(true);
    const [visible, setVisible] = useState(false);

    //user input
    const [fullName, setFullName] = useState<string|null>(null);
    const [title,setTitle] = useState<string|null>(null);
    const [research,setResearch] = useState<researchType|null>(null);
    const [img,uploadImg] = useState<ImageBitmap|null>(null);
    const [locationCoordinates,setLocationCoordinates] = useState<[number,number]|null>(null);
    const [linkedinLink,setLinkedInLink] = useState<string|null>(null);
    //user input end




    
    const Markers = () => {
        if(authorized){
            useMapEvents({
                click(e) {                                
                    setSelectedPosition([
                        e.latlng.lat,
                        e.latlng.lng
                    ]);
                    setShowInputDiv(true); // Show the input div
                },            
            });
        }
        return selectedPosition ? (
            <Marker           
                key={selectedPosition[0]}
                position={selectedPosition}
                interactive={false}
                icon={customIcon} 
            />
        ) : null;
    }

    const customIcon = new Icon({
        iconUrl: "https://www.reshot.com/preview-assets/icons/RX7PT3FJZK/pin-RX7PT3FJZK.svg",
        iconSize: [90,90]
    });

    return (
        <>
            <MapContainer className="h-full max-h-full" zoom={10} center={[31.5000,74.3017]}>
                <TileLayer
                    attribution="Google Maps"
                    url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}" // satellite
                    maxZoom={20}
                    subdomains={["mt0", "mt1", "mt2", "mt3"]}
                />
                <Markers />
                <MarkerClusterGroup chunkedLoading></MarkerClusterGroup>
            </MapContainer>
        </>
    );
}
