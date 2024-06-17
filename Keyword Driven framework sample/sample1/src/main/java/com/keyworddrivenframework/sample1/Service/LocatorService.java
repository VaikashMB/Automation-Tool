package com.keyworddrivenframework.sample1.Service;

import com.keyworddrivenframework.sample1.Entity.Locator;
import com.keyworddrivenframework.sample1.Entity.Test;
import com.keyworddrivenframework.sample1.Repository.LocatorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocatorService {

    private final LocatorRepository locatorRepository;

    public LocatorService(LocatorRepository locatorRepository) {
        this.locatorRepository = locatorRepository;
    }
//to fetch all locators
    public List<Locator> getAllLocators(){
        return locatorRepository.findAll();
    }
//to add a locator
    public Locator addLocator(Locator locator){
        return locatorRepository.save(locator);
    }
//to add a locator under a particular test
    public Locator addLocatorUnderTestId(Test testId, Locator locator) {
        locator.setTestId(testId);
        return locatorRepository.save(locator);
    }
//to fetch locators under a particular test
    public List<Locator> getLocatorsUnderTestId(Test testId) {
        return locatorRepository.findByTestId(testId);
    }
//to update a locator
    public Locator updateLocator(int locatorId, Locator updatedLocator) {
        Optional<Locator> optionalLocator = locatorRepository.findById(locatorId);
        if (optionalLocator.isPresent()) {
            Locator existingLocator = optionalLocator.get();
            existingLocator.setLocatorName(updatedLocator.getLocatorName());
            existingLocator.setLocatorType1(updatedLocator.getLocatorType1());
            existingLocator.setLocatorValue1(updatedLocator.getLocatorValue1());
            existingLocator.setLocatorType2(updatedLocator.getLocatorType2());
            existingLocator.setLocatorValue2(updatedLocator.getLocatorValue2());
            return locatorRepository.save(existingLocator);
        } else {
            throw new RuntimeException("Locator not found with id " + locatorId);
        }
    }
//to delete a locator by locatorId
    public void deleteLocator(int locatorId) {
        locatorRepository.deleteById(locatorId);
    }
//to search for a locator by locatorName
    public List<Locator> searchLocators(String query) {
        return locatorRepository.findByLocatorNameContainingIgnoreCase(query);
    }
//to search for a locator by locatorName under a particular test
    public List<Locator> searchLocators(Test testId,String query) {
        return locatorRepository.findByTestIdAndLocatorNameContainingIgnoreCase(testId,query);
    }
}
