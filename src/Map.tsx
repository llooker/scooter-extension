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
import {markers} from './utils'
import {technicianToPoint, scooterToPoint} from './utils'
/**
 * Renders google map
 */
export const Map: React.FC = ({scooterData, technicianData}) => {
  const { core40SDK } = useContext(ExtensionContext)
  const {scooterToService, technicianToDispatch} = useContext(AppContext);

  const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  useEffect(() => {
    if (scooterData && technicianData){
      let scootyDat: Features[] = []

      const loader = new Loader({
        apiKey: api_key,
        version: "weekly",
      });

      const initializeMap = () => {
        loader.load().then(() => {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer();

          const technicianPoints = technicianToPoint(technicianData)
          const scooterPoints = scooterToPoint(scooterData)

          if (scooterToService && technicianToDispatch){
            scootyDat = [...scooterToPoint([scooterToService]), ...technicianToPoint([technicianToDispatch])]
          } else if (scooterToService){
            scootyDat = [...scooterToPoint([scooterToService]), ...technicianPoints,]
          } else {
            scootyDat = [...technicianPoints, ...scooterPoints]
          }

          //could be improved
          const initialLat = scooterData[0][Object.keys(scooterData[0])[1]].value
          const initialLng = scooterData[0][Object.keys(scooterData[0])[2]].value
          const map = new google.maps.Map(document.getElementById("container"), {
            center: { lat: initialLat, lng: initialLng },
              zoom: 9,
          });
          /**
           * from here: https://developers.google.com/maps/documentation/javascript/examples/hiding-features
           * and: https://developers.google.com/maps/documentation/javascript/style-reference
           */
          map.setOptions({ styles:[
            {
              featureType: "poi.attraction",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.government",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.medical",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.park",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.place_of_worship",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.school",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.sports_complex",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
          ], });

          directionsRenderer.setMap(map);

          // Create an info window to share between markers.
          const infoWindow = new google.maps.InfoWindow();

          const isScooter = scooterToService && Object.keys(scooterToService)[0].indexOf("scoot") > -1 ;
          const partialKeyOfInterest = isScooter ? "scooters" : "technicians";
          const scooterToServiceId = scooterToService && scooterToService[`${partialKeyOfInterest}.id`].value;
          const correspondingPartialKey = isScooter ? "technicians" : "scooters";
          const technicianToDispatchId = technicianToDispatch && technicianToDispatch[`${correspondingPartialKey}.id`].value;

          // Create the markers.
          scootyDat.forEach((item) => {
            const scooterTitle =  `${item["type"]} #${item["id"]}.  <br/> Last Reported Battery: ${item["battery"]} <br/> Days Since Last Service: ${item["daysSinceService"]}`
            const technicianTitle =  `${item["type"]} #${item["id"]} <br/> Status: ${item["status"]} <br/> Name: ${item["name"]} <br/> Level: ${item["level"]} <br/> Phone Number: ${item["phoneNum"]}`

            const marker = new google.maps.Marker({
                  position: item["position"],
                  map: map,
                  title: item.type === "scooter" ? scooterTitle : technicianTitle,
                  icon: {...markers[item["type"]],
                      anchor: new google.maps.Point(15, 30),
                  },
                  optimized: false
                });

            // Add a click listener for each marker, and set up the info window.
            marker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(marker.getTitle());
              infoWindow.open(marker.getMap(), marker);
            });
          });

          if (scooterToService && technicianToDispatch){
            const scooterPosition = scootyDat[0]["position"]
            const technicianPosition = scootyDat[1]["position"]
            directionsService.route({
              origin: technicianPosition,  
              destination: scooterPosition,
              travelMode: google.maps.TravelMode.DRIVING,
            }).then((response) => {
              directionsRenderer.setDirections(response);
            })
            .catch((e) => window.alert("Directions request failed due to " + status));
          }
        });
      }
      initializeMap() //for now
    }
  }, [scooterData, technicianData, technicianToDispatch])


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