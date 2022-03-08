/*

 MIT License

 Copyright (c) 2022 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */
import React, { useContext, useEffect, useState } from 'react'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { Loader } from "@googlemaps/js-api-loader"
import styled from 'styled-components';
import {Spinner} from './Accessories'
import {AppContext} from './context'
import {icons} from './utils'
import {technicianToPoint, scooterToPoint, numberOfCorrespondingPoints, commonCircleStyleProps} from './utils'
/**
 * A simple component that uses the Looker SDK through the extension sdk to display a customized hello message.
 */
export const Map: React.FC = ({scooterData, technicianData}) => {
  const { core40SDK } = useContext(ExtensionContext)
  const {pointOfInterest} = useContext(AppContext);
  
  const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (scooterData && technicianData){
      let scootyDat: Features[] = []

      const loader = new Loader({
        apiKey: api_key,
        version: "weekly",
      });

      const initializeMap = () => {
        // console.log("initializeMap")
        loader.load().then(() => {
          const initialLat = scooterData[0][Object.keys(scooterData[0])[1]].value
          const initialLng = scooterData[0][Object.keys(scooterData[0])[2]].value
          const map = new google.maps.Map(document.getElementById("container"), {
            center: { lat: initialLat, lng: initialLng },
              zoom: 10,
          });
          const technicianPoints = technicianToPoint({technicianData})
          const scooterPoints = scooterToPoint({scooterData})
          scootyDat = [...technicianPoints, ...scooterPoints]

          // Create an info window to share between markers.
          const infoWindow = new google.maps.InfoWindow();

          const isScooter = pointOfInterest && Object.keys(pointOfInterest)[0].indexOf("scoot") > -1 ;
          const partialKeyOfInterest = isScooter ? "scooters" : "technicians";
          const pointOfInterestId = pointOfInterest && pointOfInterest[`${partialKeyOfInterest}.id`].value;
          
          // Create the markers.
          scootyDat.forEach((item) => {
            const scooterTitle =  `${item["type"]} #${item["id"]}.  <br/> Last Reported Battery: ${item["battery"]} <br/> Days Since Last Service: ${item["daysSinceService"]}`
            const technicianTitle =  `${item["type"]} #${item["id"]} <br/> Status: ${item["status"]} <br/> Name: ${item["name"]} <br/> Level: ${item["level"]} <br/> Phone Number: ${item["phoneNum"]}`
            
            const marker = new google.maps.Marker({
                  position: item["position"],
                  map: map,
                  title: item.type === "scooter" ? scooterTitle : technicianTitle,
                  label: `${item["id"]}`,
                  icon: icons[item["type"]].icon,
                  optimized: false,
                  animation: pointOfInterest && 
                    item.id === pointOfInterestId  &&
                    item.type === partialKeyOfInterest.slice(0, -1) ? 
                     google.maps.Animation.DROP : "",
                });
                
              const poiCircle =  pointOfInterest && 
                item.id === pointOfInterestId  &&
                item.type === partialKeyOfInterest.slice(0, -1) ? new google.maps.Circle({
                  ...commonCircleStyleProps,
                  strokeColor: "#FF0000",
                  fillColor: "#FF0000",
                  map,
                  center: item["position"],
                }) : "";

                const closestCorrespondingPoints = isScooter ? technicianPoints.slice(0, numberOfCorrespondingPoints) : scooterPoints.slice(0, numberOfCorrespondingPoints)
                const correspondingCircle =  pointOfInterest && closestCorrespondingPoints.indexOf(item) > -1 ? new google.maps.Circle({
                  ...commonCircleStyleProps,
                  strokeColor: "#1a73e8",
                  fillColor: "#1a73e8",
                  map,
                  center: item["position"],
                }) : "";

            // Add a click listener for each marker, and set up the info window.
            marker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(marker.getTitle());
              infoWindow.open(marker.getMap(), marker);
            });
          });
        });
      }
      initializeMap() //for now
    }
  }, [scooterData, technicianData, pointOfInterest]) 


  return (
    <MapContainer id="container">
      {scooterData && technicianData ? "" : <Spinner />
      }
    </MapContainer>
  )
}

const MapContainer = styled.div`
min-width: 100%;
min-height: 100%;
`