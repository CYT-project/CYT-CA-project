package com.marketforge.backend.e2e;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

class HomePageSeleniumTest {

    private static final String FRONTEND_URL = "http://localhost:5173/";

    @Test
    @Disabled("E2E test requires running frontend and configured WebDriver; enable manually when environment is ready")
    @DisplayName("Home page shows hero title and Browse Marketplace button")
    void homePageDisplaysHeroAndBrowseButton() {
        WebDriver driver = new ChromeDriver();

        try {
            driver.get(FRONTEND_URL);

            WebElement title = driver.findElement(By.xpath("//*[contains(text(),'Discover Amazing Digital Assets')]"));
            WebElement browseButton = driver.findElement(By.xpath("//*[contains(text(),'Browse Marketplace')]"));

            assert title.isDisplayed();
            assert browseButton.isDisplayed();
        } finally {
            driver.quit();
        }
    }
}