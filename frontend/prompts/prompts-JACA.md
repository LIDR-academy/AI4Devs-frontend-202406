# Cursor Prompts

```markdown
Act as an expert Senior React Software Engineer and understand and verify the implementation of this LTI frontend application that is under the @frontend folder.

We'll add a new page to the application following the current implementation of the application.

Ask any questions you need to understand the current implementation.
```

```markdown
1. The new page will display the Interview Steps for a selected Application (in the Positions pages) and the Candidates that are in each Interview Step. The page must show a Kaban-style list where each column will be the Interview Steps and the cards will be the Candidates. It must be possible to move the Candidates from one interview step to another using a Drag & Drop functionality.

2. The page will be accessible from the Positions component when clicking on the "Ver proceso" button of a position.

3. Yes, it's necessary to use two endpoints to retrieve the required data:
   - GET /position/:positionId/interviewFlow to retrieve the full list of interview steps for the given position.
   - GET /position/:positionId/candidates to retrieve the full list of candidates for the given position that includes the current step of the interview for each candidate.
   Besides, another endpoint must be used to update the current step of the interview for a candidate:
   - PUT /candidate/:candidateId to update the current step of the interview for a candidate with the following body:
   ```json
   {
      "applicationId": "1", // The id of the application
      "currentInterviewStep": "3" // The id of the new interview step
    }
   ```

4. Use the existing components and structure of the application to add the new page that should include:
  - Title with the name of the position.
  - A list of interview steps in form of a Kaban-style list. (Many columns as interview steps)
  - For each interview step:
    - Title
    - A list of candidates
  - Each candidate card should display:
    - In the first row, the candidate's name
    - In the second row, the average score displayed as green circles
    - Actions:
      - Move candidate
  - At the bottom of the page, an left arrow button to go back to the Positions page.
  - The page must be responsive displaying the Kanban columns in vertical orientation.

You can use the mock up in mockup-JACA.avif file as reference to build the page.

Ask any questions you need to understand the current implementation.
```

```markdown
I got this error during execution time when opening the Interview Steps page

```
ERROR
Cannot read properties of undefined (reading 'map')
TypeError: Cannot read properties of undefined (reading 'map')
    at InterviewSteps (http://localhost:3000/static/js/bundle.js:1098:34)
    at renderWithHooks (http://localhost:3000/static/js/bundle.js:66875:22)
    at updateFunctionComponent (http://localhost:3000/static/js/bundle.js:70442:24)
    at beginWork (http://localhost:3000/static/js/bundle.js:72161:20)
    at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:57131:18)
    at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:57175:20)
    at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:57232:35)
    at beginWork$1 (http://localhost:3000/static/js/bundle.js:77130:11)
    at performUnitOfWork (http://localhost:3000/static/js/bundle.js:76378:16)
    at workLoopSync (http://localhost:3000/static/js/bundle.js:76301:9)
```
```

```markdown
There's a new error

```
react-beautiful-dndA setup problem was encountered.> Invariant failed: A Droppable requires a [string] droppableId. Provided: [number]
```
```

```markdown
There's an error when trying to drag n' drop the candidates

```
react-beautiful-dndUnable to find draggable with id: 1
```
```

```markdown
When dropping a candidate into an empty step, it doesn't work and get the candidate back to its initial value.
```

```markdown
The Drag n Drop functionality is not working when trying to move a candidate.
```

Position name title aligned to left
```

```markdown
Center the entire content of the page
```
