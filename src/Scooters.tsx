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
import { Box2, Heading, Chip, Text, MessageBar, theme, Flex, FlexItem} from '@looker/components'
import {DataTable} from './Accessories'
import {AppContext} from './context'
import {scooterColumnsToRender, colors, scooterColumnsToRender2} from './utils'
import styled from 'styled-components';
import bolt_circle from './images/bolt_circle.png'

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
      <Flex p={theme.sizes.small} alignItems="center">
        <FlexItem><img src={bolt_circle}></img></FlexItem>
        <FlexItem pl={theme.sizes.xsmall}>
          <Text>Scooters Available:</Text>
        </FlexItem>
      </Flex>

      {scooterToService === undefined ? 
      <Flex p={theme.sizes.small} alignItems="center">
        <StyledMessageBar noActions 
        background={colors.ui.hover}
        color={colors.text.dark}>Select a scooter to get started</StyledMessageBar>
      </Flex>
      : 
      <Flex p={theme.sizes.small} alignItems="center">
        <FlexItem><Text>Selected scooter id:</Text></FlexItem>
        <FlexItem pl={theme.sizes.xsmall}>
        <StyledChip onDelete={() =>{
          setScooterToService(undefined)
          setTechnicianToDispatch(undefined)
        }} 
        background={colors.ui.light}
        color={colors.text.backdrop}
        > 
        {scooterId}
        </StyledChip>
        </FlexItem>
      </Flex>
      }
      <DataTable 
        data={scooterData} 
        columnsToRender={scooterColumnsToRender2}
        initialSortValue={scooterData[0].hasOwnProperty("scooters.duration") ? 
          "scooters.duration" : 
          "scooters.days_since_last_service"}
        initialSortOrder={scooterData[0].hasOwnProperty("scooters.duration") ? 
          "ASC" : 
          "DESC"}
        style={{
          "zebra": true, 
          "pt": theme.sizes.xxxsmall, 
          "pb": theme.sizes.xxxsmall,
          "mt": theme.sizes.xxxsmall, 
          "mb": theme.sizes.xxxsmall,  }
        }/>
      </Box2>
  )
}

const StyledChip = styled(Chip)<{
  background?: string,
  color?: string
}>`
background: ${({ background }) => background};
color: ${({ color }) => color};
border-color: ${({ color }) => color};
border: 1px solid;
border-radius: 0;
`
const StyledMessageBar = styled(MessageBar)<{
  background: string,
  color: string,
}>`
background: ${({ background }) => background};
color: ${({ color }) => color};
border-radius: 0;
`