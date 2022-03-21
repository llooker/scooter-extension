import React, { useContext, useEffect, useState, useRef } from 'react'
import {Table, TableHead as TableHeadLC, TableBody as TableBodyLC , TableRow,TableDataCell, TableHeaderCell, Truncate, Button } from '@looker/components'
import {titleCaseHelper, sortHelper, defaultValueFormat} from '../utils'
import styled from 'styled-components';
import {trim, toLower} from 'lodash'
import {AppContext} from '../context'
import numeral from 'numeral'

export const DataTable: React.FC = ({data, columnsToRender, initialSortValue, initialSortOrder}) => {
  // console.log("DataTable")
  // console.log({data, columnsToRender, initialSortValue, initialSortOrder})
  const {setPointOfInterest, setDispatchPoint} = useContext(AppContext);
  const [tableData, setTableData] = useState(undefined)
  const [sortValue, setSortValue] = useState(undefined)
  const [sortOrder, setSortOrder] = useState(undefined)
  const prevSortValue = usePrevious(sortValue);
  const prevSortOrder = usePrevious(sortOrder);

  const handleRowClick = (id) => {
    const rowClicked = tableData[id.split("-").pop() || 0]
    setPointOfInterest(rowClicked)
    setDispatchPoint(undefined)
  } 

  const handleHeaderCellClick = (id) => {
    const thClicked =  document.getElementById(id);
    const thClickedDataAttr = thClicked.getAttribute('data');
    setSortValue(thClickedDataAttr)
    setSortOrder(prevSortOrder === "DESC" ? "ASC" : "DESC")
  } 

  const handleDispatchClick = (id) => {
    const rowDispatched = tableData[id.split("-").pop() || 0]
    setDispatchPoint(rowDispatched)
  }

  //initialize onload
  useEffect(() => {
    setSortValue(initialSortValue)
    setSortOrder(initialSortOrder)
  }, [])

  //listen to changes in props
  useEffect(() => {
    setSortValue(initialSortValue)
    setSortOrder(initialSortOrder)
  }, [initialSortValue, initialSortOrder]);

  useEffect(()=>{
    if (sortValue && sortOrder ){
      const sortedData = sortHelper({data, sortOrder, sortValue});
      setTableData(sortedData);
    }
  }, [sortValue, sortOrder, data])


  return(
    tableData ? 
    <TableContainer>
      <Table>
        
       {/* TO DO: is this worth it?? */}
      <TableHead 
        tableData={tableData} 
        columnsToRender={columnsToRender} 
        sortOrder={sortOrder} 
        sortValue={sortValue}
        handleHeaderCellClick={handleHeaderCellClick}
        />
        <TableBody 
          tableData={tableData} 
          columnsToRender={columnsToRender} 
          sortOrder={sortOrder} 
          sortValue={sortValue}
          handleRowClick={handleRowClick}
          handleDispatchClick={handleDispatchClick}
          />
    </Table>
    </TableContainer> : "")
}

const TableHead = ({tableData, columnsToRender, sortOrder, sortValue, handleHeaderCellClick}) => {
  return (
    <TableHeadLC>
            <StyledTableRow>
              {columnsToRender.map((item)=> {
                const propertyName = Object.keys(tableData[0])[item];
                const headerCellKey = `TableHeaderCell-${propertyName}-${item}`;
                if (propertyName){
                  return (
                    <TableHeaderCell 
                    key={headerCellKey}
                    id={headerCellKey}
                    data={propertyName}
                    onClick={() => handleHeaderCellClick(headerCellKey)}
                    >
                     <b>{titleCaseHelper(propertyName.split(".").pop())}</b>
                     {sortValue === propertyName ? 
                      ` ${sortOrder} `
                     : ""}
                    </TableHeaderCell>)
                }
              })}
            </StyledTableRow>
      </TableHeadLC>
  )
}

const TableBody = ({tableData, columnsToRender, sortOrder, sortValue, handleRowClick, handleDispatchClick}) => {
  return (
    <TableBodyLC>
        {tableData.map((item, index)=>{
          
        const isScooter = Object.keys(item)[0].indexOf("scoot") > -1 ;
        const partialKey = isScooter ? "scooters" : "technicians";
        const rowKey = `TableRow-${partialKey}-${trim(index)}`;

          return (
            <StyledTableRow
            key={rowKey}
            id={rowKey}
            onClick={() => handleRowClick(rowKey)}
            backgroundColor={
                  index % 2 ? "#DEE1E5" : "oops" //ui2 for now, needs to be fixed
                }
              >
                {columnsToRender.map((innerItem)=> {
                  const propertyName = Object.keys(item)[innerItem];
                  const dataCellKey = `TableDataCell-${propertyName}-${trim(index)}`
                  const dataCellValue = Object.values(item)[innerItem] && 
                    (Object.values(item)[innerItem].value || Object.values(item)[innerItem].value >= 0) ? 
                    Object.values(item)[innerItem].value : 
                    undefined;
                  const dataCellText = Object.values(item)[innerItem] && 
                    (Object.values(item)[innerItem].text || Object.values(item)[innerItem].text >= 0) ? 
                    Object.values(item)[innerItem].text : 
                    undefined;
                  if (propertyName && dataCellKey){
                    return (
                      <TableDataCell
                        key={dataCellKey}
                        id={dataCellKey}>
                        <Truncate>
                          {isNaN(dataCellText || dataCellValue) ? 
                          dataCellText || dataCellValue : 
                          numeral(dataCellText || dataCellValue).format(defaultValueFormat) 
                          }

                          {propertyName.indexOf("duration") > -1 ? 
                            <Button onClick={(e) => {
                              e.stopPropagation();
                              handleDispatchClick(dataCellKey)}
                            }>Dispatch</Button>
                          : ""}

                        </Truncate>                
                        </TableDataCell>)
                  }
            })}
              </StyledTableRow>
          )
        })}
      </TableBodyLC>
  )
}

const TableContainer = styled.div`
 max-width: 100%;
 max-height: 100%;
 overflow: scroll`;

 const StyledTableRow = styled(TableRow)<{
  backgroundColor: string
}>`
  background: ${({ backgroundColor }) => backgroundColor};
  cursor: pointer
`

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


