# 0.0.2 (03/08/2017)

- updates travis script
- updates readme to have badge that points to coverage service
- updates package.json to send coverage details to coverage service
- we don't need build dependencies
- remove support for node 4
- minor improvements
  - fixes coverage page using an incorrect interface for CoverageChart
  - fixes coverageFile page to have the same layout as the other coverage pages
    - updates screenshot
  - adds the error on the page to the error view in all coverage pages
  - uses the window location to generate the code snippet on the main page
    - updates screenshots
- captures ci information
- updates main page to show the correct way to get tap coverage
- updates routes to accept ci data from cli
