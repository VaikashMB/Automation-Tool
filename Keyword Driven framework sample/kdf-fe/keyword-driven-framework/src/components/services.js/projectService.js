//service component for handling the axios requests associated with projects
import api from "./api"

export const fetchProjects = async () => {
    const response = await api.get('/allProjects')
    return response.data
}

export const fetchModulesUnderProject = async (projectId) => {
    const response = await api.get(`project/modules/${projectId}`)
    return response.data
}