import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'

const ResultComponent = ({ testResultsByRunId }) => {

    const fields = [
        {
            field: "id",
            headerName: <strong>ID</strong>,
            width: 150,
            headerClassName: 'header-column',
        },
        {
            field: "runId",
            headerName: <strong>RunId</strong>,
            width: 200,
            headerClassName: 'header-column',
        },
        {
            field: "testId",
            headerName: <strong>TestId</strong>,
            width: 125,
            headerClassName: 'header-column',
        },
        {
            field: "description",
            headerName: <strong>Description</strong>,
            width: 200,
            headerClassName: 'header-column',
        },
        {
            field: "result",
            headerName: <strong>Result</strong>,
            width: 170,
            headerClassName: 'header-column',
            cellClassName: (params) => params.value === "PASS" ? 'cell-pass' : 'cell-fail',
            renderCell: (params) => {
                return <strong>{params.value}</strong>;
            }
        },
        {
            field: "screenshot",
            headerName: <strong>Screenshot-Link</strong>,
            width: 200,
            headerClassName: 'header-column',
            renderCell: (params) => {
                if (params.value) {
                    return <a href={`screenshots/${params.value}`} target="_blank" rel="noopener noreferrer">View Screenshot</a>;
                } else {
                    return <span></span>;
                }
            }
        },
    ]

    const rows = testResultsByRunId.map((data) => {
        return {
            id: data.id,
            runId: data.runId,
            testId: data.testId.testId,
            description: data.description,
            result: data.result,
            screenshot: data.screenshotLink
        }
    })

    const getRowId = (data) => data.id

    return (
        <Box>
            <DataGrid
                columns={fields}
                rows={rows}
                getRowId={getRowId}
                disableRowSelectionOnClick
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
                }
                sx={{
                    boxShadow: 3,
                    border: 1,
                    borderColor: 'black',
                }}
            />
        </Box>
    )
}

export default ResultComponent
