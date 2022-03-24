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
import { Scooters } from './Scooters'
import { Map } from './Map'
import { Technicians } from './Technicians'
import {AppContext} from './context'
import {getWindowDimensions, computeDirections} from './utils'
import { Resizable } from "re-resizable";
import {Spinner} from './Accessories'


/**
 * Home component
 * performs initial Looker API calls and
 * renders scooters, map and technicians section of app
 */
export const Home: React.FC = () => {
  // console.log("Home")
  const { core40SDK } = useContext(ExtensionContext)
  const [message, setMessage] = useState('')
  const [scooterData, setScooterData] = useState(undefined)
  const [technicianData, setTechnicianData] = useState(undefined)
  const [scooterToService, setScooterToService] = useState(undefined)
  const [leftColumnWidth, setLeftColumnWidth] = useState(35)
  const [technicianToDispatch, setTechnicianToDispatch] = useState(undefined)
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

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
    if (scooterToService && scooterData && technicianData){

      const scooterToServiceLat = scooterToService["scooters.last_lat_coord"].value;
      const scooterToServiceLng = scooterToService["scooters.last_lng_coord"].value;
      
      computeDirections({technicianData, scooterToServiceLat, scooterToServiceLng}).then((result) => {
        Promise.all(result).then(result2 =>{
          setTechnicianData(result2)
        })
      })
    } else if (scooterData && technicianData){
      //delete previously appended duration property from arrayOfInterest
      let technicianCopy = [...technicianData]
      technicianCopy.map(item => delete item["technicians.duration"])
      setTechnicianData(technicianCopy) //produces race condition
    }

  }, [scooterToService])

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  const handleResize = (e) =>{
    const {height, width} = getWindowDimensions();
    const widthPercent = Math.floor((e.clientX/width)*100)
    setLeftColumnWidth(widthPercent)
  }


  return (
    <AppContext.Provider value={{scooterToService, 
    setScooterToService, 
    technicianToDispatch, 
    setTechnicianToDispatch,
    windowHeight
    }}>
    <ComponentsProvider>
      {scooterData && technicianData ? 
      
      
      <Flex height="100vh"
      width="100vw"
      bg="ui1"
      m="-8px"
      flexWrap="wrap">
        <FlexItem width="100vw" height="50px" maxHeight="50px">
          <Box2 p="u3" bg="ui2" >
            <Heading>
            🛴🛴🛴 Scooty ⚡⚡⚡
              </Heading>
          </Box2>
        </FlexItem>
        <Resizable size={{width: `${leftColumnWidth}vw`, height: `${windowHeight - 55}px`}}
          onResize={(e) => handleResize(e)}
          style={{borderRight: '2px solid #DEE1E5',
            overflow: "hidden",
          }}
        >
            <Box2 p="u1" bg="ui1">
              <Scooters scooterData={scooterData}/>
            </Box2>
        </Resizable>
        <Resizable size={{width: `${100 - leftColumnWidth}vw`, height: `${windowHeight - 55}px`}}
        onResize={(e) => handleResize(e)}
        style={{borderLeft: '2px solid #DEE1E5',
          overflow: "hidden",
        }}
        >
            <Box2 p="u1" height="60%" >
              <Map technicianData={technicianData} scooterData={scooterData}/>
            </Box2>
            <Box2 p="u1" bg="ui1" height="40%">
              <Technicians technicianData={technicianData}/>
            </Box2>
        </Resizable>
      </Flex>
      : <Spinner />}
      </ComponentsProvider>
    </AppContext.Provider>
  )
}


