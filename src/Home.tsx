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
import {calculateDistance, sortHelper, getWindowDimensions, computeDirections} from './utils'
import { Resizable } from "re-resizable";


/**
 * A simple component that uses the Looker SDK through the extension sdk to display a customized hello message.
 */
export const Home: React.FC = () => {
  // console.log("Home")
  const { core40SDK } = useContext(ExtensionContext)
  const [message, setMessage] = useState('')
  const [scooterData, setScooterData] = useState(undefined)
  const [technicianData, setTechnicianData] = useState(undefined)
  const [scooterToService, setScooterToService] = useState(undefined)
  const [leftColumnWidth, setLeftColumnWidth] = useState(50)
  const [technicianToDispatch, setTechnicianToDispatch] = useState(undefined)

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
        // technicianQuery.data.map(item => {
        //   item["technicians.full_name"] = {value: `${item["technicians.first_name"].value} ${item["technicians.last_name"].value}`}
        //   delete item["technicians.first_name"]
        //   delete item["technicians.last_name"]
        // })

        setTechnicianData(technicianQuery.data)
      } catch (error) {
        console.error(error)
        setMessage('An error occurred while getting information about me!')
      }
    }
    getData()
  }, [core40SDK]) //onload

  useEffect(() => {
    if (scooterToService && scooterData && technicianData){

      const isScooter = Object.keys(scooterToService)[0].indexOf("scoot") > -1 ;
      const partialKeyOfInterest = isScooter ? "scooters" : "technicians";
      const latOfInterest = scooterToService[`${partialKeyOfInterest}.last_lat_coord`].value;
      const lngOfInterest = scooterToService[`${partialKeyOfInterest}.last_lng_coord`].value;
      //delete previously appended duration property from arrayOfInterest
      const arrayOfInterest = isScooter ? [...scooterData] : [...technicianData]
      arrayOfInterest.map(item => delete item[`${partialKeyOfInterest}.duration`])

      const correspondingPartialKey = isScooter ? "technicians" : "scooters";
      const correspondingArray = isScooter ? [...technicianData] : [...scooterData]

      
      computeDirections({correspondingArray, correspondingPartialKey, latOfInterest, lngOfInterest}).then((result) => {
        Promise.all(result).then(result2 =>{
          if (isScooter){
            setTechnicianData(result2)
            setScooterData(arrayOfInterest)
          } else {
            setScooterData(result2)
            setTechnicianData(arrayOfInterest)
          }
        })
      })

      
    }

  }, [scooterToService])

  const handleResize = (e) =>{
    const {height, width} = getWindowDimensions();
    const widthPercent = Math.floor((e.clientX/width)*100)
    setLeftColumnWidth(widthPercent)
  }

  return (
    <AppContext.Provider value={{scooterToService, 
    setScooterToService, 
    technicianToDispatch, 
    setTechnicianToDispatch}}>
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
        <Resizable size={{width: `${leftColumnWidth}vw`}}
          onResize={(e) => handleResize(e)}
          style={{borderRight: '2px solid #DEE1E5',
            overflow: "hidden"
          }}
        >
          <FlexItem>
            <Box2 p="u5" bg="ui1" height="92vh">
              <ScooterQueue scooterData={scooterData}/>
            </Box2>
          </FlexItem>
        </Resizable>
        <Resizable size={{width: `${100 - leftColumnWidth}vw`}}
        onResize={(e) => handleResize(e)}
        style={{borderLeft: '2px solid #DEE1E5',
          overflow: "hidden"
        }}
        >
          <FlexItem>
            <Box2 p="u5" height="60vh" >
              <Map technicianData={technicianData} scooterData={scooterData}/>
            </Box2>
            <Box2 p="u5" bg="ui1" height="32vh">
              <Technicians technicianData={technicianData}/>
            </Box2>
          </FlexItem>
        </Resizable>
      </Flex>
      </ComponentsProvider>
    </AppContext.Provider>
  )
}


