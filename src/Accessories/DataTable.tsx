import React, { useContext, useEffect, useState, useRef } from 'react'
import {Table, TableHead as TableHeadLC, TableBody as TableBodyLC , TableRow,TableDataCell, TableHeaderCell, Truncate, Button, theme } from '@looker/components'
import {titleCaseHelper, sortHelper, defaultValueFormat} from '../utils'
import styled from 'styled-components';
import {trim} from 'lodash'
import {AppContext} from '../context'

/**
 * Renders table consisting of scooter or technician data
 */
export const DataTable: React.FC = ({data, columnsToRender, initialSortValue, initialSortOrder}) => {
  // console.log("DataTable")
  // console.log({data, columnsToRender, initialSortValue, initialSortOrder})
  const {scooterToService, setScooterToService, setTechnicianToDispatch} = useContext(AppContext);
  const [tableData, setTableData] = useState(undefined)
  const [sortValue, setSortValue] = useState(undefined)
  const [sortOrder, setSortOrder] = useState(undefined)
  const [selectedRow, setSelectedRow] = useState(undefined)
  const prevSortValue = usePrevious(sortValue);
  const prevSortOrder = usePrevious(sortOrder);

  const handleRowClick = (id) => {
    const rowClicked = tableData[id.split("-").pop() || 0]
    setScooterToService(rowClicked)
    setTechnicianToDispatch(undefined)
    setSelectedRow(id.split("-").pop() || 0)
  } 

  const handleHeaderCellClick = (id) => {
    const thClicked =  document.getElementById(id);
    const thClickedDataAttr = thClicked.getAttribute('data');
    setSortValue(thClickedDataAttr)
    setSortOrder(prevSortOrder === "DESC" ? "ASC" : "DESC")
  } 

  const handleDispatchClick = (id) => {
    const rowDispatched = tableData[id.split("-").pop() || 0]
    setTechnicianToDispatch(rowDispatched)
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

  useEffect(()=> {
    if (scooterToService === undefined){
      setSelectedRow(undefined)
    }
  }, [scooterToService])


  return(
    tableData ? 
    <TableContainer>
      <Table>
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
        handleRowClick={handleRowClick}
        handleDispatchClick={handleDispatchClick}
        selectedRow={selectedRow}
        />
    </Table>
    </TableContainer> : "")
}

const TableHead = ({tableData, columnsToRender, sortOrder, sortValue, handleHeaderCellClick}) => {
  return (
    <StyledTableHead>
      <StyledTableRow backgroundColor={theme.colors.ui1}>
        {columnsToRender.map((item, index)=> {
          const propertyName = item;
          const headerCellKey = `TableHeaderCell-${propertyName}-${index}`;
          if (propertyName && tableData[0].hasOwnProperty(propertyName)){
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
    </StyledTableHead>
  )
}

const TableBody = ({tableData, columnsToRender, handleRowClick, handleDispatchClick, selectedRow}) => {
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
            onClick={() => isScooter ? handleRowClick(rowKey) : ""}
            backgroundColor={
                  index == selectedRow ? theme.colors.ui3 : 
                  index % 2 ? 
                  theme.colors.ui2 : 
                  "oops" //ui2 for now, needs to be fixed
                }
              >
                {columnsToRender.map((innerItem, innerIndex)=> {
                  const propertyName = innerItem;
                  const dataCellKey = `TableDataCell-${propertyName}-${trim(index)}`
                  //use value initially
                  //use text if defined
                  let dataCellText = item[innerItem] && 
                  (item[innerItem].value || item[innerItem].value >= 0) ? 
                  item[innerItem].value : 
                  undefined;
                  if (item[innerItem] && item[innerItem].hasOwnProperty("text")) dataCellText = item[innerItem].text
                  if (propertyName && dataCellKey && (dataCellText || dataCellText >= 0)){
                    return (
                      <TableDataCell
                        key={dataCellKey}
                        id={dataCellKey}>
                        <Truncate>
                          {dataCellText }
                          {propertyName.indexOf("duration") > -1 ? 
                            <StyledButton onClick={(e) => {
                              e.stopPropagation();
                              handleDispatchClick(dataCellKey)}
                            }
                            size="xsmall"
                            color="critical"
                            marginLeft={"15px"}
                            >Dispatch</StyledButton>
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
 max-width: 95%;
 max-height: 95%;
 overflow: scroll`;

 const StyledTableHead = styled(TableHeadLC)`
  position: sticky; 
  top: 0; z-index: 1;`;

 const StyledTableRow = styled(TableRow)<{
  backgroundColor: string
}>`
  background: ${({ backgroundColor }) => backgroundColor};
  cursor: pointer
`
const StyledButton = styled(Button)<{
  marginLeft: string
}>`
marginLeft: ${({ marginLeft }) => marginLeft};
`
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}


