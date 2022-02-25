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
  const [data, setData] = useState(undefined)

  useEffect(() => {
    const getData = async () => {
      try {
        const {id} : {  id: number }  = await core40SDK.ok(core40SDK.query_for_slug("cjWhAe2Xk3K6GwSm8fAu8D"))
        const query = await core40SDK.ok(core40SDK.run_query({query_id: id, 
          result_format: "json_detail"}))
        setData(query.data)

      } catch (error) {
        console.error(error)
        setMessage('An error occurred while getting information about me!')
      }
    }

    getData()
  }, [core40SDK])

  useEffect(() => {
    if (data){
      const loader = new Loader({
        apiKey: api_key,
        version: "weekly",
        // ...additionalOptions,
      });

      const initializeMap = () => {
        // console.log("initializeMap")
        // console.log({data})
        const firstKey = Object.keys(data[0])[0]
        const firstDataVal = data[0][firstKey].value
        loader.load().then(() => {
          const map = new google.maps.Map(document.getElementById("container"), {
            center: { lat: firstDataVal[0], lng: firstDataVal[1] },
            zoom: 12,
          });

          // Create an info window to share between markers.
          const scooterLocales: [google.maps.LatLngLiteral, string][] = data.map((item, index)=> {
              return (
                [{ lat: item[firstKey].value[0], lng: item[firstKey].value[1] }, `Scooter no ${index + 1}`]
              )
          })
         // Create an info window to share between markers.
          const infoWindow = new google.maps.InfoWindow();
          // Create the markers.
          scooterLocales.forEach(([position, title], i) => {
            const marker = new google.maps.Marker({
              position,
              map,
              title: `${i + 1}. ${title}`,
              label: `${i + 1}`,
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
  }, [data])



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