//service component for handling the axios requests associated with modules
import api from "./api"

export const fetchTestsUnderModule = async (moduleId) => {
    const response = await api.get(`tests/${moduleId}`)
    return response.data
}