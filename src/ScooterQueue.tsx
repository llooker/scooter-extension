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
import { Box2, Heading } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'
import {Spinner, DataTable} from './Accessories'
/**
 * A simple component that uses the Looker SDK through the extension sdk to display a customized hello message.
 */
export const ScooterQueue: React.FC = ({scooterData}) => {
  // console.log("ScooterQueue")
  // console.log({scooterData})
  const { core40SDK } = useContext(ExtensionContext)
  const [message, setMessage] = useState('')

  // const sortedScooterData = scooterData ? 
  //   scooterData.sort((a, b) => b["scooters.days_since_last_service"].value - a["scooters.days_since_last_service"].value): 
  //   ""

  return (
    <Box2>
        <Heading textAlign="center">Scooters</Heading>
    {scooterData ? 
      <DataTable 
      data={scooterData} 
      columnsToRender={Array.from(Array(Object.keys(scooterData[0]).length).keys())}
      initialSortValue={scooterData[0].hasOwnProperty("scooters.duration") ? 
        "scooters.duration" : 
        "scooters.days_since_last_service"}
      initialSortOrder={scooterData[0].hasOwnProperty("scooters.duration") ? 
        "ASC" : 
        "DESC"}
      />: 
   <Spinner />}</Box2>
  )
}