package com.keyworddrivenframework.sample1.Utils;

import com.keyworddrivenframework.sample1.Entity.TestResults;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Files;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class TestExecutor {

    private static final Logger log = LoggerFactory.getLogger(TestExecutor.class);
    private WebDriver driver;
    private Map<String, String> obtainedValues = new HashMap<>();
    private boolean executionFailed = false;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom RANDOM = new SecureRandom();

    //method for checking whether execution is failed or not
    private boolean isExecutionFailed() {
        if (executionFailed) {
            System.out.println("EXECUTION ABORTED");
            return true;
        }
        return false;
    }

    //method for checking whether driver is null or not
    private boolean isDriverNull() {
        if (driver == null) {
            System.err.println("Browser is not open. Call openBrowser() first.");
            return true;
        }
        return false;
    }

    //method for capturing screenshot only if the screenshotValue is true
    private void captureScreenshotIfRequired(Boolean screenshotValue, TestResults testResults) {
        if (screenshotValue) {
            testResults.setScreenshotLink(captureScreenshot());
        }
    }

    //method for handling exception
    private void handleException(Exception e) {
        e.printStackTrace();
        executionFailed = true;
    }

    //case of openbrowser through checkboxes
    public String openBrowser(String value) {
        try {
            switch (value.toLowerCase()) {
                case "chrome":
                    System.setProperty("webdriver.chrome.driver", "/home/vaikashmb/Downloads/chromedriver-linux64/chromedriver");
                    driver = new ChromeDriver();
                    break;
                case "chrome-headless":
                    System.setProperty("webdriver.chrome.driver", "/home/vaikashmb/Downloads/chromedriver-linux64/chromedriver");
                    ChromeOptions chromeoptions = new ChromeOptions();
                    chromeoptions.addArguments("--headless");
                    driver = new ChromeDriver(chromeoptions);
                    break;
                case "edge":
                    System.setProperty("webdriver.edge.driver", "/home/vaikashmb/Downloads/edgedriver-linux64-new/msedgedriver");
                    driver = new EdgeDriver();
                    break;
                case "edge-headless":
                    System.setProperty("webdriver.edge.driver", "/home/vaikashmb/Downloads/edgedriver-linux64-new/msedgedriver");
                    EdgeOptions edgeoptions = new EdgeOptions();
                    edgeoptions.addArguments("--headless");
                    driver = new EdgeDriver(edgeoptions);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid browser type specified. Supported types: Chrome, Microsoft-Edge");
            }
            driver.manage().window().maximize();
            System.out.println("Opening the browser: " + value);
            return "PASS";
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
    }

    //keyword for navigating to a specific url
    public String goToURL(String value, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            driver.get(value);
            captureScreenshotIfRequired(screenshotValue, testResults);
            System.out.println("Navigating to URL: " + value);
            return "PASS";
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for uploading a file
    public String fileUpload(String locatorType, String locatorValue, String value, String locatorType2, String locatorValue2) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception e2) {
                    handleException(e2);
                    return "FAIL";
                }
            }

            if (element != null) {
                element.sendKeys(value);
                System.out.println("File Uploaded Successfully");
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for verifying whether the provided url is the same as the navigated url
    public String verifyURL(String value, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            captureScreenshotIfRequired(screenshotValue, testResults);
            String URL = driver.getCurrentUrl();
            if (URL.equals(value)) {
                System.out.println("URL is verified");
                return "PASS";
            } else {
                System.out.println("URL does not match provided url");
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for verifying the page title equals the provided title
    public String verifyPageTitle(String value, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            captureScreenshotIfRequired(screenshotValue, testResults);
            String title = driver.getTitle();
            if (title.equalsIgnoreCase(value)) {
                System.out.println("Page Title is :" + title + " and matches with " + value);
                return "PASS";
            } else {
                System.out.println("Page Title does not Match with " + title);
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }
//keyword for entering text in the provided element
    public String typeText(String locatorType, String locatorValue, String value, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception e2) {
                    handleException(e2);
                    return "FAIL";
                }
            }

            if (element != null) {
                highlightElement(element);
                element.clear();
                element.sendKeys(value);
                captureScreenshotIfRequired(screenshotValue, testResults);
                Thread.sleep(1000);
                unhighlightElement(element);
                System.out.println(locatorValue + " entered");
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }
//keyword for clicking the provided element
    public String click(String locatorType, String locatorValue, String value, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";

            String[] values = value.split(",");
            String dynamicXpath = locatorValue.replace("value1", values[0].trim());
            if (values.length == 2) {
                dynamicXpath = dynamicXpath.replace("value2", values[1].trim());
            }
            By locator = createLocator(locatorType, dynamicXpath);

            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                String dynamicXpath2 = locatorValue2.replace("value1", values[0].trim());
                if (values.length == 2) {
                    dynamicXpath2 = dynamicXpath2.replace("value2", values[1].trim());
                }
                By locator2 = createLocator(locatorType2, dynamicXpath2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception e2) {
                    handleException(e2);
                    return "FAIL";
                }
            }

            if (element != null) {
                highlightElement(element);
                Thread.sleep(1000);
                captureScreenshotIfRequired(screenshotValue, testResults);
                Thread.sleep(1000);
                unhighlightElement(element);
                Thread.sleep(1000);
                element.click();
                System.out.println(locatorValue + " Clicked");
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }


    //keyword for double-clicking the provided element
    public String doubleClick(String locatorType, String locatorValue, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception e2) {
                    handleException(e2);
                    return "FAIL";
                }
            }

            if (element != null) {
                highlightElement(element);
                captureScreenshotIfRequired(screenshotValue, testResults);
                Thread.sleep(1000);
                unhighlightElement(element);
                Thread.sleep(1000);
                Actions actions = new Actions(driver);
                actions.doubleClick(element).perform();
                System.out.println(locatorValue + " Double Clicked");
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for pressing the down-key in the keyboard and clicking enter
    public String downKeyAndEnter() {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            Actions actions = new Actions(driver);
            actions.sendKeys(Keys.DOWN, Keys.ENTER).perform();
            System.out.println("DownKey and Enter performed");
            return "PASS";
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for scrolling to the bottom of the page by the provided pixels
    public String scrollToBottom(Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("window.scrollBy(0,500)", "");
            captureScreenshotIfRequired(screenshotValue, testResults);
            System.out.println("Scrolled Down");
            return "PASS";
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for scrolling to the top of the page by the provided pixels
    public String scrollToTop(Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("window.scrollBy(0,-500)", "");
            captureScreenshotIfRequired(screenshotValue, testResults);
            System.out.println("Scrolled Up");
            return "PASS";
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for scrolling towards a particular element
    public String scrollToElement(String locatorType, String locatorValue, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception e2) {
                    handleException(e2);
                    return "FAIL";
                }
            }
            if (element != null) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
                captureScreenshotIfRequired(screenshotValue, testResults);
                System.out.println("Scrolled to element: " + locatorValue);
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for storing a particular value in the hashmap named obtainedValues
    public String getValue(String locatorType, String locatorValue, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }

            if (element != null) {
                highlightElement(element);
                captureScreenshotIfRequired(screenshotValue, testResults);
                String obtainedValue = element.getAttribute("value");
                obtainedValues.put("lastObtainedValue", obtainedValue);
                unhighlightElement(element);
                System.out.println("value obtained is: " + obtainedValue);
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for generating a random number and storing it in the hashmap using a specific key
    public String generateRandomNumber(String locatorType, String locatorValue, String value, String locatorType2, String locatorValue2) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                String[] values = value.split(",");
                int number1 = Integer.parseInt(values[0]);
                int number2 = Integer.parseInt(values[1]);
                String randomNumber = String.valueOf(ThreadLocalRandom.current().nextInt(number1, number2));
                obtainedValues.put("obtainedRandomNumber", randomNumber);
                String generatedRandomNumber = getLastGeneratedRandomValue();
                element.clear();
                element.sendKeys(generatedRandomNumber);
                System.out.println("generated random number is :" + generatedRandomNumber);
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for generating a random text and storing it in a hashmap using a specific key
    public String generateRandomText(String locatorType, String locatorValue, String value, String locatorType2, String locatorValue2) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                int length = Integer.parseInt(value);
                StringBuilder sb = new StringBuilder(length);
                for (int i = 0; i < length; i++) {
                    int randomIndex = RANDOM.nextInt(CHARACTERS.length());
                    sb.append(CHARACTERS.charAt(randomIndex));
                }
                String randomText = sb.toString();
                obtainedValues.put("obtainedRandomText", randomText);
                String generatedRandomText = getLastGeneratedRandomText();
                element.sendKeys(generatedRandomText);
                System.out.println("Generated random text is: " + generatedRandomText);
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for closing the browser
    public String closeBrowser() {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            driver.quit();
            System.out.println("browser closed");
            return "PASS";
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for setting a wait time
    public String waitFor(String value) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            long duration = Long.parseLong(value) * 1000;
            Thread.sleep(duration);
            System.out.println("Waited for " + value + " seconds");
            return "PASS";
        } catch (InterruptedException e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for waiting for an element until it is clickable
    public String waitForElement(String locatorType, String locatorValue, String locatorType2, String locatorValue2) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
            By locator = createLocator(locatorType, locatorValue);
            try {
                wait.until(ExpectedConditions.elementToBeClickable(locator));
                System.out.println("waited until the element is clickable");
                return "PASS";
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    wait.until(ExpectedConditions.elementToBeClickable(locator2));
                    System.out.println("waited until the element is clickable");
                    return "PASS";
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for verifying the text which is displayed in the provided element
    public String verifyText(String locatorType, String locatorValue, String value, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                highlightElement(element);
                String text = element.getText();
                if (text.contains(value)) {
                    captureScreenshotIfRequired(screenshotValue, testResults);
                    unhighlightElement(element);
                    System.out.println("Text Verified!");
                    return "PASS";
                } else {
                    System.out.println("Text verification failed");
                    return "FAIL";
                }
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for clearing the text in the provided element
    public String clearText(String locatorType, String locatorValue, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                highlightElement(element);
                element.clear();
                captureScreenshotIfRequired(screenshotValue, testResults);
                Thread.sleep(1000);
                unhighlightElement(element);
                System.out.println("Text cleared from element: " + locatorValue);
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for verifying whether the provided element is displayed or not
    public String verifyElement(String locatorType, String locatorValue, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                highlightElement(element);
                captureScreenshotIfRequired(screenshotValue, testResults);
                if (element.isDisplayed()) {
                    Thread.sleep(1000);
                    unhighlightElement(element);
                    System.out.println("Element having locator value " + locatorValue + " found");
                    return "PASS";
                } else {
                    System.out.println("Element having locator value " + locatorValue + " not found");
                    return "FAIL";
                }
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for selecting an option from a dropdown .This is applicable only for elements with select tag
    public String selectFromDropdown(String locatorType, String locatorValue, String value, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                highlightElement(element);
                captureScreenshotIfRequired(screenshotValue, testResults);
                Select dropdown = new Select(element);
                dropdown.selectByVisibleText(value);
                Thread.sleep(1000);
                unhighlightElement(element);
                System.out.println("Option " + value + " selected from the dropdown");
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for entering masked text like passwords
    public String typeMaskedText(String locatorType, String locatorValue, String value, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                highlightElement(element);
                element.clear();
                element.sendKeys(value);
                captureScreenshotIfRequired(screenshotValue, testResults);
                Thread.sleep(1000);
                unhighlightElement(element);
                System.out.println(locatorValue + " entered");
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for hovering over the provided element
    public String mouseHover(String locatorType, String locatorValue, String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                highlightElement(element);
                captureScreenshotIfRequired(screenshotValue, testResults);
                Actions actions = new Actions(driver);
                actions.moveToElement(element).build().perform();
                Thread.sleep(1000);
                unhighlightElement(element);
                System.out.println("Mouse hovered over element: " + locatorValue);
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for mouse action - Right Click
    public String rightClick(String locatorType, String locatorValue, String locatorType2, String locatorValue2) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                Actions actions = new Actions(driver);
                actions.contextClick(element).perform();
                System.out.println("Element Right-Clicked");
                return "PASS";
            } else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for retrieving the value which was stored in the hashmap and using it again at needful times in the provided element
    public String typeValue(String locatorType, String locatorValue,String locatorType2, String locatorValue2, Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2,locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null){
                highlightElement(element);
                String lastObtainedValue = getLastObtainedValue();
                if (lastObtainedValue == null) {
                    System.err.println("No value obtained previously.");
                    return "FAIL";
                }
                element.sendKeys(lastObtainedValue);
                Thread.sleep(1000);
                element.sendKeys(Keys.ENTER);
                captureScreenshotIfRequired(screenshotValue, testResults);
                Thread.sleep(1000);
                unhighlightElement(element);
                System.out.println("Sent keys to input field: " + lastObtainedValue);
                return "PASS";
            }else {
                return "FAIL";
            }
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for pressing the enter key
    public String enter(String locatorType, String locatorValue, String locatorType2, String locatorValue2) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            By locator = createLocator(locatorType, locatorValue);
            WebElement element = null;
            try {
                element = driver.findElement(locator);
            } catch (Exception e) {
                By locator2 = createLocator(locatorType2, locatorValue2);
                try {
                    element = driver.findElement(locator2);
                } catch (Exception ex) {
                    handleException(ex);
                    return "FAIL";
                }
            }
            if (element != null) {
                element.sendKeys(Keys.ENTER);
                System.out.println("Enter key pressed!");
                return "PASS";
            } else {
                return "FAIL";
            }

        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for refreshing the page
    public String refreshPage(Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            driver.navigate().refresh();
            captureScreenshotIfRequired(screenshotValue, testResults);
            System.out.println("Page refreshed");
            return "PASS";
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for accepting alert dialog boxes
    public String acceptAlert(Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            Alert alert = driver.switchTo().alert();
            alert.accept();
            captureScreenshotIfRequired(screenshotValue, testResults);
            System.out.println("Alert Accepted");
            return "PASS";
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for dismissing alert dialog boxes
    public String dismissAlert(Boolean screenshotValue, TestResults testResults) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";
            Alert alert = driver.switchTo().alert();
            alert.dismiss();
            captureScreenshotIfRequired(screenshotValue, testResults);
            System.out.println("Alert Dismissed");
            return "PASS";
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //keyword for dragging and dropping an element
    public String dragAndDrop(String locatorType, String locatorValue) {
        try {
            if (isExecutionFailed()) return "ABORTED";
            if (isDriverNull()) return "FAIL";

            String[] locatorTypes = locatorType.split(",");
            String[] locatorValues = locatorValue.split(",");

            String locatorType1 = locatorTypes[0].trim();
            String locatorType2 = locatorTypes[1].trim();
            String locatorValue1 = locatorValues[0].trim();
            String locatorValue2 = locatorValues[1].trim();

            By locator1 = createLocator(locatorType1, locatorValue1);
            By locator2 = createLocator(locatorType2, locatorValue2);

            WebElement sourceElement = driver.findElement(locator1);
            WebElement targetElement = driver.findElement(locator2);

            Actions actions = new Actions(driver);
            actions.dragAndDrop(sourceElement, targetElement).perform();
            System.out.println("Element Dragged and Dropped");
            return "PASS";
        } catch (Exception e) {
            handleException(e);
            return "FAIL";
        }
    }

    //method for capturing screenshot
    public String captureScreenshot() {
        try {
            if (isDriverNull()) return "FAIL";
            TakesScreenshot screenshot = (TakesScreenshot) driver;
            File srcFile = screenshot.getScreenshotAs(OutputType.FILE);
            String filename = System.currentTimeMillis() + ".png";
            String filePath = "/home/vaikashmb/Documents/PracticeWorks/Automation-Tool/Keyword Driven framework sample/kdf-fe/keyword-driven-framework/public/screenshots/" + filename;
            File destFile = new File(filePath);
            Files.copy(srcFile.toPath(), destFile.toPath());
            System.out.println("Screenshot captured and saved to: " + filePath);
            return filename;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error in taking the screenshot";
        }
    }

    //method for creating the locator using the locator-type and locator-value
    private By createLocator(String locatorType, String locatorValue) {
        return switch (locatorType.toLowerCase()) {
            case "id" -> By.id(locatorValue);
            case "name" -> By.name(locatorValue);
            case "class", "classname" -> By.className(locatorValue);
            case "tag", "tagname" -> By.tagName(locatorValue);
            case "link", "linktext" -> By.linkText(locatorValue);
            case "partiallink", "partiallinktext" -> By.partialLinkText(locatorValue);
            case "css", "cssselector" -> By.cssSelector(locatorValue);
            case "xpath" -> By.xpath(locatorValue);
            default -> throw new IllegalArgumentException("Invalid locator type: " + locatorType);
        };
    }

    //method for getting the current time
    public static String getCurrentTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    //method for highlighting the provided element
    private void highlightElement(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].style.border='5px solid red'", element);
    }

    //method for unhighlighting the provided element
    private void unhighlightElement(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].style.border=''", element);
    }

    //method which returns the stored value using the getValue keyword
    public String getLastObtainedValue() {
        return obtainedValues.get("lastObtainedValue");
    }

    //method which returns the stored value using the getValue keyword
    public String getLastGeneratedRandomValue() {
        return obtainedValues.get("obtainedRandomNumber");
    }

    //method which returns the stored value using the getValue keyword
    public String getLastGeneratedRandomText() {
        return obtainedValues.get("obtainedRandomText");
    }

    //method to reset the execution flag
    public void resetExecutionFlag() {
        executionFailed = false;
    }
}
