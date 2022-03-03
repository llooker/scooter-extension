import React, { useContext, useEffect, useState } from 'react'
import {Table, TableHead, TableBody, TableRow, TableDataCell, Truncate } from '@looker/components'
import { ExtensionContext } from '@looker/extension-sdk-react'
import {titleCaseHelper} from '../utils'
import styled from 'styled-components';

export const DataTable: React.FC = ({data, columnsToRender}) => {
  // console.log("DataTable")
  // console.log({data, columnsToRender})
  return(
    <TableContainer>
      <Table>
      <TableHead>
            <TableRow>
              {columnsToRender.map((item)=> {
                return (
                  <TableDataCell>
                   <b>{titleCaseHelper(Object.keys(data[0])[item].split(".").pop())}</b>
                  </TableDataCell>)
              })}
            </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, index)=>{
          return (
            <TableRow>
            {columnsToRender.map((innerItem)=> {
              return (
                <TableDataCell>
                  <Truncate>
                    {Object.values(item)[innerItem].value}
                  </Truncate>
                </TableDataCell>)
            })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
    </TableContainer>)
}

const TableContainer = styled.div`
 max-width: 100%;
 max-height: 100%;
 overflow: scroll`;