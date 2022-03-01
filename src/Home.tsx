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
import { ComponentsProvider, Space, Heading } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { Loader } from "@googlemaps/js-api-loader"
import styled from 'styled-components';


const api_key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
/**
 * A simple component that uses the Looker SDK through the extension sdk to display a customized hello message.
 */
export const Home: React.FC = () => {
  console.log("Home")
  const { core40SDK } = useContext(ExtensionContext)
  const [message, setMessage] = useState('')
  const [scooterData, setScooterData] = useState(undefined)
  const [technicianData, setTechnicianData] = useState(undefined)

  useEffect(() => {
    //load data from technician and scooter query from Looker
    const getData = async () => {
      try {
        const scooterQueryForSlugResp = await core40SDK.ok(core40SDK.query_for_slug("3JOvvqZ1vujB9rvHxtRbsj"))
        console.log(scooterQueryForSlugResp)
        const scooterQuery = await core40SDK.ok(core40SDK.run_query({query_id: scooterQueryForSlugResp.id,
          result_format: "json_detail"}))
        setScooterData(scooterQuery.data)

        const technicianQueryForSlugResp = await core40SDK.ok(core40SDK.query_for_slug("X0NtpNfy9RlaDAuYRzVAsK"))
        console.log(technicianQueryForSlugResp)
        const technicianQuery = await core40SDK.ok(core40SDK.run_query({query_id: technicianQueryForSlugResp.id,
          result_format: "json_detail"}))
        setTechnicianData(technicianQuery.data)


      } catch (error) {
        console.error(error)
        setMessage('An error occurred while getting information about me!')
      }
    }

    getData()
  }, [core40SDK])

  useEffect(() => {
    if (scooterData && technicianData){
      const scootyDat: Features[] = []
      //keys from technician table
      const technicianID = Object.keys(technicianData[0])[0]
      const technicianFirstName = Object.keys(technicianData[0])[1]
      const technicianLastName = Object.keys(technicianData[0])[2]
      const technicianXCoord = Object.keys(technicianData[0])[4]
      const technicianYCoord = Object.keys(technicianData[0])[5]
      const technicianLevel = Object.keys(technicianData[0])[6]
      const technicianPhoneNumber = Object.keys(technicianData[0])[7]
      const technicianStatus = Object.keys(technicianData[0])[7]
      //keys from scooter table
      const scooterID = Object.keys(scooterData[0])[0]
      const scooterXCoord = Object.keys(scooterData[0])[1]
      const scooterYCoord = Object.keys(scooterData[0])[2]
      const scooterLastBattery = Object.keys(scooterData[0])[4]
      const scooterDaysSinceLastService = Object.keys(scooterData[0])[5]

      const loader = new Loader({
        apiKey: api_key,
        version: "weekly",
        // ...additionalOptions,
      });

      //icons for map
      const iconBase =
       "https://developers.google.com/maps/documentation/javascript/examples/full/images/"
      const icons: Record<string, { icon: string }> = {
        parkedScooter: {
          icon: iconBase + "parking_lot_maps.png",
        },
        technician: {
          icon: iconBase + "library_maps.png",
        },
        scooter: {
          icon: iconBase + "info-i_maps.png",
        },
      };

      const initializeMap = () => {

        loader.load().then(() => {
          const map = new google.maps.Map(document.getElementById("container"), {
            center: { lat: scooterData[0][scooterXCoord].value, lng: scooterData[0][scooterYCoord].value },
                      zoom: 10,
          });
          //format technician data to get passed into google maps api
          technicianData.map((item) => {
              scootyDat.push({id: item[technicianID].value,
                              type: "technician",
                              position: new google.maps.LatLng(parseFloat(item[technicianXCoord].value), parseFloat(item[technicianYCoord].value)),
                              name: `${item[technicianFirstName].value} ${item[technicianLastName].value}`,
                              level: item[technicianLevel].value,
                              phoneNum: item[technicianPhoneNumber].value,
                              status: item[technicianStatus].value
                            })
            })
           //format scooter data to get passed into google maps api
           scooterData.map((item) => {
                scootyDat.push({ id: item[scooterID].value,
                        type: "scooter",
                        position: new google.maps.LatLng(parseFloat(item[scooterXCoord].value), parseFloat(item[scooterYCoord].value)),
                        battery: item[scooterLastBattery].value,
                        daysSinceService: item[scooterDaysSinceLastService].value})
            })
         // Create an info window to share between markers.
          const infoWindow = new google.maps.InfoWindow();
          // Create the markers.
          scootyDat.forEach((item) => {
            const marker = new google.maps.Marker({
                  position: item["position"],
                  map: map,
                  title: item["type"] === "scooter" ?
                        `${item["type"]} #${item["id"]}.  <br/> Last Reported Battery: ${item["battery"]} <br/> Days Since Last Service: ${item["daysSinceService"]}` :
                        `${item["type"]} #${item["id"]} <br/> Status: ${item["status"]} <br/> Name: ${item["name"]} <br/> Level: ${item["level"]} <br/> Phone Number: ${item["phoneNum"]}`,
                  label: `${item["id"]}`,
                  icon: icons[item["type"]].icon,
                  optimized: false,
                });

            // Add a click listener for each marker, and set up the info window.
            marker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(marker.getTitle());
              infoWindow.open(marker.getMap(), marker);
            });
          });
        });
      }
      initializeMap()
    }
  }, [scooterData, technicianData])

  return (
    <ComponentsProvider>
      <Wrapper>
        <Space around height="10vh">
          <Heading>Scooters Needing Service</Heading>
        </Space>
        <Space around height="90vh">
          <MapContainer id="container" />
        </Space>
      </Wrapper>
    </ComponentsProvider>
  )
}


const Wrapper = styled.div`
    min-width: 100vw;
    min-height: 100vh;
`
const MapContainer = styled.div`
min-width: 100%;
min-height: 100%;
`