import fs from 'node:fs/promises';

/**
 * Read file
 */
const readFile = async (filePath: string): Promise<string> => {
  const fileContents = await fs.readFile(filePath, {
    encoding: 'utf8',
  });
  const normalizedFileContents = fileContents.trim().split(/\r?\n/).join('\n');
  return normalizedFileContents;
};

/**
 * Parse page ordering rules
 */
const parsePageOrderingRules = (updatesFileContent: string): Array<[number, number]> => {
  return updatesFileContent
    .split('\n\n')[0]
    .split('\n')
    .map((pageRuleAsString) => {
      return pageRuleAsString.split('|').map((pageAsString) => {
        return parseInt(pageAsString, 10);
      }) as [number, number];
    });
};

/**
 * Parse updates
 */
const parseUpdates = (updatesFileContent: string): Array<Array<number>> => {
  return updatesFileContent
    .split('\n\n')[1]
    .split('\n')
    .map((pageRuleAsString) => {
      return pageRuleAsString.split(',').map((pageAsString) => {
        return parseInt(pageAsString, 10);
      });
    });
};

/**
 * Checks whether the given pages are correctly ordered
 */
const arePagesCorrectlyOrdered = (pages: Array<number>, pageOrderingRules: Array<[number, number]>): boolean => {
  return pages.every((page, pageIndex) => {
    // Find page rules
    const applicablePageOrderingRules = pageOrderingRules.filter((pageOrderingRule) => {
      return pageOrderingRule.some((pageOrderingRulePart) => {
        return pageOrderingRulePart === page;
      });
    });

    // Check whether page is valid based on applicable rules
    const isValidPage = applicablePageOrderingRules.every((applicablePageOrderingRule) => {
      return applicablePageOrderingRule[0] === page
        ? pages.slice(0, pageIndex).every((pageBeforeCurrentPage) => {
            return pageBeforeCurrentPage !== applicablePageOrderingRule[1];
          })
        : pages.slice(pageIndex + 1).every((pageAfterCurrentPage) => {
            return pageAfterCurrentPage !== applicablePageOrderingRule[0];
          });
    });

    // Done
    return isValidPage;
  });
};

/**
 * Correct order of pages
 */
const correctOrderOfPages = (pages: Array<number>, pageOrderingRules: Array<[number, number]>): Array<number> => {
  // Re-order pages (in-place mutation) separately from original pages to keep track of progress
  let correctlyOrderedPages = structuredClone(pages);

  // Look at each page, and correct if necessary
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    // Find the last page that needs to be before the current page
    const lastRequiredPreviousPageIndex = Math.max(
      ...pageOrderingRules
        .filter((pageOrderingRule) => {
          return pageOrderingRule[1] === pages[pageIndex];
        })
        .map((pageOrderingRule) => {
          return pageOrderingRule[0];
        })
        .map((previousPage) => {
          return correctlyOrderedPages.indexOf(previousPage);
        }),
    );

    // Skip if this page does not need to be re-ordered (shifted back)
    const pageIndexInCorrectlyOrderedPages = correctlyOrderedPages.indexOf(pages[pageIndex]);
    if (lastRequiredPreviousPageIndex < pageIndexInCorrectlyOrderedPages) {
      continue; // Continue early
    }

    // Re-assemble pages by shifting the current page back behind the last required previous page (in-place mutation)
    correctlyOrderedPages = [
      ...correctlyOrderedPages.slice(0, pageIndexInCorrectlyOrderedPages),
      ...correctlyOrderedPages.slice(pageIndexInCorrectlyOrderedPages + 1, lastRequiredPreviousPageIndex),
      correctlyOrderedPages[lastRequiredPreviousPageIndex],
      correctlyOrderedPages[pageIndexInCorrectlyOrderedPages],
      ...correctlyOrderedPages.slice(lastRequiredPreviousPageIndex + 1),
    ];
  }

  // Done
  return correctlyOrderedPages;
};

/**
 * Calculate sum of middle page numbers
 */
const calculateSumOfMiddlePageNumbers = (updates: Array<Array<number>>): number => {
  return updates
    .map((pages) => {
      return pages[(pages.length - 1) / 2];
    })
    .reduce((sumOfMiddlePageNumbers, middlePageNumber) => {
      return sumOfMiddlePageNumbers + middlePageNumber;
    }, 0);
};

/**
 * Part 1: Calculate sum of middle page numbers of correctly ordered updates
 */
export const calculateSumOfMiddlePageNumbersOfCorrectlyOrderedUpdates = async (updatesFilePath: string) => {
  // Get data
  const updatesFileContent = await readFile(updatesFilePath);
  const pageOrderingRules = parsePageOrderingRules(updatesFileContent);
  const updates = parseUpdates(updatesFileContent);

  // Find correctly ordered updates
  const correctlyOrderedUpdates = updates.filter((pages) => {
    return arePagesCorrectlyOrdered(pages, pageOrderingRules);
  });

  // Calculate sum of middle page numbers of correctly ordered updates
  const sumOfMiddlePageNumbersOfCorrectlyOrderedUpdates = calculateSumOfMiddlePageNumbers(correctlyOrderedUpdates);

  // Done
  return sumOfMiddlePageNumbersOfCorrectlyOrderedUpdates;
};

/**
 * Part 2: Calculate sum of middle page numbers of corrected updates
 */
export const calculateSumOfMiddlePageNumbersOfCorrectedUpdates = async (updatesFilePath: string) => {
  // Get data
  const updatesFileContent = await readFile(updatesFilePath);
  const pageOrderingRules = parsePageOrderingRules(updatesFileContent);
  const updates = parseUpdates(updatesFileContent);

  // Find incorrectly ordered updates
  const incorrectlyOrderedUpdates = updates.filter((pages) => {
    return !arePagesCorrectlyOrdered(pages, pageOrderingRules);
  });

  // Correct incorrectly ordered updates
  const correctedUpdates = incorrectlyOrderedUpdates.map((pages) => {
    return correctOrderOfPages(pages, pageOrderingRules);
  });

  // Calculate sum of middle page numbers of correctly ordered updates
  const sumOfMiddlePageNumbersOfCorrectedUpdates = calculateSumOfMiddlePageNumbers(correctedUpdates);

  // Done
  return sumOfMiddlePageNumbersOfCorrectedUpdates;
};
