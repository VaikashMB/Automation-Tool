//service component for handling the axios requests associated with locators
import api from "./api";

export const fetchLocators = async () => {
    const response = await api.get('/getLocators')
    return response.data
}

export const fetchLocatorsUnderTestId = async (testId) => {
    const response = await api.get(`getLocatorsUnderTestId/${testId}`)
    return response.data
}

export const deleteLocator = async (locatorId) => {
    await api.delete(`/deleteLocator/${locatorId}`);
};
