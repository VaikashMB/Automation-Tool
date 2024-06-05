package com.keyworddrivenframework.sample1.Service;

import com.keyworddrivenframework.sample1.Entity.ActionKeywords;
import com.keyworddrivenframework.sample1.Entity.Locator;
import com.keyworddrivenframework.sample1.Entity.Test;
import com.keyworddrivenframework.sample1.Entity.TestResults;
import com.keyworddrivenframework.sample1.Repository.KeywordRepository;
import com.keyworddrivenframework.sample1.Repository.LocatorRepository;
import com.keyworddrivenframework.sample1.Repository.TestRepository;
import com.keyworddrivenframework.sample1.Utils.TestExecutor;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class KeywordService {

    private final TestExecutor testExecutor = new TestExecutor();

    @Getter
    private final List<TestResults> executionResults = new ArrayList<>();

    private final ThreadLocal<TestExecutor> testExecutorThreadLocal = ThreadLocal.withInitial(TestExecutor::new);

    @Autowired
    private KeywordRepository keywordRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private LocatorRepository locatorRepository;

    public List<ActionKeywords> getActionKeywordsByTestId(Test testId) {
        return keywordRepository.findByTestId(testId);
    }

    public ActionKeywords addTestUnderTestId(Test testId, ActionKeywords actionKeywords) {
        actionKeywords.setTestId(testId);
        return keywordRepository.save(actionKeywords);
    }

    public ActionKeywords deleteById(int id) {
        Optional<ActionKeywords> keywordOptional = keywordRepository.findById(id);
        if (keywordOptional.isPresent()) {
            ActionKeywords deletedKeyword = keywordOptional.get();
            keywordRepository.delete(deletedKeyword);
            return deletedKeyword;
        } else {
            return null;
        }
    }

    // Update order of execution for subtests
    public List<ActionKeywords> updateExecutionOrder(Test testId, List<ActionKeywords> actionKeywords) {
        // Ensure the provided test ID exists
        Test test = testRepository.findById(testId.getTestId()).orElse(null);
        if (test == null) {
            return null;
        }
        // Update the order of execution for each subtest
        for (ActionKeywords keyword : actionKeywords) {
            ActionKeywords existingKeyword = keywordRepository.findById(keyword.getId()).orElse(null);
            if (existingKeyword != null && existingKeyword.getTestId().equals(test)) {
                existingKeyword.setOrderOfExecution(keyword.getOrderOfExecution());
                keywordRepository.save(existingKeyword);
            }
        }

        // Fetch and return the updated list of subtests
        return getActionKeywordsByTestId(testId);
    }


    public void executeKeyword(Map<String, String> actionKeywords, Test testId, String startTime) {

        String runId = testId.getTestId() + "_" + startTime;
        TestExecutor testExecutor = testExecutorThreadLocal.get();

        String keyword = actionKeywords.get("keyword");
        String value = actionKeywords.get("value");
        String description = actionKeywords.get("description");
        boolean screenshotValue = Boolean.parseBoolean(actionKeywords.get("screenshot"));
        int locatorId = Integer.parseInt(actionKeywords.get("locatorId"));
        Locator locator = locatorRepository.findById(locatorId).orElseThrow(() -> new RuntimeException("Locator not found"));
        String locatorType = locator.getLocatorType1();
        String locatorValue = locator.getLocatorValue1();
        String locatorType2 = locator.getLocatorType2();
        String locatorValue2 = locator.getLocatorValue2();

        TestResults testResult = new TestResults();
        testResult.setDescription(description);
        testResult.setTestId(testId);
        testResult.setRunId(runId);

        switch (keyword.toLowerCase()) {
            case "gotourl":
                testResult.setResult(testExecutor.goToURL(value, screenshotValue, testResult));
                break;
            case "typetext":
                testResult.setResult(testExecutor.typeText(locatorType, locatorValue, value, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "typemaskedtext":
                testResult.setResult(testExecutor.typeMaskedText(locatorType, locatorValue, value, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "cleartext":
                testResult.setResult(testExecutor.clearText(locatorType, locatorValue, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "click":
                testResult.setResult(testExecutor.click(locatorType, locatorValue, value, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "doubleclick":
                testResult.setResult(testExecutor.doubleClick(locatorType, locatorValue, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "getvalue":
                testResult.setResult(testExecutor.getValue(locatorType, locatorValue, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "typevalue":
                testResult.setResult(testExecutor.typeValue(locatorType, locatorValue, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "scrolltobottom":
                testResult.setResult(testExecutor.scrollToBottom(screenshotValue, testResult));
                break;
            case "scrolltotop":
                testResult.setResult(testExecutor.scrollToTop(screenshotValue, testResult));
                break;
            case "scrolltoelement":
                testResult.setResult(testExecutor.scrollToElement(locatorType, locatorValue, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "generaterandomnumber":
                testResult.setResult(testExecutor.generateRandomNumber(locatorType, locatorValue, value, locatorType2, locatorValue2));
                break;
            case "generaterandomtext":
                testResult.setResult(testExecutor.generateRandomText(locatorType, locatorValue, value, locatorType2, locatorValue2));
                break;
            case "waitfor":
                testResult.setResult(testExecutor.waitFor(value));
                break;
            case "waitforelement":
                testResult.setResult(testExecutor.waitForElement(locatorType, locatorValue, locatorType2, locatorValue2));
                break;
            case "verifytext":
                testResult.setResult(testExecutor.verifyText(locatorType, locatorValue, value, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "verifyelement":
                testResult.setResult(testExecutor.verifyElement(locatorType, locatorValue, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "verifyurl":
                testResult.setResult(testExecutor.verifyURL(value, screenshotValue, testResult));
                break;
            case "verifypagetitle":
                testResult.setResult(testExecutor.verifyPageTitle(value, screenshotValue, testResult));
                break;
            case "selectfromdropdown":
                testResult.setResult(testExecutor.selectFromDropdown(locatorType, locatorValue, value, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "mousehover":
                testResult.setResult(testExecutor.mouseHover(locatorType, locatorValue, locatorType2, locatorValue2, screenshotValue, testResult));
                break;
            case "refreshpage":
                testResult.setResult(testExecutor.refreshPage(screenshotValue, testResult));
                break;
            case "enter":
                testResult.setResult(testExecutor.enter(locatorType, locatorValue, locatorType2, locatorValue2));
                break;
            case "downkeyandenter":
                testResult.setResult(testExecutor.downKeyAndEnter());
                break;
            case "acceptalert":
                testResult.setResult(testExecutor.acceptAlert(screenshotValue, testResult));
                break;
            case "dismissalert":
                testResult.setResult(testExecutor.dismissAlert(screenshotValue, testResult));
                break;
            case "closebrowser":
                testResult.setResult(testExecutor.closeBrowser());
                break;
            case "fileupload":
                testResult.setResult(testExecutor.fileUpload(locatorType, locatorValue, value, locatorType2, locatorValue2));
                break;
            case "draganddrop":
                testResult.setResult(testExecutor.dragAndDrop(locatorType, locatorValue));
                break;
            case "rightclick":
                testResult.setResult(testExecutor.rightClick(locatorType, locatorValue, locatorType2, locatorValue2));
                break;
            default:
                throw new IllegalArgumentException("Invalid keyword: " + keyword);
        }
        executionResults.add(testResult);
    }

    public void resetExecutionResults() {
        executionResults.clear();
        testExecutorThreadLocal.get().resetExecutionFlag();
    }

    public void openBrowser(String browser) {
        testExecutorThreadLocal.get().openBrowser(browser);
    }
}
