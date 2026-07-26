async (page) => {
  await page.setViewportSize({ width: 430, height: 932 })
  await page.evaluate(() => localStorage.setItem('colorwalk-locale', 'en'))
  await page.reload()
  await page.locator('.camera-cta').click()

  for (let index = 0; index < 8; index += 1) {
    await page.locator('input[type=file]').first().setInputFiles('D:/JongUk/Documents/ColorWalk/public/brand/hueday-mark-transparent.png')
    await page.getByRole('button', { name: 'Use photo' }).click()
    await page.waitForFunction((expected) => document.querySelector('.camera-pill')?.textContent?.includes(expected), `${index + 1}/8`)
    if (index === 0) {
      await page.reload()
      await page.locator('.camera-cta').click()
      await page.locator('.camera-pill').waitFor()
      await page.locator('.camera-pill').evaluate((element) => {
        if (!element.textContent?.includes('1/8')) throw new Error('The first photo draft was not restored after reload.')
      })
    }
  }

  await page.getByRole('button', { name: 'Write journal' }).click()
  await page.getByRole('button', { name: 'Save Story' }).click()
  await page.getByRole('button', { name: 'Save' }).last().click()
  await page.screenshot({ path: 'D:/JongUk/Documents/ColorWalk/output/playwright/core-funnel/core-funnel-430x932.png' })
}
