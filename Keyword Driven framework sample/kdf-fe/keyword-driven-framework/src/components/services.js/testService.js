//service component for handling the axios requests associated with sub-tests and test-results
import api from "./api"

export const fetchSubTestsUnderTest = async (testId) => {
    const response = await api.get(`/keyword/subTests/${testId}`);
    return response.data;
};

export const executeAllKeywords = async (testId, payload) => {
    const response = await api.post(`/keyword/executeAll/${testId}`, payload);
    return response.data;
};

export const postTestResults = async (data) => {
    const response = await api.post('/postTestResults', data);
    return response.data;
};

export const updateExecutionOrder = async (testId, updatedOrder) => {
    const response = await api.put(`/keyword/updateExecutionOrder/${testId}`, updatedOrder);
    return response.data;
};

export const deleteSubTest = async (subTestId) => {
    const response = await api.delete(`/keyword/delete/${subTestId}`);
    return response.data;
};


