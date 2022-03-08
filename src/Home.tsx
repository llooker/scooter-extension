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
import { ComponentsProvider, Heading, Box2, Flex, FlexItem } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'
import { ScooterQueue } from './ScooterQueue'
import { Map } from './Map'
import { Technicians } from './Technicians'
import {AppContext} from './context'
import {calculateDistance, sortHelper} from './utils'

/**
 * A simple component that uses the Looker SDK through the extension sdk to display a customized hello message.
 */
export const Home: React.FC = () => {
  // console.log("Home")
  const { core40SDK } = useContext(ExtensionContext)
  const [message, setMessage] = useState('')
  const [scooterData, setScooterData] = useState(undefined)
  const [technicianData, setTechnicianData] = useState(undefined)
  const [pointOfInterest, setPointOfInterest] = useState(undefined)

  useEffect(() => {
    //load data from technician and scooter query from Looker
    const getData = async () => {
      try {
        const scooterQueryForSlugResp = await core40SDK.ok(core40SDK.query_for_slug("9vP8udIOywTCPEwQgAxYTM"))
        const scooterQuery = await core40SDK.ok(core40SDK.run_query({query_id: scooterQueryForSlugResp.id,
          result_format: "json_detail",  cache: false}))
        setScooterData(scooterQuery.data)
        const technicianQueryForSlugResp = await core40SDK.ok(core40SDK.query_for_slug("nVJWfWhjD5JNZoPlHlvZxy"))
        const technicianQuery = await core40SDK.ok(core40SDK.run_query({query_id: technicianQueryForSlugResp.id,
          result_format: "json_detail", cache: false}))
        setTechnicianData(technicianQuery.data)
      } catch (error) {
        console.error(error)
        setMessage('An error occurred while getting information about me!')
      }
    }
    getData()
  }, [core40SDK]) //onload

  useEffect(() => {
    if (pointOfInterest && scooterData && technicianData){
      const isScooter = Object.keys(pointOfInterest)[0].indexOf("scoot") > -1 ;
      const partialKeyOfInterest = isScooter ? "scooters" : "technicians";
      const latOfInterest = pointOfInterest[`${partialKeyOfInterest}.last_lat_coord`].value;
      const lngOfInterest = pointOfInterest[`${partialKeyOfInterest}.last_lng_coord`].value;
      const correspondingPartialKey = isScooter ? "technicians" : "scooters";

      let correspondingArray = isScooter ? [...technicianData] : [...scooterData]
      correspondingArray.map(item => {
        const correspondingLat = item[`${correspondingPartialKey}.last_lat_coord`].value
        const correspondingLng = item[`${correspondingPartialKey}.last_lng_coord`].value
        const distance = calculateDistance(latOfInterest, lngOfInterest, correspondingLat, correspondingLng, "N" )
        item[`${correspondingPartialKey}.distance`] = {value: distance};
      })
      correspondingArray = sortHelper({data: correspondingArray, 
        sortOrder: "ASC", 
        sortValue: `${correspondingPartialKey}.distance`})
      isScooter ? setTechnicianData(correspondingArray) : setScooterData(correspondingArray)
    }

  }, [pointOfInterest])

  // const handleDrag = ({e}) =>{
  //   console.log("onDrag")
  //   console.log({e})
  //   var rect = e.target.getBoundingClientRect();
  //   console.log(rect.top, rect.right, rect.bottom, rect.left);
  // }

  return (
    <AppContext.Provider value={{pointOfInterest, setPointOfInterest,
    technicianData, setTechnicianData, 
    scooterData, setScooterData}}>
      <ComponentsProvider>
      <Flex height="100vh" 
      width="100vw" 
      bg="ui1" 
      m="-8px" 
      flexWrap="wrap">
        <FlexItem width="100vw">
          <Box2 p="u5" bg="ui2" height="8vh">
            <Heading>
            🛴🛴🛴 Scooty ⚡⚡⚡
              </Heading>
          </Box2>
        </FlexItem>
        <FlexItem width="49vw">
          <Box2   p="u5" bg="ui1" height="92vh">
            <ScooterQueue scooterData={scooterData}/>
          </Box2>
        </FlexItem>
        {/* <FlexItem bg="ui4" width="1vw" draggable onDrag={(e) => handleDrag({e})}>
        </FlexItem> */}
        <FlexItem width="49vw">
          <Box2 height="60vh" >
            <Map  technicianData={technicianData} scooterData={scooterData}/>
          </Box2>
          <Box2 p="u5" bg="ui1" height="32vh">
            <Technicians technicianData={technicianData}/>
          </Box2>
        </FlexItem>
      </Flex>
      </ComponentsProvider>
    </AppContext.Provider>
  )
}


