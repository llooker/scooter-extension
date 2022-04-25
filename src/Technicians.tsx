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
import React from 'react'
import { Box2, Heading, Text, theme, Flex, FlexItem} from '@looker/components'
import {DataTable} from './Accessories'
import {technicianColumnsToRender, technicianColumnsToRender2} from './utils'
import wrench_circle from './images/wrench_circle.png'


/**
 * Renders header and container for table with technicians data
 */
export const Technicians: React.FC = ({technicianData}) => {
  // console.log("Technicians")
  // console.log({technicianData})
  return (
      <Box2>
      <Flex p={theme.sizes.small} alignItems="center">
        <FlexItem><img src={wrench_circle}></img></FlexItem>
        <FlexItem pl={theme.sizes.xsmall}>
          <Text>Technicians:</Text>
        </FlexItem>
      </Flex>
      <DataTable 
        data={technicianData} 
        columnsToRender={technicianColumnsToRender2}
        initialSortValue={technicianData[0].hasOwnProperty("technicians.duration") ? 
          "technicians.duration" : 
          "technicians.first_name"}
        initialSortOrder={technicianData[0].hasOwnProperty("technicians.duration") ? 
          "ASC" : 
          "DESC"}
        />
     </Box2>
    )
}