# PROMPTS

## 1. Frontend review

I want you review and analyze the @frontend please let me know if the project accomplish good standards and quality for a frontend. 

## 2. Position page

Based on your analysis let me know how viable is to implement an interface for `Positions`: It should be a page to view and manage the different candidates for a specific position.

Please avoid having any implementation just analyze and ask me any doubt you have.

The details for the page are the following: 

**The interface shold be kanban-like**

 1. Displaying candidates as cards inside different columns that represent the phases of the hiring process.
 2. We need to be able to update the phase of a candidate by simply dragging the candidate card to another column.
 3. In the image attached check an example of the interface
 4. Requirements from the design team that can be seen in the example are:
    a- The title of the position must be displayed at the top to provide context on the position.
    b- Add an arrow at the left of the title, to navigate and return to the list of positions.
    c- There should be as many columns as there are phases in the process.
    d- Each candidate's card should be placed in the corresponding phase, and should show their full name and average score.
    e- The design should be responsible, It should be possible to display properly on mobile (the phases vertically occupying the entire width), 

**Observations:**

  - Assume that the Position page is there
  - Assume that the overall structure of the page exists, which includes common elements like the top menu and footer.
  - What you are creating is the internal content of the page.

**Backend to support the frontend**

1- GET /positions/:id/interviewFlow

This endpoint returns information about the hiring process for a given position:

  * positionName: Title of the position
  * interviewSteps: ID and name of the different phases that make up the hiring process

```json
{
      "positionName": "Senior backend engineer",
      "interviewFlow": {
              
              "id": 1,
              "description": "Standard development interview process",
              "interviewSteps": [
                  {
                      "id": 1,
                      "interviewFlowId": 1,
                      "interviewTypeId": 1,
                      "name": "Initial Screening",
                      "orderIndex": 1
                  },
                  {
                      "id": 2,
                      "interviewFlowId": 1,
                      "interviewTypeId": 2,
                      "name": "Technical Interview",
                      "orderIndex": 2
                  },
                  {
                      "id": 3,
                      "interviewFlowId": 1,
                      "interviewTypeId": 3,
                      "name": "Manager Interview",
                      "orderIndex": 2
                  }
              ]
          }
  }
```

2- GET /positions/:id/candidates

This endpoint returns all candidates in process for a given position, i.e. all applications for a given positionID. It provides the following information:

  - name: Full name of the candidate
  - current_interview_step: Which stage of the process the candidate is in.
  - score: The average score of the candidate

```json
[
      {
           "fullName": "Jane Smith",
           "currentInterviewStep": "Technical Interview",
           "averageScore": 4
       },
       {
           "fullName": "Carlos García",
           "currentInterviewStep": "Initial Screening",
           "averageScore": 0            
       },        
       {
           "fullName": "John Doe",
           "currentInterviewStep": "Manager Interview",
           "averageScore": 5            
      }    
 ]
```

3- PUT /candidates/:id/stage

This endpoint updates the stage of the moved candidate. It allows to modify the current phase of the interview process that a specific candidate is in, by using the "new_interview_step" parameter and providing the interview_step_id corresponding to the column in which the candidate is now located.

Parameters:
```json
{
     "applicationId": "1",
     "currentInterviewStep": "3"
}
```

Result:
```json
{    
    "message": "Candidate stage updated successfully",
     "data": {
         "id": 1,
         "positionId": 1,
         "candidateId": 1,
         "applicationDate": "2024-06-04T13:34:58.304Z",
         "currentInterviewStep": 3,
         "notes": null,
         "interviews": []    
     }
 }
```

## 3. Answering questions

> 1. State Management Preferences:
> Do you prefer using a state management library like Redux, or are you inclined towards leveraging React's Context API and hooks for state management?

Use the same that is set in the @frontend, let me know if there isn't any.

> 2. Design Specifics:
> Can you provide more details or resources related to the "example of the interface" mentioned? This will help in understanding the exact design expectations and any specific UI elements required.

 Check the image attached.

> 3. Candidate Data Handling:
> How frequently is the candidate data expected to change? Is real-time synchronization (e.g., using WebSockets) a requirement, or is periodic 
 fetching sufficient?

The data is periodic on demand, not using websockets, just when the page is accessed.

> 4. User Roles and Permissions:
> Are there different user roles with varying permissions that might affect who can view or modify the candidate stages on the Kanban board?

None roles implemented

> 5. Styling Consistency:
> Should the new interface adhere strictly to the existing Bootstrap-based styling, or is there flexibility to incorporate other styling approaches like CSS Modules or Styled Components?

Adhere to the current existing styling in @frontend

> 6. Handling Edge Cases:
> How should the system handle edge cases, such as a candidate being moved to a phase that doesn’t exist or API failures during stage updates?

None edge cases

> 7. Deployment and Environment:
> Are there specific deployment considerations or environments (e.g., staging, production) that need to be accounted for during development?

None considerations for deployments

> 8. Performance Metrics:
> Are there any specific performance benchmarks or metrics that the new interface should meet?

None this time

## 4. Implementation

- Let's begin with the implementation, please go step by step and create the different components and pages that are needed for the interface.

- I want you to improve the UI of the Candidate card using the same as the pic attached, please use the same colors and styles.

![alt text](image.png)

## 5. Fixing and Adjustments

* On runtime there is an error in the PositionDetails page, line: ` const sortedSteps = res.data.interviewFlow.interviewSteps.sort((a, b) => a.orderIndex - b.orderIndex);`  KanbanBoard.tsx:50 Error fetching interview flow: TypeError: Cannot read properties of undefined (reading 'sort')
    at fetchInterviewFlow (KanbanBoard.tsx:47:1)

* Looks like an error n the payload, please fix it, this is the current result:
```json
{
    "interviewFlow": {
        "positionName": "Senior Full-Stack Engineer",
        "interviewFlow": {
            "id": 1,
            "description": "Standard development interview process",
            "interviewSteps": [
                {
                    "id": 1,
                    "interviewFlowId": 1,
                    "interviewTypeId": 1,
                    "name": "Initial Screening",
                    "orderIndex": 1
                }]
        }
    }
}
```
* have the following error now : --- ERROR
Cannot read properties of undefined (reading 'toString')
TypeError: Cannot read properties of undefined (reading 'toString')
    at CandidateCard (http://localhost:3000/static/js/bundle.js:823:31)
