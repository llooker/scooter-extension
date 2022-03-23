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
import React, {useContext} from 'react'
import { Box2, Heading, Chip, Text, MessageBar, theme } from '@looker/components'
import {DataTable} from './Accessories'
import {AppContext} from './context'
import {scooterColumnsToRender} from './utils'
import styled from 'styled-components';
/**
 * Renders header and container for table with scooter data
 */
export const Scooters: React.FC = ({scooterData}) => {
  // console.log("Scooters")
  // console.log({scooterData})
  const {scooterToService, setScooterToService, setTechnicianToDispatch} = useContext(AppContext);
  const scooterId = scooterToService ?  scooterToService["scooters.id"].value : null;
  
  return (
    <Box2>
      {scooterToService === undefined ? 
      <MessageBar noActions>Select a scooter to get started</MessageBar>
      : 
      <Box2>
        <Text>Selected scooter id:</Text>
        <Chip onDelete={() =>{
          setScooterToService(undefined)
          setTechnicianToDispatch(undefined)
        }} 
        // background={theme.colors.critical}
        // marginLeft={"15px"}
        // color={theme.colors.criticalText}
        > 
        {scooterId}
        </Chip>
      </Box2>
      }
      <Heading textAlign="center">Scooters</Heading>
      <DataTable 
        data={scooterData} 
        columnsToRender={scooterColumnsToRender}
        initialSortValue={scooterData[0].hasOwnProperty("scooters.duration") ? 
          "scooters.duration" : 
          "scooters.days_since_last_service"}
        initialSortOrder={scooterData[0].hasOwnProperty("scooters.duration") ? 
          "ASC" : 
          "DESC"}/>
      </Box2>
  )
}

const StyledChip = styled(Chip)<{
  marginLeft: string,
  background: string,
  color: string,
}>`
marginLeft: ${({ marginLeft }) => marginLeft};
background: ${({ background }) => background};
color: ${({ color }) => color};
`