package com.keyworddrivenframework.sample1.Controller;

import com.keyworddrivenframework.sample1.Entity.Locator;
import com.keyworddrivenframework.sample1.Entity.Test;
import com.keyworddrivenframework.sample1.Service.LocatorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class LocatorController {
    private LocatorService locatorService;

    public LocatorController(LocatorService locatorService) {
        this.locatorService = locatorService;
    }

    @GetMapping("/getLocators")
    public List<Locator> getAllLocators() {
        return locatorService.getAllLocators();
    }

    @PostMapping("/addLocator")
    public Locator addLocator(@RequestBody Locator locator) {
        return locatorService.addLocator(locator);
    }

    @GetMapping("/getLocatorsUnderTestId/{testId}")
    public List<Locator> getLocatorsUnderTestId(@PathVariable Test testId) {
        return locatorService.getLocatorsUnderTestId(testId);
    }

    @PostMapping("/addLocatorUnderTestId/{testId}")
    public Locator addLocatorUnderTestId(@PathVariable Test testId, @RequestBody Locator locator) {
        return locatorService.addLocatorUnderTestId(testId, locator);
    }

    @PutMapping("/updateLocator/{locatorId}")
    public Locator updateLocator(@PathVariable int locatorId, @RequestBody Locator updatedLocator) {
        return locatorService.updateLocator(locatorId, updatedLocator);
    }

    @DeleteMapping("/deleteLocator/{locatorId}")
    public void deleteLocator(@PathVariable int locatorId) {
        locatorService.deleteLocator(locatorId);
    }

    @GetMapping("/searchLocators/{query}")
    public List<Locator> searchLocators(@PathVariable String query) {
        return locatorService.searchLocators(query);
    }
}
