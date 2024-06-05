package com.keyworddrivenframework.sample1.Service;

import com.keyworddrivenframework.sample1.Entity.Locator;
import com.keyworddrivenframework.sample1.Entity.Project;
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

    public List<Locator> getAllLocators(){
        return locatorRepository.findAll();
    }

    public Locator addLocator(Locator locator){
        return locatorRepository.save(locator);
    }

    public Locator addLocatorUnderTestId(Test testId, Locator locator) {
        locator.setTestId(testId);
        return locatorRepository.save(locator);
    }

    public List<Locator> getLocatorsUnderTestId(Test testId) {
        return locatorRepository.findByTestId(testId);
    }

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

    public void deleteLocator(int locatorId) {
        locatorRepository.deleteById(locatorId);
    }

    public List<Locator> searchLocators(String query) {
        return locatorRepository.findByLocatorNameContainingIgnoreCase(query);
    }
}
