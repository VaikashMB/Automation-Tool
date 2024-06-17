//component for displaying the subtest cards along with the add card and the execute button
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const SubTests = ({ subTests, onDragEnd, handleAddSubTest, handleExecution }) => {
    return (
        <Box>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={subTests}>
                    {(provided) => (
                        <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            sx={{
                                maxHeight: '395px',
                                overflowY: 'auto',
                                border: '0px solid #ccc',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                padding: 1
                            }}
                        >
                            {subTests.map((subTest, index) => (
                                <Draggable key={subTest.id} draggableId={String(subTest.id)} index={index}>
                                    {(provided) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            variant="outlined"
                                            sx={{
                                                marginBottom: '10px',
                                                height: '40px',
                                                width: '800px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: 1,
                                                cursor: 'pointer',
                                                backgroundColor: subTest.flag === 'N' ? '#f0f0f0' : '#ffffff',
                                                borderRadius: 1,
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                },
                                                opacity: subTest.flag === 'N' ? 0.5 : 1,
                                            }}
                                            onClick={() => handleAddSubTest(subTest)}
                                        >
                                            <CardContent
                                                sx={{
                                                    padding: '0 !important',
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography variant="body1" sx={{ textAlign: 'start', width: '100%' }}>
                                                    {subTest.orderOfExecution} - {subTest.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            <Card
                variant="outlined"
                sx={{
                    marginTop: 1,
                    marginBottom: 2,
                    height: '40px',
                    width: '810px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#e0e0e0',
                    transition: 'background-color 0.2s, transform 0.2s',
                    '&:hover': {
                        backgroundColor: '#d0d0d0',
                        transform: 'scale(1.02)',
                    },
                }}
                onClick={() => handleAddSubTest(null)}
            >
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" component="div">
                        <strong>+Add</strong>
                    </Typography>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Button
                    type='button'
                    id='runBtn'
                    variant='contained'
                    onClick={handleExecution}
                    color='success'
                    sx={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                            backgroundColor: '#388e3c',
                        },
                    }}
                >
                    EXECUTE
                </Button>
            </Box>
        </Box>
    )
}

export default SubTests
